// src/utils/dailyGuidance.js
// Generates Today's Focus guidance from Firebase check-in data only.
// No external API calls. Uses device date for season proxy.
// Returns headline (split for italic styling), body text, and actions array.

// ─── helpers ────────────────────────────────────────────────────────────────

const getAverage = (checkIns, field, days = 3) => {
  const recent = checkIns.slice(0, days);
  if (!recent.length) return null;
  const vals = recent.map(c => parseFloat(c[field])).filter(v => !isNaN(v));
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

const getSeason = () => {
  const m = new Date().getMonth(); // 0-indexed
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
};

// ─── rules ──────────────────────────────────────────────────────────────────
// Each rule returns null (skip) or a guidance object.
// Rules are evaluated top-to-bottom; first match wins.
// checkIns array should be sorted newest-first (as UserDataContext provides).

const RULES = [

  // 1. Very low sleep — most urgent physical signal
  (avg) => {
    if (avg.sleep !== null && avg.sleep < 5.5) {
      return {
        headlineStart: 'Sleep debt is building.',
        headlineEm:    'Protect your recovery',
        headlineEnd:   'by keeping today's demands light.',
        body: 'Three nights under 5.5 hours compounds quickly. Avoid high-intensity exercise, keep caffeine before noon only, and aim for a 20-minute rest this afternoon.',
        actions: ['Skip intense workout', '20-min rest', 'Caffeine before noon'],
        tag: 'hormone',
      };
    }
    return null;
  },

  // 2. Low sleep + high stress stacking
  (avg) => {
    if (avg.sleep !== null && avg.sleep < 6.5 && avg.stress !== null && avg.stress > 6) {
      return {
        headlineStart: 'Low sleep and rising stress',
        headlineEm:    'are stacking.',
        headlineEnd:   'Give yourself one less thing today.',
        body: 'Your nervous system is stretched across both. Block one commitment if you can, add a short walk outside, and avoid screens for the first 30 minutes after waking.',
        actions: ['Block one task', '10-min walk outside'],
        tag: 'brain',
      };
    }
    return null;
  },

  // 3. High stress + low mood
  (avg) => {
    if (avg.stress !== null && avg.stress > 7 && avg.mood !== null && avg.mood < 5) {
      return {
        headlineStart: 'Your nervous system needs',
        headlineEm:    'support more than productivity',
        headlineEnd:   'today.',
        body: 'Elevated stress and low mood reinforce each other in a loop. Try 5 minutes of slow breathing before lunch — it directly reduces cortisol and can shift the afternoon.',
        actions: ['5-min breathing', 'Rest before 3pm'],
        tag: 'hormone',
      };
    }
    return null;
  },

  // 4. Low energy + low mood
  (avg) => {
    if (avg.energy !== null && avg.energy < 5 && avg.mood !== null && avg.mood < 5) {
      return {
        headlineStart: 'Low energy and mood',
        headlineEm:    'often travel together.',
        headlineEnd:   'One small win can shift the day.',
        body: 'Don\'t push for a big productive day today — aim for one thing done well. Even making your bed or a short walk outside counts as a genuine win and breaks the loop.',
        actions: ['One small win', 'Short walk'],
        tag: 'brain',
      };
    }
    return null;
  },

  // 5. High stress alone (sustained)
  (avg) => {
    if (avg.stress !== null && avg.stress > 7) {
      return {
        headlineStart: 'Stress has been elevated',
        headlineEm:    'for a few days.',
        headlineEnd:   'Your body is asking for rest.',
        body: 'Sustained stress raises cortisol and suppresses recovery. Prioritise something genuinely restorative today — not productive rest, actual rest.',
        actions: ['Genuine rest', 'No screens after 9pm'],
        tag: 'hormone',
      };
    }
    return null;
  },

  // 6. Summer + lower energy (heat demand proxy)
  (avg) => {
    if (getSeason() === 'summer' && avg.energy !== null && avg.energy < 7) {
      return {
        headlineStart: 'Summer heat raises',
        headlineEm:    'your body\'s baseline demands.',
        headlineEnd:   'Hydration is your priority today.',
        body: 'Higher temperatures increase water and electrolyte loss even at rest. Start with 500ml before 10am, avoid heavy meals mid-afternoon, and keep movement to cooler parts of the day.',
        actions: ['500ml water before 10am', 'Avoid midday sun'],
        tag: 'skin',
      };
    }
    return null;
  },

  // 7. Winter + elevated stress (light + stress depletion)
  (avg) => {
    if (getSeason() === 'winter' && avg.stress !== null && avg.stress > 5) {
      return {
        headlineStart: 'Winter and elevated stress',
        headlineEm:    'both deplete your reserves.',
        headlineEnd:   'Light and warmth matter more than usual.',
        body: 'Cold air, reduced daylight, and stress compound each other\'s effect on mood and energy. Even 10 minutes of natural light outside today makes a measurable difference.',
        actions: ['10-min outside', 'Warm nourishing meal'],
        tag: 'brain',
      };
    }
    return null;
  },

  // 8. Default — stable patterns
  () => ({
    headlineStart: 'Your patterns are steady.',
    headlineEm:    'A good day to build',
    headlineEnd:   "on what's already working.",
    body: 'Energy, sleep, and stress are all in a healthy range. Focus on consistency today — a regular bedtime and one nourishing meal will reinforce what\'s working.',
    actions: ['Consistent bedtime', 'Nourishing meal'],
    tag: 'general',
  }),

];

// ─── main export ─────────────────────────────────────────────────────────────

/**
 * generateDailyGuidance
 * @param {Array} checkIns - Array of check-in objects, newest first, from UserDataContext
 * @returns {Object} guidance - { headlineStart, headlineEm, headlineEnd, body, actions, tag }
 */
export function generateDailyGuidance(checkIns = []) {
  const avg = {
    sleep:  getAverage(checkIns, 'sleep_hours', 3),
    stress: getAverage(checkIns, 'stress_level', 3),
    energy: getAverage(checkIns, 'energy', 3),
    mood:   getAverage(checkIns, 'mood', 3),
  };

  for (const rule of RULES) {
    const result = rule(avg);
    if (result) return result;
  }

  // Fallback (should never reach here — last rule always fires)
  return RULES[RULES.length - 1]();
}

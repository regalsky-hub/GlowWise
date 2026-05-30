// src/lib/buildUserContext.js
// Digests raw profile + check-in data into the clean, structured context block
// the GlowWise coach expects. Assumes checkIns are sorted newest-first
// (handled in UserDataContext).

const round1 = (n) => Math.round(n * 10) / 10;

function average(values) {
  const nums = values.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (nums.length === 0) return null;
  return round1(nums.reduce((sum, v) => sum + v, 0) / nums.length);
}

// Pull symptom/note text out of a check-in, whatever field it's stored under.
function extractSymptoms(checkIn) {
  const raw = checkIn.symptoms ?? checkIn.notes ?? checkIn.observations ?? null;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((s) => String(s).trim()).filter(Boolean);
  return String(raw)
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function computeTrend(recent) {
  if (recent.length < 4) return null; // not enough data to call a direction
  const mid = Math.floor(recent.length / 2);
  const newer = recent.slice(0, mid);   // most recent days
  const older = recent.slice(mid);      // earlier days

  const score = (group) => {
    const e = average(group.map((c) => c.energy)) ?? 0;
    const m = average(group.map((c) => c.mood)) ?? 0;
    const s = average(group.map((c) => c.stress_level)) ?? 0;
    return e + m - s; // higher energy/mood good, higher stress bad
  };

  const diff = score(newer) - score(older);
  if (diff > 1) return 'improving';
  if (diff < -1) return 'declining';
  return 'steady';
}

export function buildUserContext({ profile, checkIns = [], glowType = null, glowScore = 0 } = {}) {
  const recent = checkIns.slice(0, 7); // newest-first, last 7 days

  const averages = recent.length
    ? {
        energy: average(recent.map((c) => c.energy)),
        sleepHours: average(recent.map((c) => c.sleep_hours)),
        stress: average(recent.map((c) => c.stress_level)),
        mood: average(recent.map((c) => c.mood)),
      }
    : null;

  // Tally symptom mentions to surface what recurs
  const symptomCounts = {};
  recent.forEach((c) => {
    extractSymptoms(c).forEach((s) => {
      const key = s.toLowerCase();
      symptomCounts[key] = (symptomCounts[key] || 0) + 1;
    });
  });
  const topRecurringSymptoms = Object.entries(symptomCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([symptom, count]) => ({ symptom, count }));

  const recentCheckIns = recent.map((c) => ({
    date: c.date || null,
    energy: c.energy ?? null,
    sleepHours: c.sleep_hours ?? null,
    stress: c.stress_level ?? null,
    mood: c.mood ?? null,
    symptoms: extractSymptoms(c),
  }));

  return {
    name: profile?.name || null,
    glowType: glowType || profile?.glowType || null,
    glowScore: glowScore ?? 0,
    totalCheckIns: checkIns.length,
    averages,
    recentTrend: computeTrend(recent),
    topRecurringSymptoms,
    recentSymptoms: recent.flatMap((c) => extractSymptoms(c)),
    wellnessPriorities: profile?.wellness_priorities || [],
    recentCheckIns,
  };
}

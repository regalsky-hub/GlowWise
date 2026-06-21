import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Send, Trash2, Plus, Menu, X, ChevronLeft } from 'lucide-react';
import { db } from '../config/firebase';
import {
  collection, addDoc, getDocs, updateDoc, doc, deleteDoc,
  query, orderBy, limit
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

// ---------- Real OpenAI call via Vercel serverless function ----------
async function getAIResponse(userMessage, history, profile) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage,
        history,
        userContext: profile || null,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed (${response.status})`);
    }

    const data = await response.json();
    return data.reply;
  } catch (err) {
    console.error('getAIResponse failed:', err);
    throw err;
  }
}

// ---------- Date / time helpers ----------
const toDate = (ts) => {
  if (!ts) return new Date();
  if (ts.toDate) return ts.toDate();
  return new Date(ts);
};

const formatTime = (ts) => {
  return toDate(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const formatDateDivider = (ts) => {
  const d = toDate(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (msgDay.getTime() === today.getTime()) return 'Today';
  if (msgDay.getTime() === yesterday.getTime()) return 'Yesterday';
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long',
    ...(sameYear ? {} : { year: 'numeric' })
  });
};

const formatRelativeTime = (ts) => {
  const d = toDate(ts);
  const now = new Date();
  const diffMins = Math.floor((now - d) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatDateDivider(d);
};

const getConversationPreview = (conv) => {
  const msgs = conv.messages || [];
  const firstUserMsg = msgs.find(m => m.role === 'user');
  if (firstUserMsg) {
    const t = firstUserMsg.content;
    return t.length > 48 ? t.slice(0, 48) + '…' : t;
  }
  return 'New conversation';
};

const groupConversations = (convs) => {
  const groups = { today: [], yesterday: [], week: [], older: [] };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  convs.forEach(c => {
    const d = toDate(c.updated_at);
    const cDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (cDay.getTime() === today.getTime()) groups.today.push(c);
    else if (cDay.getTime() === yesterday.getTime()) groups.yesterday.push(c);
    else if (d > weekAgo) groups.week.push(c);
    else groups.older.push(c);
  });
  return groups;
};

const buildUserContext = (profile, checkIns, glowScore) => {
  const recent = (checkIns || []).slice(0, 7);

  const avg = (field) => {
    const vals = recent.map(c => parseFloat(c[field])).filter(v => !isNaN(v));
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const recentSymptoms = [...new Set(
    recent.flatMap(c => c.symptoms || []).filter(Boolean)
  )].slice(0, 10);

  const recurringSymptoms = {};

  recent.forEach(c => {
    (c.symptoms || []).forEach(symptom => {
      recurringSymptoms[symptom] =
        (recurringSymptoms[symptom] || 0) + 1;
    });
  });

  const topRecurringSymptoms = Object.entries(recurringSymptoms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([symptom, count]) => ({
      symptom,
      count,
    }));

  const wellnessPriorities =
    profile?.wellness_priorities || [];

  // recent is newest-first, so compare the most recent days with the earlier ones
  const trendFor = (field, higherIsBetter = true) => {
    if (recent.length < 4) return null;
    const mid = Math.floor(recent.length / 2);
    const toNums = (arr) => arr.map(c => parseFloat(c[field])).filter(v => !isNaN(v));
    const newer = toNums(recent.slice(0, mid));
    const older = toNums(recent.slice(mid));
    if (!newer.length || !older.length) return null;
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const change = mean(newer) - mean(older); // positive = value has risen recently
    let direction = 'steady';
    if (change > 0.5) direction = higherIsBetter ? 'improving' : 'rising';
    else if (change < -0.5) direction = higherIsBetter ? 'declining' : 'easing';
    return { direction, change: Number(change.toFixed(1)) };
  };

  const recentTrend = {
    sleep: trendFor('sleep_hours', true),
    stress: trendFor('stress_level', false),
    energy: trendFor('energy', true),
    mood: trendFor('mood', true),
  };

  const checkInSummaries = recent.map(c => ({
    date: c.created_at?.toDate?.().toLocaleDateString('en-GB') || 'recent',
    energy: c.energy,
    sleep: c.sleep_hours,
    stress: c.stress_level,
    mood: c.mood,
    symptoms: c.symptoms?.join(', ') || '',
  }));

  return {
    name: profile?.name || 'User',
    glowType: profile?.glowType || null,
    glowScore: glowScore || null,
    averages: {
      energy: avg('energy'),
      sleep: avg('sleep_hours'),
      stress: avg('stress_level'),
      mood: avg('mood'),
    },
    recentSymptoms,
    recentCheckIns: checkInSummaries,
    totalCheckIns: (checkIns || []).length,

    topRecurringSymptoms,
    wellnessPriorities,
    recentTrend,
    // Stable onboarding context — what the user told us about themselves up front
    about: {
      age: profile?.age || null,
      gender: profile?.gender || null,
      glowTypeDescription: profile?.glowTypeDescription || null,
      focusAreas: profile?.focusAreas || [],
      healthContext: profile?.health_context || null,
      medications: profile?.medications || null,
      supplements: profile?.supplements || null,
      stressTriggers: profile?.stress_trigger_list || [],
      dietType: profile?.diet_type || null,
      initialBodySignals: profile?.body_signals || null,
    },
  };
};

export default function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { profile, checkIns, glowScore } = useUserData();
  const location = useLocation();
  const navigate = useNavigate();

  const userName = profile?.name || 'there';

  // Card context — set when arriving from a Home insight card (Discovery/
  // Improvement/Recommendation). Consumed once, then cleared from history so
  // refreshing the page or navigating back doesn't re-trigger the auto-send.
  const cardContext = location.state?.fromCard
    ? { fromCard: location.state.fromCard, text: location.state.text }
    : null;
  const isPaid = profile?.subscription_tier === 'paid';
  const FREE_LIMIT = 2;
  const atLimit = !isPaid && dailyCount >= FREE_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!user) return;
    initialiseChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const initialiseChat = async () => {
    await loadAllConversations();
    if (cardContext) {
      // Arriving from a Home card always starts a fresh, topic-specific
      // conversation rather than continuing an old thread — keeps each
      // conversation coherent around the thing the user clicked into.
      setConversationId(null);
      setMessages([]);
      // Clear the router state immediately so a refresh or back-navigation
      // doesn't re-trigger the auto-send on the same page instance.
      navigate(location.pathname, { replace: true, state: {} });
      await sendCardOpeningMessage(cardContext);
    } else {
      await loadLatestConversation();
    }
  };

  // Builds a coach-voiced opening line from the card's text and sends it
  // immediately on arrival, as if the coach is continuing the thought from
  // the card rather than waiting for the user to start typing.
  const sendCardOpeningMessage = async (ctx) => {
    const openers = {
      discovery: `I wanted to dig into something I noticed: ${ctx.text}`,
      improvement: `I wanted to follow up on this: ${ctx.text}`,
      recommendation: `Let's talk through this recommendation: ${ctx.text}`,
    };
    const openingText = openers[ctx.fromCard] || `Let's talk about this: ${ctx.text}`;
    await sendMessageProgrammatically(openingText);
  };
</parameter>

  const loadAllConversations = async () => {
    try {
      const convsRef = collection(db, 'users', user.uid, 'conversations');
      const q = query(convsRef, orderBy('updated_at', 'desc'));
      const snap = await getDocs(q);
      // Filter out empty conversations from the displayed list
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.messages && c.messages.length > 0);
      setConversations(list);
      return list;
    } catch (e) {
      console.error('Load all conversations failed:', e);
      return [];
    }
  };

  // Load most recent NON-EMPTY conversation. If none, leave state empty (welcome screen).
  const loadLatestConversation = async () => {
    try {
      const convsRef = collection(db, 'users', user.uid, 'conversations');
      const q = query(convsRef, orderBy('updated_at', 'desc'), limit(10));
      const snap = await getDocs(q);
      const nonEmpty = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .find(c => c.messages && c.messages.length > 0);
      if (nonEmpty) {
        setConversationId(nonEmpty.id);
        setMessages(nonEmpty.messages);
      }
      // else: leave conversationId null — will be created lazily on first message
    } catch (e) {
      console.error('Load conversation failed:', e);
    }
  };

  // Creates a Firestore conversation doc and returns the new ID.
  // Called lazily — only when the user actually sends their first message.
  const createConversationDoc = async () => {
    if (!user) return null;
    try {
      const newConv = await addDoc(
        collection(db, 'users', user.uid, 'conversations'),
        { messages: [], created_at: new Date(), updated_at: new Date(), topic: 'New conversation' }
      );
      setConversationId(newConv.id);
      return newConv.id;
    } catch (e) {
      console.error('Create conversation failed:', e);
      return null;
    }
  };

  const persistMessages = async (updated, explicitConvId = null) => {
    const convId = explicitConvId || conversationId;
    if (!user || !convId) return;
    try {
      await updateDoc(
        doc(db, 'users', user.uid, 'conversations', convId),
        { messages: updated, updated_at: new Date() }
      );
      // Update local conversations list (insert if new, update if existing)
      setConversations(prev => {
        const exists = prev.find(c => c.id === convId);
        let next;
        if (exists) {
          next = prev.map(c =>
            c.id === convId ? { ...c, messages: updated, updated_at: new Date() } : c
          );
        } else if (updated.length > 0) {
          next = [...prev, { id: convId, messages: updated, updated_at: new Date(), created_at: new Date() }];
        } else {
          next = prev;
        }
        return next.sort((a, b) => toDate(b.updated_at) - toDate(a.updated_at));
      });
    } catch (e) {
      console.error('Save messages failed:', e);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    if (atLimit) return;

    // Lazy-create the conversation doc on first message
    let convId = conversationId;
    if (!convId) {
      convId = await createConversationDoc();
      if (!convId) {
        console.error('Could not create conversation');
        return;
      }
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const afterUser = [...messages, userMsg];
    setMessages(afterUser);
    setInput('');
    if (e?.target) {
      const textarea = e.target.querySelector?.('.chat-input') || document.querySelector('.chat-input');
      if (textarea) textarea.style.height = 'auto';
    }
    setLoading(true);
    persistMessages(afterUser, convId);

    try {
      const aiText = await getAIResponse(text, afterUser, buildUserContext(profile, checkIns, glowScore));
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      if (!isPaid && newCount >= FREE_LIMIT) setShowTeaser(true);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toISOString(),
      };
      const afterAI = [...afterUser, aiMsg];
      setMessages(afterAI);
      persistMessages(afterAI, convId);
    } catch (err) {
      console.error('AI response failed:', err);
      const errMsg = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "Sorry — I couldn't respond just now. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = (id) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    persistMessages(updated);
    setOpenMenu(null);
  };

  // "New chat" no longer creates a Firestore doc. Just clears local state.
  // The doc is created when the user sends their first message.
  const handleNewChat = () => {
    setOpenMenu(null);
    setDrawerOpen(false);
    setConversationId(null);
    setMessages([]);
  };

  const switchConversation = (conv) => {
    setConversationId(conv.id);
    setMessages(conv.messages || []);
    setOpenMenu(null);
    setDrawerOpen(false);
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'conversations', convId));
      const updated = conversations.filter(c => c.id !== convId);
      setConversations(updated);
      if (convId === conversationId) {
        if (updated.length > 0) switchConversation(updated[0]);
        else handleNewChat();
      }
    } catch (err) {
      console.error('Delete conversation failed:', err);
    }
  };

  const renderMessagesWithDividers = () => {
    const items = [];
    let lastDate = null;
    messages.forEach(m => {
      const dateLabel = formatDateDivider(m.timestamp);
      if (dateLabel !== lastDate) {
        items.push({ kind: 'divider', id: `div-${m.id}`, label: dateLabel });
        lastDate = dateLabel;
      }
      items.push({ kind: 'message', ...m });
    });
    return items;
  };

  const grouped = groupConversations(conversations);

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* ---- Chat shell: full-height messaging surface ---- */
        .chat-shell {
          display: flex; flex-direction: column;
          height: calc(100vh - 64px);
          max-width: 760px; margin: 0 auto; width: 100%;
          position: relative;
          background: #F5F3F0;
        }
        @media (max-width: 768px) {
          .chat-shell { height: calc(100vh - 64px - 80px); }
        }

        /* ---- Top bar: simplified, contact-style ---- */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(168, 153, 104, 0.12);
          background: #FAF8F5;
          flex-shrink: 0; gap: 10px; z-index: 2;
        }
        .topbar-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
        .icon-btn {
          background: transparent; border: none; cursor: pointer;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #5A6770; transition: all 0.2s; flex-shrink: 0;
        }
        .icon-btn:hover { background: rgba(107, 158, 127, 0.1); color: #557E64; }
        .topbar-identity { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .topbar-name {
          font-family: 'Manrope', sans-serif; font-size: 14.5px; font-weight: 600; color: #3D4A52;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .topbar-status {
          font-family: 'Manrope', sans-serif; font-size: 11.5px; color: #6B9E7F;
        }

        /* ---- History drawer: slides in from the left, WhatsApp chat-list style ---- */
        .drawer-backdrop {
          position: fixed; top: 0; right: 0; bottom: 0; left: 240px;
          background: rgba(61, 74, 82, 0.35);
          z-index: 100; opacity: 0; pointer-events: none;
          transition: opacity 0.25s;
        }
        .drawer-backdrop.open { opacity: 1; pointer-events: auto; }
        .drawer {
          position: fixed; top: 64px; left: 240px; bottom: 0;
          width: 340px; max-width: 85vw;
          background: #FAF8F5;
          z-index: 101;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; flex-direction: column;
          box-shadow: 4px 0 24px rgba(61, 74, 82, 0.08);
        }
        .drawer.open { transform: translateX(0); }
        @media (max-width: 768px) {
          .drawer-backdrop { left: 0; }
          .drawer { left: 0; }
        }
        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(168, 153, 104, 0.15);
        }
        .drawer-title {
          font-family: 'Fraunces', serif; font-size: 18px;
          color: #3D4A52; font-weight: 500; letter-spacing: -0.01em;
        }
        .drawer-newchat {
          display: flex; align-items: center; gap: 8px; justify-content: center;
          margin: 12px 16px;
          padding: 11px 16px; border-radius: 100px;
          background: #6B9E7F; color: #FAF8F5; border: none;
          font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .drawer-newchat:hover { background: #557E64; }
        .drawer-list { flex: 1; overflow-y: auto; padding: 4px 0 16px; }
        .drawer-group { margin-top: 12px; }
        .drawer-group-label { padding: 0 18px 6px; }
        .conv-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 18px;
          cursor: pointer; transition: background 0.15s; gap: 10px;
        }
        .conv-item:hover { background: rgba(107, 158, 127, 0.08); }
        .conv-item.active { background: #EDF4EF; border-left: 3px solid #6B9E7F; padding-left: 15px; }
        .conv-text { min-width: 0; flex: 1; }
        .conv-preview {
          font-family: 'Manrope', sans-serif; font-size: 13px;
          color: #3D4A52; font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .conv-time { font-family: 'Manrope', sans-serif; font-size: 10.5px; color: #A89968; }
        .conv-delete {
          opacity: 0; transition: opacity 0.15s;
          background: transparent; border: none; cursor: pointer;
          color: #A89968; padding: 4px;
          display: flex; align-items: center; justify-content: center;
        }
        .conv-item:hover .conv-delete { opacity: 0.7; }
        .conv-delete:hover { color: #C97B5C; opacity: 1; }
        .drawer-empty {
          padding: 36px 18px; text-align: center;
          font-family: 'Manrope', sans-serif; font-size: 13px; color: #A89968;
          line-height: 1.5;
        }

        /* ---- Messages: tighter, flatter, messaging-app density ---- */
        .messages-scroll {
          flex: 1; overflow-y: auto; padding: 12px 14px;
          -webkit-overflow-scrolling: touch;
        }
        .messages-list { display: flex; flex-direction: column; gap: 3px; }

        .date-divider {
          display: flex; align-items: center; justify-content: center;
          margin: 14px 0 10px;
        }
        .date-divider span {
          font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600;
          color: #8B8770; letter-spacing: 0.03em;
          background: rgba(168, 153, 104, 0.12);
          padding: 4px 12px; border-radius: 100px;
        }

        /* ---- Input bar: plain messaging-app input ---- */
        .input-bar {
          flex-shrink: 0; padding: 10px 12px 10px;
          background: #FAF8F5;
          border-top: 1px solid rgba(168, 153, 104, 0.12);
        }
        .input-row { display: flex; gap: 8px; align-items: center; }
        .chat-input {
          flex: 1; border: 1px solid rgba(168, 153, 104, 0.22);
          background: #FFFFFF; border-radius: 22px;
          padding: 11px 16px;
          font-family: 'Manrope', sans-serif; font-size: 15px; color: #3D4A52;
          outline: none; transition: all 0.2s;
          resize: none; max-height: 120px; min-height: 22px;
          line-height: 1.4; font-family: 'Manrope', sans-serif;
        }
        .chat-input:focus { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }
        .send-btn {
          background: #6B9E7F; color: #FAF8F5; border: none; border-radius: 50%;
          width: 42px; height: 42px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { background: #557E64; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .footer-note {
          font-family: 'Manrope', sans-serif;
          font-size: 11px; color: #A89968;
          text-align: center; margin: 8px 0 0; line-height: 1.5;
        }
        .footer-note strong { color: #5A6770; font-weight: 600; }

        /* ---- Message bubbles: WhatsApp-style sage / white split ---- */
        .msg-row { display: flex; flex-direction: column; position: relative; max-width: 100%; }
        .msg-row.user { align-items: flex-end; align-self: flex-end; }
        .msg-row.assistant { align-items: flex-start; align-self: flex-start; }
        .msg-bubble {
          max-width: 78%; padding: 9px 14px;
          font-family: 'Manrope', sans-serif;
          font-size: 14.5px; line-height: 1.5;
          position: relative; border-radius: 16px;
          word-wrap: break-word;
        }
        .msg-bubble.user {
          background: #6B9E7F; color: #FAF8F5;
          border-bottom-right-radius: 4px;
        }
        .msg-bubble.assistant {
          background: #FFFFFF;
          color: #3D4A52;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(168,153,104,0.10);
        }
        .msg-time {
          font-family: 'Manrope', sans-serif; font-size: 10px;
          color: #A89968; margin: 2px 4px 0; letter-spacing: 0.02em;
        }
        .msg-actions {
          position: absolute; top: -12px;
          opacity: 0; transition: opacity 0.15s;
          pointer-events: none;
        }
        .msg-row.user .msg-actions { right: 8px; }
        .msg-row.assistant .msg-actions { left: 8px; }
        .msg-row:hover .msg-actions, .msg-actions.open {
          opacity: 1; pointer-events: auto;
        }
        .action-btn {
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.3);
          border-radius: 100px;
          padding: 5px 10px;
          font-family: 'Manrope', sans-serif; font-size: 11px;
          color: #5A6770;
          cursor: pointer; display: flex; align-items: center; gap: 4px;
          transition: all 0.15s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .action-btn:hover { background: #fff; color: #C97B5C; border-color: #C97B5C; }

        .typing-row { display: flex; align-items: center; gap: 10px; }
        .typing-dots { display: flex; gap: 5px; }
        .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #6B9E7F; animation: bounce 1.4s infinite; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-5px); opacity: 1; } }

        .welcome {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 32px 0 24px; min-height: 100%;
        }
        .welcome-title {
          font-family: 'Fraunces', serif; font-weight: 400;
          font-size: clamp(24px, 4vw, 30px);
          line-height: 1.2; color: #3D4A52; margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .welcome-sub {
          font-family: 'Manrope', sans-serif;
          font-size: 14px; line-height: 1.6; color: #5A6770;
          max-width: 400px; margin: 0 auto;
        }
      `}</style>

      {/* ---- Drawer (history) ---- */}
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">Conversations</div>
          <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <button className="drawer-newchat" onClick={handleNewChat}>
          <Plus size={16} strokeWidth={2.2} /> New chat
        </button>
        <div className="drawer-list">
          {conversations.length === 0 ? (
            <div className="drawer-empty">
              No past conversations yet.<br />Start one below.
            </div>
          ) : (
            <>
              {[
                { key: 'today', label: 'Today', items: grouped.today },
                { key: 'yesterday', label: 'Yesterday', items: grouped.yesterday },
                { key: 'week', label: 'Previous 7 days', items: grouped.week },
                { key: 'older', label: 'Older', items: grouped.older },
              ].map(group => group.items.length > 0 && (
                <div key={group.key} className="drawer-group">
                  <div className="eyebrow drawer-group-label">{group.label}</div>
                  {group.items.map(c => (
                    <div
                      key={c.id}
                      className={`conv-item ${c.id === conversationId ? 'active' : ''}`}
                      onClick={() => switchConversation(c)}
                    >
                      <div className="conv-text">
                        <div className="conv-preview">{getConversationPreview(c)}</div>
                        <div className="conv-time">{formatRelativeTime(c.updated_at)}</div>
                      </div>
                      <button
                        className="conv-delete"
                        onClick={(e) => deleteConversation(e, c.id)}
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </aside>

      <div className="chat-shell">
        {/* Top bar — simplified, contact-style */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setDrawerOpen(true)} aria-label="Open conversations">
              <Menu size={20} />
            </button>
            <div className="topbar-identity">
              <svg width="30" height="30" viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="50" cy="46" r="28" stroke="#557E64" strokeWidth="6" fill="none" />
                <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72" stroke="#6B9E7F" strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="78" cy="46" r="6" fill="#C97B5C" />
              </svg>
              <div>
                <div className="topbar-name">Wellness Coach</div>
                <div className="topbar-status">Always here</div>
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={handleNewChat} aria-label="New chat">
            <Plus size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* Messages */}
        <div className="messages-scroll">
          {messages.length === 0 && !loading ? (
            <div className="welcome fade-up">
              <svg width="56" height="56" viewBox="0 0 100 100" fill="none" style={{ marginBottom: 18 }}>
                <circle cx="50" cy="46" r="28" stroke="#557E64" strokeWidth="6" fill="none" />
                <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72" stroke="#6B9E7F" strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="78" cy="46" r="6" fill="#C97B5C" />
              </svg>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Your wellness coach</div>
              <h1 className="welcome-title">
                Hello, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>{userName}.</em>
              </h1>
              <p className="welcome-sub">
                Ask me anything about your wellness, the patterns you're noticing, or what helps you thrive.
              </p>
            </div>
          ) : (
            <div className="messages-list">
              {renderMessagesWithDividers().map(item => {
                if (item.kind === 'divider') {
                  return (
                    <div key={item.id} className="date-divider">
                      <span>{item.label}</span>
                    </div>
                  );
                }
                const m = item;
                return (
                  <div
                    key={m.id}
                    className={`msg-row ${m.role}`}
                    onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                    style={{ marginTop: 6, marginBottom: 2 }}
                  >
                    <div className={`msg-bubble ${m.role}`}>
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p style={{margin: '0 0 6px 0'}}>{children}</p>,
                          ul: ({children}) => <ul style={{margin: '4px 0', paddingLeft: '18px'}}>{children}</ul>,
                          li: ({children}) => <li style={{margin: '2px 0'}}>{children}</li>,
                          strong: ({children}) => <strong style={{fontWeight: 600}}>{children}</strong>,
                          em: ({children}) => <em style={{fontStyle: 'italic'}}>{children}</em>,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                      <div className={`msg-actions ${openMenu === m.id ? 'open' : ''}`}>
                        <button
                          className="action-btn"
                          onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}
                          aria-label="Delete message"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="msg-time">{formatTime(m.timestamp)}</div>
                  </div>
                );
              })}
              {loading && (
                <div className="msg-row assistant" style={{ marginTop: 6 }}>
                  <div className="msg-bubble assistant">
                    <div className="typing-row">
                      <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot" style={{ animationDelay: '0.15s' }}></div>
                        <div className="typing-dot" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input + footer disclaimer */}
        <div className="input-bar">
          <form onSubmit={handleSendMessage} className="input-row">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Ask your wellness coach…"
              className="chat-input"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-btn"
              aria-label="Send"
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </form>
          {showTeaser && (
            <div style={{ margin: '10px 0 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(107, 158, 127, 0.25)' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ padding: '14px 18px', filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', background: '#FFFFFF', fontSize: '14px', fontFamily: "'Manrope', sans-serif", lineHeight: 1.6, color: '#3D4A52' }}>
                  Your coach has identified a deeper pattern in your recent check-ins — including specific connections between your sleep, stress levels, and the symptoms you've been tracking. There's a personalised 3-step plan ready for you based on your data from the past 7 days...
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(245,243,240,0.7) 40%, rgba(245,243,240,0.97) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '16px' }}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: '15px', color: '#3D4A52', marginBottom: '10px', textAlign: 'center', fontStyle: 'italic' }}>Your coach has more to share.</p>
                  <a href="/choose-plan" style={{ background: '#6B9E7F', color: '#FAF8F5', padding: '10px 22px', borderRadius: '100px', fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                    Unlock GlowWise Plus — £4.99/month
                  </a>
                </div>
              </div>
            </div>
          )}
          {atLimit && !showTeaser && (
            <div style={{ background: 'rgba(201, 123, 92, 0.1)', border: '1px solid rgba(201, 123, 92, 0.3)', borderRadius: '8px', padding: '12px 16px', marginTop: '10px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '13px', color: '#C97B5C', margin: 0 }}>
                You've used your 2 free questions today.{' '}
                <a href="/choose-plan" style={{ color: '#557E64', fontWeight: 600, textDecoration: 'none' }}>Upgrade to GlowWise Plus</a>{' '}
                for unlimited access.
              </p>
            </div>
          )}
          {!isPaid && !atLimit && (
            <p className="footer-note">
              <strong>{FREE_LIMIT - dailyCount} free question{FREE_LIMIT - dailyCount !== 1 ? 's' : ''} remaining today.</strong>
            </p>
          )}
          {isPaid && (
            <p className="footer-note">
              <strong>Wellness, not medical advice.</strong> Consult a healthcare provider for medical concerns.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Send, Trash2, Plus } from 'lucide-react';
import { db } from '../config/firebase';
import {
  collection, addDoc, getDocs, updateDoc, doc,
  query, orderBy, limit
} from 'firebase/firestore';

// ---------- Mock responses (swap getAIResponse() body for OpenAI later) ----------
const SAMPLE_AI_RESPONSES = [
  "I've noticed your sleep quality has been varying. Let's explore what might be affecting it — stress, screen time before bed, or caffeine could all play a role.",
  "Your stress has been elevated this week. Even a 5-minute breathing exercise daily can meaningfully reduce cortisol over time.",
  "There's a clear pattern between your sleep and energy. On nights you sleep less than 7 hours, your energy drops noticeably the next day.",
  "Skin concerns often connect back to stress and sleep. When cortisol is high and sleep is short, inflammation rises and breakouts follow.",
  "Hair health starts internally — sleep, protein, hydration, and stress management. Small consistent changes show in 6-8 weeks.",
  "That's a thoughtful observation. What feels most pressing right now — sleep, stress, energy, or something else?",
];

// PLACEHOLDER — replace internals with real OpenAI call later (5-line change).
async function getAIResponse(userMessage, history, profile) {
  await new Promise(r => setTimeout(r, 900));
  return SAMPLE_AI_RESPONSES[Math.floor(Math.random() * SAMPLE_AI_RESPONSES.length)];
}

const SUGGESTIONS = [
  { label: 'Sleep',  items: ['Why do I wake up tired?', 'How can I fall asleep faster?'] },
  { label: 'Stress', items: ['Why am I always anxious?', 'How do I lower cortisol naturally?'] },
  { label: 'Skin',   items: ['What might be causing my breakouts?', 'How does stress affect my skin?'] },
];

export default function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { profile } = useUserData();

  const userName = profile?.name || 'there';

  // Auto-scroll on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load most recent conversation OR create one
  useEffect(() => {
    if (!user) return;
    loadOrCreateConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadOrCreateConversation = async () => {
    try {
      const convsRef = collection(db, 'users', user.uid, 'conversations');
      const q = query(convsRef, orderBy('updated_at', 'desc'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const latest = snap.docs[0];
        setConversationId(latest.id);
        setMessages(latest.data().messages || []);
      } else {
        await createNewConversation();
      }
    } catch (e) {
      console.error('Load conversation failed:', e);
      setConversationId('local-fallback');
    }
  };

  const createNewConversation = async () => {
    if (!user) return;
    try {
      const newConv = await addDoc(
        collection(db, 'users', user.uid, 'conversations'),
        {
          messages: [],
          created_at: new Date(),
          updated_at: new Date(),
          topic: 'New conversation',
        }
      );
      setConversationId(newConv.id);
      setMessages([]);
    } catch (e) {
      console.error('Create conversation failed:', e);
      setConversationId('local-fallback');
      setMessages([]);
    }
  };

  const persistMessages = async (updated) => {
    if (!user || !conversationId || conversationId === 'local-fallback') return;
    try {
      await updateDoc(
        doc(db, 'users', user.uid, 'conversations', conversationId),
        { messages: updated, updated_at: new Date() }
      );
    } catch (e) {
      console.error('Save messages failed:', e);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const afterUser = [...messages, userMsg];
    setMessages(afterUser);
    setInput('');
    setLoading(true);
    persistMessages(afterUser);

    try {
      const aiText = await getAIResponse(text, afterUser, profile);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toISOString(),
      };
      const afterAI = [...afterUser, aiMsg];
      setMessages(afterAI);
      persistMessages(afterAI);
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

  const handleNewChat = async () => {
    setOpenMenu(null);
    await createNewConversation();
  };

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* ---- Stable shell: full-height flex column ---- */
        .chat-shell {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}
@media (max-width: 768px) {
  .chat-shell { height: calc(100vh - 64px - 80px); }
}

/* ---- Decorative background g letterforms ---- */
.bg-decoration {
  position: absolute;
  top: 0; right: -60px; bottom: 0;
  width: 260px;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.bg-g {
  position: absolute;
  font-family: 'Fraunces', serif;
  font-weight: 300;
  color: #6B9E7F;
  opacity: 0.07;
  font-size: 280px;
  line-height: 1;
  user-select: none;
}
.bg-g-1 { top: 4%;  right: -10px; }
.bg-g-2 { top: 38%; right: 70px; font-size: 240px; opacity: 0.06; }
.bg-g-3 { top: 70%; right: -30px; font-size: 260px; }

.topbar, .messages-scroll, .input-bar { position: relative; z-index: 1; }

        /* ---- Top bar ---- */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid rgba(168, 153, 104, 0.15);
          background: rgba(245, 243, 240, 0.85);
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }
        .topbar-label {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Manrope', sans-serif; font-size: 14px; color: #5A6770;
        }
        .g-mark {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #6B9E7F, #A89968);
          display: flex; align-items: center; justify-content: center;
          color: #FAF8F5; font-family: 'Fraunces', serif; font-size: 16px; font-weight: 500;
        }
        .new-chat-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent;
          border: 1px solid rgba(107, 158, 127, 0.35);
          color: #557E64;
          font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 500;
          padding: 8px 16px; border-radius: 100px;
          cursor: pointer; transition: all 0.2s;
        }
        .new-chat-btn:hover { background: #EDF4EF; border-color: #6B9E7F; }

        /* ---- Scrollable message area ---- */
        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          -webkit-overflow-scrolling: touch;
        }
        .messages-list { display: flex; flex-direction: column; gap: 14px; }

        /* ---- Input bar ---- */
        .input-bar {
          flex-shrink: 0;
          padding: 16px 24px 14px;
          background: rgba(245, 243, 240, 0.95);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(168, 153, 104, 0.12);
        }
        .input-row { display: flex; gap: 10px; align-items: center; }
        .chat-input {
          flex: 1; border: 1px solid rgba(168, 153, 104, 0.25);
          background: #FAF8F5; border-radius: 100px;
          padding: 14px 20px;
          font-family: 'Manrope', sans-serif; font-size: 15px; color: #3D4A52;
          outline: none; transition: all 0.2s;
        }
        .chat-input:focus { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }
        .send-btn {
          background: #6B9E7F; color: #FAF8F5; border: none; border-radius: 50%;
          width: 48px; height: 48px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { background: #557E64; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .footer-note {
          font-family: 'Manrope', sans-serif;
          font-size: 11px; color: #A89968;
          text-align: center; margin: 10px 0 0;
          line-height: 1.5;
        }
        .footer-note strong { color: #5A6770; font-weight: 600; }

        /* ---- Messages ---- */
        .msg-row { display: flex; position: relative; }
        .msg-row.user { justify-content: flex-end; }
        .msg-row.assistant { justify-content: flex-start; }
        .msg-bubble {
          max-width: 80%; padding: 14px 18px;
          font-family: 'Manrope', sans-serif;
          font-size: 14.5px; line-height: 1.6;
          position: relative; border-radius: 18px;
          word-wrap: break-word;
        }
        .msg-bubble.user {
          background: #6B9E7F; color: #FAF8F5;
          border-bottom-right-radius: 6px;
        }
        .msg-bubble.assistant {
          background: #EDF4EF; color: #3D4A52;
          border-bottom-left-radius: 6px;
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

        /* ---- Typing indicator ---- */
        .typing-row { display: flex; align-items: center; gap: 12px; }
        .typing-dots { display: flex; gap: 5px; }
        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #6B9E7F; animation: bounce 1.4s infinite; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-5px); opacity: 1; } }
        .typing-text {
          font-family: 'Fraunces', serif; font-style: italic;
          font-size: 13.5px; color: #557E64;
        }

        /* ---- Welcome state ---- */
        .welcome {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 32px 0 24px;
          min-height: 100%;
        }
        .welcome-mark {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #6B9E7F 0%, #557E64 100%);
          display: flex; align-items: center; justify-content: center;
          color: #FAF8F5; font-family: 'Fraunces', serif;
          font-size: 28px; font-weight: 500; margin-bottom: 22px;
        }
        .welcome-title {
          font-family: 'Fraunces', serif; font-weight: 400;
          font-size: clamp(26px, 4vw, 34px);
          line-height: 1.2; color: #3D4A52; margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .welcome-sub {
          font-family: 'Manrope', sans-serif;
          font-size: 14.5px; line-height: 1.6; color: #5A6770;
          max-width: 440px; margin: 0 0 32px;
        }
        .suggestion-group {
          width: 100%; max-width: 520px;
          margin-bottom: 18px;
        }
        .suggestion-group-label {
          display: block; text-align: left; margin-bottom: 8px;
          padding-left: 6px;
        }
        .suggestion-list { display: flex; flex-direction: column; gap: 8px; }
        .suggestion {
          width: 100%; background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.22);
          border-radius: 100px; padding: 12px 20px;
          font-family: 'Manrope', sans-serif; font-size: 13.5px;
          color: #3D4A52; cursor: pointer; transition: all 0.2s;
          text-align: left;
        }
        .suggestion:hover { border-color: #6B9E7F; background: #EDF4EF; color: #557E64; }
      `}</style>

      <div className="chat-shell">
  <div className="bg-decoration" aria-hidden="true">
    <span className="bg-g bg-g-1">g</span>
    <span className="bg-g bg-g-2">g</span>
    <span className="bg-g bg-g-3">g</span>
  </div>

  {/* Top bar */}
        <div className="topbar">
          <div className="topbar-label">
            <div className="g-mark">g</div>
            <span>Wellness coach</span>
          </div>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={14} strokeWidth={2.2} /> New chat
          </button>
        </div>

        {/* Messages — scrollable */}
        <div className="messages-scroll">
          {messages.length === 0 && !loading ? (
            <div className="welcome fade-up">
              <div className="welcome-mark">g</div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Your wellness coach</div>
              <h1 className="welcome-title">
                Hello, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>{userName}.</em>
              </h1>
              <p className="welcome-sub">
                Ask me anything about your wellness, the patterns you're noticing, or how to feel better day to day.
              </p>
              {SUGGESTIONS.map(group => (
                <div key={group.label} className="suggestion-group">
                  <div className="eyebrow suggestion-group-label">{group.label}</div>
                  <div className="suggestion-list">
                    {group.items.map((s, i) => (
                      <button key={i} className="suggestion" onClick={() => setInput(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="messages-list">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`msg-row ${m.role}`}
                  onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                >
                  <div className={`msg-bubble ${m.role}`}>
                    {m.content}
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
                </div>
              ))}
              {loading && (
                <div className="msg-row assistant">
                  <div className="msg-bubble assistant">
                    <div className="typing-row">
                      <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot" style={{ animationDelay: '0.15s' }}></div>
                        <div className="typing-dot" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      <span className="typing-text">thinking…</span>
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
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your wellness coach…"
              className="chat-input"
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
          <p className="footer-note">
            <strong>Wellness, not medical advice.</strong> Consult a healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Send, MoreVertical, Trash2, Plus, MessageCircle } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const SAMPLE_AI_RESPONSES = [
  "I've noticed your sleep quality has been varying. Let's explore what might be affecting it — stress, screen time before bed, or caffeine could all play a role.",
  "Your stress has been elevated this week. Even a 5-minute breathing exercise daily can meaningfully reduce cortisol over time.",
  "There's a clear pattern between your sleep and energy. On nights you sleep less than 7 hours, your energy drops noticeably the next day.",
  "Skin concerns often connect back to stress and sleep. When cortisol is high and sleep is short, inflammation rises and breakouts follow.",
  "Hair health starts internally — sleep, protein, hydration, and stress management. Small consistent changes show in 6-8 weeks.",
  "That's a thoughtful observation. What feels most pressing right now — sleep, stress, energy, or something else?",
];

export default function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { profile } = useUserData();

  const userName = profile?.name || 'there';

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (user) startNewConversation();
  }, [user]);

  const startNewConversation = async () => {
    if (!user) return;
    try {
      const newConv = await addDoc(collection(db, 'users', user.uid, 'conversations'), {
        messages: [], created_at: new Date(), topic: 'New conversation',
      });
      setConversationId(newConv.id);
      setMessages([]);
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;
    const userMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: SAMPLE_AI_RESPONSES[Math.floor(Math.random() * SAMPLE_AI_RESPONSES.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 800);
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setShowDeleteMenu(null);
  };

  const suggestions = [
    'Why am I tired so often?',
    'How can I improve my sleep?',
    'What might be causing my breakouts?',
  ];

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .suggestion { width: 100%; background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.25); border-radius: 100px; padding: 14px 22px; font-family: 'Manrope', sans-serif; font-size: 14px; color: #3D4A52; cursor: pointer; transition: all 0.2s; text-align: left; }
        .suggestion:hover { border-color: #6B9E7F; background: #EDF4EF; color: #557E64; }
        .chat-input { flex: 1; border: 1px solid rgba(168, 153, 104, 0.25); background: #FAF8F5; border-radius: 100px; padding: 14px 20px; font-family: 'Manrope', sans-serif; font-size: 15px; color: #3D4A52; outline: none; transition: all 0.2s; }
        .chat-input:focus { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }
        .send-btn { background: #6B9E7F; color: #FAF8F5; border: none; border-radius: 50%; width: 48px; height: 48px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .send-btn:hover:not(:disabled) { background: #557E64; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .msg-bubble { max-width: 85%; padding: 14px 18px; border-radius: 16px; font-size: 14px; line-height: 1.55; position: relative; }
        .msg-user { background: #6B9E7F; color: #FAF8F5; border-bottom-right-radius: 4px; }
        .msg-ai { background: #FAF8F5; color: #3D4A52; border: 1px solid rgba(168, 153, 104, 0.15); border-bottom-left-radius: 4px; }
        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #6B9E7F; animation: bounce 1.4s infinite; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-6px); opacity: 1; } }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px - 80px)', maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>

        {/* Disclaimer */}
        <div style={{ background: 'rgba(212, 232, 221, 0.5)', borderLeft: '3px solid #6B9E7F', borderRadius: '4px', padding: '12px 16px', fontSize: '12px', color: '#557E64', margin: '24px 0' }}>
          <strong style={{ fontWeight: 600 }}>Wellness, not medical advice.</strong> Always consult a healthcare provider for medical concerns.
        </div>

        {/* Messages or welcome */}
        <div style={{ flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.length === 0 ? (
            <div className="fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #6B9E7F 0%, #557E64 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF8F5', fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: 500, marginBottom: '24px' }}>g</div>
              <div className="eyebrow" style={{ marginBottom: '14px' }}>Your wellness coach</div>
              <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 36px)', lineHeight: 1.15, color: '#3D4A52', marginBottom: '14px' }}>
                Hello, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>{userName}.</em>
              </h1>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', maxWidth: '440px', marginBottom: '32px' }}>
                Ask me anything about your wellness, patterns you're noticing, or how to feel better day to day.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '420px' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setInput(s)} className="suggestion">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className={`msg-bubble ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                    {m.content}
                    <button onClick={() => setShowDeleteMenu(m.id === showDeleteMenu ? null : m.id)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: m.role === 'user' ? 'rgba(250,248,245,0.5)' : '#A89968', opacity: 0.6 }}>
                      <MoreVertical size={14} />
                    </button>
                    {showDeleteMenu === m.id && (
                      <button onClick={() => deleteMessage(m.id)} style={{ position: 'absolute', top: '28px', right: '4px', background: '#FAF8F5', border: '1px solid rgba(204, 68, 68, 0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#CC4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div className="msg-ai" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div className="typing-dot"></div>
                      <div className="typing-dot" style={{ animationDelay: '0.15s' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div style={{ position: 'sticky', bottom: '80px', background: 'rgba(245, 243, 240, 0.95)', backdropFilter: 'blur(8px)', padding: '16px 0' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your wellness coach..." disabled={loading} className="chat-input" />
            <button type="submit" disabled={loading || !input.trim()} className="send-btn">
              <Send size={18} strokeWidth={2} />
            </button>
          </form>
          <p style={{ fontSize: '11px', color: '#A89968', marginTop: '10px', textAlign: 'center' }}>
            Delete any message anytime · Your data is encrypted
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

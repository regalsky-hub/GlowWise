import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { Send, ChevronLeft, MoreVertical, Trash2, Plus } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

const SAMPLE_AI_RESPONSES = [
  "I've noticed from your check-ins that your sleep quality has been declining. Let's explore what might be affecting it—stress, screen time before bed, or caffeine intake could all be factors.",
  "Your stress levels have been elevated this week. I'd recommend trying a 5-minute breathing exercise daily. Studies show that even brief mindfulness can significantly reduce cortisol.",
  "Based on your data, there seems to be a correlation between your energy levels and hours of sleep. You mentioned averaging 6 hours last night—aiming for 7-9 could make a real difference.",
  "Your skin concerns might be related to stress and sleep. When stress is high, cortisol spikes and triggers inflammation. Combined with insufficient sleep, this can accelerate breakouts.",
  "I see you're interested in hair health. The foundation is sleep, stress management, and protein intake. Have you considered your water intake? Dehydration often shows up as hair brittleness first.",
  "That's an insightful observation. Your body signals are telling you something. What would help most right now—stress management, better sleep, or nutritional support?",
];

export default function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { profile } = useUserData();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadConversations();
      // Start new conversation
      startNewConversation();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const convsRef = collection(db, 'users', user.uid, 'conversations');
      const snap = await getDocs(convsRef);
      const convs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => (b.created_at?.toMillis?.() || 0) - (a.created_at?.toMillis?.() || 0));
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const startNewConversation = async () => {
    if (!user) return;
    try {
      const newConv = await addDoc(collection(db, 'users', user.uid, 'conversations'), {
        messages: [],
        created_at: new Date(),
        topic: 'New Conversation',
      });
      setConversationId(newConv.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadConversation = async (convId) => {
    if (!user) return;
    try {
      const convRef = doc(db, 'users', user.uid, 'conversations', convId);
      const snap = await getDocs(collection(db, 'users', user.uid, 'conversations'));
      const conv = snap.docs.find(d => d.id === convId);
      if (conv && conv.data().messages) {
        setMessages(conv.data().messages.filter(m => !m.deleted) || []);
      }
      setConversationId(convId);
      setShowConversations(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: SAMPLE_AI_RESPONSES[Math.floor(Math.random() * SAMPLE_AI_RESPONSES.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 800);
  };

  const deleteMessage = async (messageId) => {
    // Delete from local state
    setMessages(prev => prev.filter(m => m.id !== messageId));
    
    // In production, also delete from Firebase
    // await updateDoc(...) to mark as deleted or hard delete
    
    setShowDeleteMenu(null);
  };

  return (
    <div className="min-h-screen bg-glow-cream flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-glow-sage-light">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-glow-sage-light rounded-card transition"
          >
            <ChevronLeft className="w-5 h-5 text-glow-slate" />
          </button>
          <h1 className="font-poppins font-700 text-glow-slate">AI Wellness Coach</h1>
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="p-2 hover:bg-glow-sage-light rounded-card transition relative"
          >
            <Plus className="w-5 h-5 text-glow-sage" />
          </button>
        </div>

        {/* Conversations Menu */}
        {showConversations && (
          <div className="absolute top-16 right-4 z-50 bg-white rounded-card shadow-card border border-glow-sage-light max-w-sm max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-glow-sage-light">
              <button
                onClick={startNewConversation}
                className="w-full py-2 bg-glow-sage text-white rounded-card font-inter font-500 text-sm hover:bg-opacity-90 transition"
              >
                New Conversation
              </button>
            </div>
            <div className="divide-y divide-glow-sage-light">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className="w-full text-left p-3 hover:bg-glow-sage-light transition"
                >
                  <p className="font-inter font-500 text-sm text-glow-slate truncate">
                    {conv.topic || 'Conversation'}
                  </p>
                  <p className="font-inter text-xs text-glow-charcoal">
                    {conv.messages?.length || 0} messages
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Disclaimer */}
      <div className="bg-glow-sage-light border-b border-glow-sage px-4 py-3">
        <p className="max-w-4xl mx-auto font-inter text-xs text-glow-slate">
          <strong>Wellness Guidance Only:</strong> This is wellness guidance, not medical advice. Always consult a healthcare provider for medical concerns.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 py-8 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="text-5xl">💚</div>
              <h2 className="font-poppins font-700 text-glow-slate text-lg">
                Welcome to Your AI Coach
              </h2>
              <p className="font-inter text-glow-charcoal max-w-xs">
                Ask anything about your wellness, health concerns, or patterns you've noticed
              </p>
              <div className="space-y-2 pt-4">
                {[
                  'Why am I so tired all the time?',
                  'How can I improve my sleep quality?',
                  'What could be causing my skin breakouts?',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="block w-full text-left p-3 bg-white border border-glow-sage-light rounded-card hover:bg-glow-sage-light transition font-inter text-sm text-glow-slate"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm lg:max-w-md relative group ${
                    message.role === 'user' ? 'bg-glow-sage text-white' : 'bg-white border border-glow-sage-light text-glow-slate'
                  } rounded-lg p-4 rounded-lg`}
                >
                  <p className="font-inter text-sm leading-relaxed">{message.content}</p>

                  {/* Delete Button */}
                  <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setShowDeleteMenu(message.id === showDeleteMenu ? null : message.id)}
                      className="p-1 hover:bg-red-50 rounded transition"
                    >
                      <MoreVertical className="w-4 h-4 text-glow-charcoal hover:text-glow-error" />
                    </button>
                    {showDeleteMenu === message.id && (
                      <div className="absolute top-8 right-0 bg-white border border-glow-sage-light rounded-card shadow-card">
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="flex items-center gap-2 px-4 py-2 text-glow-error hover:bg-red-50 rounded-card font-inter text-sm w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-glow-sage-light rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-glow-sage animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-glow-sage animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-glow-sage animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-glow-sage-light p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your wellness coach..."
              disabled={loading}
              className="flex-1 border border-glow-sage-light rounded-card px-4 py-3 font-inter focus:border-glow-sage focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-glow-sage text-white rounded-card hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="font-inter text-xs text-glow-charcoal mt-2">
            You can delete any message anytime for privacy. Your data is encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}

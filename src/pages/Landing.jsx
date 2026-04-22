import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, ChevronDown, Heart, LineChart, MessageCircle, Camera, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    { icon: MessageCircle, title: 'Adaptive Intelligence', desc: 'AI learns your patterns and personalizes solutions for your unique body' },
    { icon: LineChart, title: 'Connected Living', desc: 'Seamlessly integrate data to gather continuous clarity without friction' },
    { icon: Camera, title: 'Glow Plan', desc: 'Your personalized wellness plan, tailored to your needs' },
  ];

  const faqs = [
    { q: 'Is this a medical advice platform?', a: 'No. GlowWise provides wellness intelligence and lifestyle suggestions. Always consult a healthcare provider for medical concerns.' },
    { q: 'How does the AI personalization work?', a: 'Our AI learns from your daily check-ins, health history, and wellness priorities. It identifies patterns unique to your body.' },
    { q: 'What if I want to delete my data?', a: 'You have complete control. Delete messages, photos, or your entire account anytime. Your data stays encrypted and private.' },
    { q: 'Are supplements mandatory?', a: 'No. GlowWise is completely flexible. Track what matters to you—supplements, sleep, stress, or anything else.' },
  ];

  return (
    <div style={{ backgroundColor: '#faf9f6', color: '#1a1c1a' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e3e2df', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: '#4a654f', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles className="w-5 h-5" style={{ color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: '18px' }}>GlowWise</span>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Features', 'Wellness AI', 'Pricing', 'FAQ'].map(item => (
              <button key={item} style={{ fontFamily: 'Inter', fontSize: '16px', color: '#1a1c1a', background: 'none', border: 'none', cursor: 'pointer' }}>
                {item}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/login')} style={{ fontFamily: 'Inter', fontSize: '16px', color: '#1a1c1a', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px' }}>
              Login
            </button>
            <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#4a654f', color: 'white', fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, padding: '10px 24px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <span style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: '#4a654f', backgroundColor: '#e9e8e5', padding: '8px 16px', borderRadius: '9999px', width: 'fit-content' }}>
            MASS RELAXATION & PRECISION
          </span>
          <h1 style={{ fontFamily: 'Manrope', fontSize: '48px', fontWeight: 500, lineHeight: 1.2, letterSpacing: '0.02em', margin: 0 }}>
            Your Intelligence,<br/><span style={{ fontStyle: 'italic' }}>Reimagined</span><br/>for Wellness.
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: '18px', lineHeight: 1.6, color: '#424842', margin: 0 }}>
            A personalized daily system for your body, mind, and habits. Mindful living meets high-performance science.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#4a654f', color: 'white', fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, padding: '12px 32px', borderRadius: '9999px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button style={{ border: '2px solid #4a654f', color: '#4a654f', fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, padding: '10px 32px', borderRadius: '9999px', background: 'transparent', cursor: 'pointer' }}>
              See The Wellness AI
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div style={{ backgroundColor: '#e9e8e5', borderRadius: '16px', padding: '32px', boxShadow: '0px 10px 30px rgba(45, 45, 45, 0.04)' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#4a654f', margin: '0 0 8px 0' }}>DAILY FOCUS</p>
            <h3 style={{ fontFamily: 'Manrope', fontSize: '28px', fontWeight: 500, color: '#1a1c1a', margin: '0 0 16px 0' }}>Emotional Equilibrium</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Inter', fontSize: '14px', color: '#424842' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Heart className="w-4 h-4" /> Stress: 5/10
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Sparkles className="w-4 h-4" /> Energy: 7/10
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ backgroundColor: '#f4f4f0', border: '1px solid #e3e2df', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#424842', margin: 0 }}>
            <strong>Non-Medical Guidance:</strong> GlowWise provides wellness guidance, not medical advice. Always consult a healthcare provider for medical concerns.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e3e2df', borderBottom: '1px solid #e3e2df', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Manrope', fontSize: '36px', fontWeight: 500, lineHeight: 1.2, color: '#1a1c1a', margin: '0 0 16px' }}>Precision Well-being</h2>
            <p style={{ fontFamily: 'Inter', fontSize: '18px', color: '#424842', maxWidth: '600px', margin: '0 auto' }}>
              Our ecosystem adapts to your needs, then elevates your readiness
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ backgroundColor: '#f4f4f0', borderRadius: '16px', padding: '32px', boxShadow: '0px 10px 30px rgba(45, 45, 45, 0.04)', transition: 'all 0.3s ease' }}>
                  <div style={{ backgroundColor: 'rgba(74, 101, 79, 0.08)', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon style={{ color: '#4a654f', width: '24px', height: '24px' }} />
                  </div>
                  <h3 style={{ fontFamily: 'Manrope', fontSize: '22px', fontWeight: 600, color: '#1a1c1a', margin: '0 0 8px' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: 1.6, color: '#424842', margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ backgroundColor: '#faf9f6', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Manrope', fontSize: '36px', fontWeight: 500, lineHeight: 1.2, color: '#1a1c1a', margin: '0 0 16px' }}>Choose Your Rhythm</h2>
            <p style={{ fontFamily: 'Inter', fontSize: '18px', color: '#424842', margin: 0 }}>Simple, transparent, and focused on your growth.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Free Tier */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0px 10px 30px rgba(45, 45, 45, 0.04)' }}>
              <h3 style={{ fontFamily: 'Manrope', fontSize: '22px', fontWeight: 600, color: '#1a1c1a', margin: '0 0 8px' }}>Free Tier</h3>
              <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#424842', margin: '0 0 24px' }}>Perfect for exploring</p>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: 'Manrope', fontSize: '36px', fontWeight: 500, color: '#1a1c1a' }}>£0</span>
                <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#424842' }}> Forever free</span>
              </div>
              <ul style={{ fontFamily: 'Inter', fontSize: '14px', color: '#424842', margin: '0 0 24px', paddingLeft: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}>✓ 2 AI questions per day</li>
                <li style={{ marginBottom: '8px' }}>✓ Daily check-in (unlimited)</li>
                <li style={{ marginBottom: '8px' }}>✓ Basic insights</li>
                <li>✓ Chat history (read-only)</li>
              </ul>
              <button onClick={() => navigate('/signup')} style={{ width: '100%', backgroundColor: '#4a654f', color: 'white', fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, padding: '12px 24px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}>
                Get Started
              </button>
            </div>

            {/* Premium Tier */}
            <div style={{ backgroundColor: '#4a654f', borderRadius: '16px', padding: '32px', boxShadow: '0px 10px 30px rgba(45, 45, 45, 0.04)', position: 'relative', color: 'white' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#4a654f', color: 'white', fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, padding: '6px 16px', borderRadius: '9999px' }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontFamily: 'Manrope', fontSize: '22px', fontWeight: 600, margin: '0 0 8px' }}>Wellness Coach</h3>
              <p style={{ fontFamily: 'Inter', fontSize: '14px', opacity: 0.9, margin: '0 0 24px' }}>Everything you need</p>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: 'Manrope', fontSize: '36px', fontWeight: 500 }}>£4.99</span>
                <span style={{ fontFamily: 'Inter', fontSize: '14px', opacity: 0.9 }}>/month</span>
              </div>
              <ul style={{ fontFamily: 'Inter', fontSize: '14px', margin: '0 0 24px', paddingLeft: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}>✓ Unlimited AI questions</li>
                <li style={{ marginBottom: '8px' }}>✓ Photo uploads & tracking</li>
                <li style={{ marginBottom: '8px' }}>✓ Full chat history</li>
                <li style={{ marginBottom: '8px' }}>✓ Pattern detection</li>
                <li style={{ marginBottom: '8px' }}>✓ Weekly insights email</li>
                <li>✓ Adaptive Intelligence</li>
              </ul>
              <button onClick={() => navigate('/signup')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#4a654f', fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, padding: '12px 24px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}>
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e3e2df', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Manrope', fontSize: '36px', fontWeight: 500, color: '#1a1c1a', textAlign: 'center', margin: '0 0 48px' }}>
            Curated Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e3e2df', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: openFaq === i ? '#f4f4f0' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Manrope', fontSize: '16px', fontWeight: 600, color: '#1a1c1a', textAlign: 'left' }}
                >
                  {faq.q}
                  <ChevronDown style={{ color: '#4a654f', transition: 'transform 0.3s ease', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ backgroundColor: '#f4f4f0', borderTop: '1px solid #e3e2df', padding: '24px' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: 1.6, color: '#424842', margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#4a654f', borderRadius: '20px', padding: '48px', textAlign: 'center', boxShadow: '0px 10px 30px rgba(74, 101, 79, 0.1)', color: 'white' }}>
          <h2 style={{ fontFamily: 'Manrope', fontSize: '36px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 16px' }}>
            Start Your Personalised<br/>Glow Plan Today
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: 1.6, opacity: 0.9, maxWidth: '600px', margin: '0 auto 32px' }}>
            Join thousands of people discovering what their body needs to thrive. Track your wellness, decode your patterns, and feel your best.
          </p>
          <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#ffffff', color: '#4a654f', fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, padding: '12px 32px', borderRadius: '9999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            Claim Your Free Analysis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a1c1a', borderTop: '1px solid #e3e2df', color: 'white', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles className="w-5 h-5" />
                <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: '16px' }}>GlowWise</span>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '14px', opacity: 0.7, margin: 0 }}>
                Transforming wellness intelligence through personalized, ethical AI.
              </p>
            </div>
            {['Product', 'Company', 'Legal'].map(col => (
              <div key={col}>
                <h4 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', margin: '0 0 12px' }}>
                  {col}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {['Features', 'About', 'Privacy'].map(item => (
                    <li key={item} style={{ marginBottom: '8px' }}>
                      <button style={{ fontFamily: 'Inter', fontSize: '14px', color: 'white', opacity: 0.7, background: 'none', border: 'none', cursor: 'pointer' }}>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', opacity: 0.7, margin: '0 0 12px' }}>© 2024 GlowWise. Designed by Regal using AI</p>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.6, margin: 0 }}>
              Always consult a qualified healthcare provider. GlowWise is not a substitute for professional medical care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

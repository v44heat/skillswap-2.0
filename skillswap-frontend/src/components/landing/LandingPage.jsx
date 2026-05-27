import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '🎯', title: 'Find Skills', desc: 'Browse hundreds of skills offered by fellow students across all departments and years.' },
  { icon: '🤝', title: 'Connect & Learn', desc: 'Request sessions with peer experts and get personalised one-on-one guidance on your schedule.' },
  { icon: '⭐', title: 'Earn Recognition', desc: 'Build your teaching portfolio and collect feedback from every learner you help.' },
  { icon: '📅', title: 'Flexible Scheduling', desc: 'Choose times that work for both of you — morning, evening, weekends, wherever.' },
];

const STATS = [
  { value: '500+', label: 'Students' },
  { value: '200+', label: 'Skills listed' },
  { value: '1,200+', label: 'Sessions completed' },
  { value: '4.9★', label: 'Average rating' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, background: 'rgba(11,15,26,.9)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>SkillSwap</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 40px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent-glow)', border: '1px solid rgba(79,127,255,.3)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 28,
        }}>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '.06em' }}>CAMPUS SKILL EXCHANGE PLATFORM</span>
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 'clamp(38px,6vw,68px)',
          fontWeight: 800, lineHeight: 1.1, marginBottom: 22,
          background: 'linear-gradient(135deg,#f0f4ff 0%,#8b9cc8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Learn anything from<br />the people around you
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 540, margin: '0 auto 44px', lineHeight: 1.75 }}>
          SkillSwap connects students who want to learn with students who love to teach.
          Share your expertise, grow your network, and build skills together.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Start learning — it's free</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>Sign in to your account</button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '20px 40px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '20px 40px 80px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
          Why students love SkillSwap
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '70px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 34, fontWeight: 700, marginBottom: 14 }}>Ready to swap skills?</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 16, maxWidth: 480, margin: '0 auto 32px' }}>
          Join your campus community and start learning from the best — your fellow students.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Create a free account</button>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text2)' }}>⚡ SkillSwap</span>
        <span style={{ color: 'var(--text3)', fontSize: 13 }}>© 2024 SkillSwap. Campus Skill Exchange Platform.</span>
        <span style={{ color: 'var(--text3)', fontSize: 13 }}>admin@skillswap.com</span>
      </footer>
    </div>
  );
}

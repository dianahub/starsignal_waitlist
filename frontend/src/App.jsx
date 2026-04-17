import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const inputStyle = {
  width: '100%',
  background: '#0f1a2e',
  border: '1px solid #1e3a5f',
  borderRadius: 8,
  color: '#e2e8f0',
  padding: '12px 16px',
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#64748b',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    trading_type: '',
    referral_source: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const focusedBorder = id => ({
    ...inputStyle,
    borderColor: focused === id ? '#3b82f6' : '#1e3a5f',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#070b16', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: '#0a0e1a', borderBottom: '1px solid #1e2d45', padding: '16px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>AI</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>Starsignal.io</div>
            <div style={{ fontSize: 11, color: '#475569' }}>AI Astro Trading</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>♄</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
                You're on the list!
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
                Thanks for signing up for the Starsignal.io beta. We'll reach out to <strong style={{ color: '#cbd5e1' }}>{form.email}</strong> when your spot is ready.
              </p>
              <div style={{
                marginTop: 32, padding: '16px 20px', borderRadius: 12,
                background: 'linear-gradient(135deg, #1e1b4b, #0f1a2e)',
                border: '1px solid #4338ca',
              }}>
                <p style={{ color: '#a5b4fc', fontSize: 13, lineHeight: 1.6 }}>
                  In the meantime, explore the public dashboard at{' '}
                  <a href="https://ai-trading-research.vercel.app" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#818cf8', textDecoration: 'underline' }}>
                    ai-trading-research.vercel.app
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Hero */}
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔭 ♄</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 10 }}>
                  Join the Beta
                </h1>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
                  Get early access to Starsignal.io — AI + financial astrology signals for crypto and stocks.
                </p>

                {/* Feature chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                  {['📈 Technicals', '♄ Astro Signals', '🤖 Claude AI', '🐋 Smart Money'].map(f => (
                    <span key={f} style={{
                      fontSize: 12, padding: '4px 12px', borderRadius: 99,
                      background: '#111827', border: '1px solid #1e2d45', color: '#64748b',
                    }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                <Field label="Full Name">
                  <input
                    name="name" type="text" required placeholder="Your name"
                    value={form.name} onChange={handle}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    style={focusedBorder('name')}
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    name="email" type="email" required placeholder="you@example.com"
                    value={form.email} onChange={handle}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    style={focusedBorder('email')}
                  />
                </Field>

                <Field label="What do you trade?">
                  <select
                    name="trading_type" required
                    value={form.trading_type} onChange={handle}
                    onFocus={() => setFocused('trading_type')} onBlur={() => setFocused(null)}
                    style={{ ...focusedBorder('trading_type'), cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select one…</option>
                    <option value="crypto">Crypto</option>
                    <option value="stocks">Stocks</option>
                    <option value="both">Both</option>
                  </select>
                </Field>

                <Field label="How did you hear about us?">
                  <select
                    name="referral_source" required
                    value={form.referral_source} onChange={handle}
                    onFocus={() => setFocused('referral_source')} onBlur={() => setFocused(null)}
                    style={{ ...focusedBorder('referral_source'), cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select one…</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="reddit">Reddit</option>
                    <option value="friend">Friend / Word of mouth</option>
                    <option value="google">Google search</option>
                    <option value="other">Other</option>
                  </select>
                </Field>

                {error && (
                  <p style={{ color: '#f87171', fontSize: 13, padding: '10px 14px', background: '#1a0f0f', borderRadius: 8, border: '1px solid #7f1d1d' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  style={{
                    padding: '14px 24px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                    color: '#a5b4fc', border: '1px solid #3730a3',
                    boxShadow: '0 0 20px #3730a344',
                    transition: 'filter 0.2s',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={e => { if (!loading) e.target.style.filter = 'brightness(1.2)' }}
                  onMouseLeave={e => { e.target.style.filter = 'brightness(1)' }}
                >
                  {loading ? 'Submitting…' : '♄ Request Beta Access'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#334155' }}>
                  No spam. We'll only email you when your beta access is ready.
                </p>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e2d45', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#334155' }}>
          © 2026{' '}
          <a href="https://dianacastillo.zo.space/futurotek/" target="_blank" rel="noopener noreferrer"
            style={{ color: '#334155', textDecoration: 'underline' }}>
            Futurotek LLC
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  )
}

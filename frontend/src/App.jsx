import { useState, useRef, useEffect } from 'react'

const API      = import.meta.env.VITE_API_URL      || 'http://localhost:4000'
const MAIN_API = import.meta.env.VITE_MAIN_API_URL || 'https://ai-trading-backend-production-311c.up.railway.app'

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
  color: '#94a3b8',
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
    promo_code: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)
  const [codeStatus, setCodeStatus] = useState(null) // null | 'checking' | 'valid' | 'invalid'
  const [codeMsg, setCodeMsg] = useState('')
  const debounceRef = useRef(null)

  // Auto-populate promo code from ?promocode= URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = (params.get('promocode') || params.get('promo') || params.get('code') || '').toUpperCase()
    if (code) {
     // setForm(f => ({ ...f, promo_code: code }))
    //  setCodeStatus('checking')
      //fetch(`${MAIN_API}/promo/validate?code=${encodeURIComponent(code)}`)
        //.then(r => r.json())
        //.then(d => {
         // if (d.valid) {
           // setCodeStatus('valid')
            //setCodeMsg(d.message || '45 days free and $19/month forever after')
          //} else {
           // setCodeStatus('invalid')
            //setCodeMsg(d.message || "Code not recognized — you'll still get 30 days free")
          //}
        //})
        //.catch(() => setCodeStatus(null))
    }
  }, [])

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handlePromoCode(e) {
    const val = e.target.value.toUpperCase()
   // setForm(f => ({ ...f, promo_code: val }))
    setCodeStatus(null)
    setCodeMsg('')
    clearTimeout(debounceRef.current)
    
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, promo_code: form.promo_code.trim() || undefined }),
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
            <div style={{ fontSize: 11, color: '#94a3b8' }}>AI Astro Trading</div>
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
            </div>
          ) : (
            <>
              {/* Hero */}
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔭 ♄</div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.2 }}>
                  Be First on Star Signal
                </h1>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
                  A trading platform built for people who follow the stars. Enter your email and you'll be the first to know when we launch.
                </p>
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

                <Field label="Promo code (optional)">
                  <div style={{ position: 'relative' }}>
                    <input
                      name="promo_code" type="text" placeholder="e.g. ROWAN"
                      value={form.promo_code} onChange={handlePromoCode}
                      onFocus={() => setFocused('promo_code')} onBlur={() => setFocused(null)}
                      maxLength={20}
                      style={{
                        ...focusedBorder('promo_code'),
                        borderColor: codeStatus === 'valid' ? '#22c55e' : codeStatus === 'invalid' ? '#1e3a5f' : focused === 'promo_code' ? '#3b82f6' : '#1e3a5f',
                        letterSpacing: '0.05em',
                        paddingRight: 36,
                      }}
                    />
                    {codeStatus === 'checking' && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#64748b' }}>…</span>
                    )}
                    {codeStatus === 'valid' && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }}>✓</span>
                    )}
                  </div>
                  {codeStatus === 'valid' && (
                    <p style={{ fontSize: 12, color: '#22c55e', marginTop: 4, fontWeight: 600 }}>✓ {codeMsg}</p>
                  )}
                  {codeStatus === 'invalid' && (
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{codeMsg}</p>
                  )}
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
                  {loading ? 'Submitting…' : 'Apply for Free Beta Access'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#334155' }}>
                  Limited to 100 founding members. No credit card needed to apply.
                </p>
              </form>

              {/* Astrologer partner CTA */}
              <a
                href="https://starsignal.io/partners/apply"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', marginTop: 24 }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #1a1200, #2a1f00)',
                  border: '1px solid #d4a847',
                  borderRadius: 14,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'filter 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <div style={{ fontSize: 32, flexShrink: 0 }}>✦</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#d4a847', marginBottom: 4, letterSpacing: '-0.01em' }}>
                      Are you a financial astrologer?
                    </div>
                    <div style={{ fontSize: 13, color: '#a07830', lineHeight: 1.5 }}>
                      Join the Starsignal Partner Network — get your insights in front of thousands of traders. Apply now →
                    </div>
                  </div>
                </div>
              </a>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e2d45', padding: '20px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8, flexWrap: 'wrap' }}>
          <a href="https://www.linkedin.com/company/113175994/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
            LinkedIn
          </a>
        </div>
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

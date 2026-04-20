import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const TRADING_LABEL = { crypto: '₿ Crypto', stocks: '📈 Stocks', both: '🔀 Both' }
const REFERRAL_LABEL = {
  twitter: 'Twitter/X', instagram: 'Instagram', tiktok: 'TikTok',
  youtube: 'YouTube', reddit: 'Reddit', friend: 'Friend / Word of mouth',
  google: 'Google', other: 'Other',
}

export default function Admin() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed]   = useState(false)
  const [creds, setCreds]     = useState(null)
  const [signups, setSignups] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  async function fetchSignups(adminEmail, adminPassword) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/signups`, {
        headers: {
          'x-admin-email':    adminEmail,
          'x-admin-password': adminPassword,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || data.error || 'Unauthorized')
      setSignups(data.signups)
      setAuthed(true)
      setCreds({ email: adminEmail, password: adminPassword })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogin(e) {
    e.preventDefault()
    fetchSignups(email, password)
  }

  const filtered = signups.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || s.trading_type === filter
    return matchesSearch && matchesFilter
  })

  // Breakdown counts
  const counts = signups.reduce((acc, s) => {
    acc[s.trading_type] = (acc[s.trading_type] ?? 0) + 1
    acc[s.referral_source] = (acc[s.referral_source] ?? 0) + 1
    return acc
  }, {})

  const inputStyle = {
    background: '#0f1a2e', border: '1px solid #1e3a5f', borderRadius: 8,
    color: '#e2e8f0', padding: '10px 14px', fontSize: 14, outline: 'none', width: '100%',
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#070b16', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Admin Access</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Enter your admin key to view signups</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email" required placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password" required placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              color: '#a5b4fc', border: '1px solid #3730a3', cursor: 'pointer',
            }}>
              {loading ? 'Checking…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070b16', color: '#e2e8f0', padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Beta Signups</h1>
            <p style={{ color: '#475569', fontSize: 13, marginTop: 2 }}>Starsignal.io waitlist</p>
          </div>
          <span style={{
            fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 99,
            background: '#0f1a2e', border: '1px solid #1e3a5f', color: '#94a3b8',
          }}>
            {signups.length} total signup{signups.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Crypto', value: counts.crypto ?? 0, icon: '₿' },
            { label: 'Stocks', value: counts.stocks ?? 0, icon: '📈' },
            { label: 'Both',   value: counts.both ?? 0,   icon: '🔀' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0b0f1e', border: '1px solid #1e2d45', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Referral breakdown */}
        <div style={{ background: '#0b0f1e', border: '1px solid #1e2d45', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>How they found us</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(REFERRAL_LABEL).map(([k, label]) => counts[k] ? (
              <span key={k} style={{
                fontSize: 12, padding: '4px 10px', borderRadius: 99,
                background: '#111827', border: '1px solid #1e2d45', color: '#94a3b8',
              }}>
                {label}: <strong style={{ color: '#e2e8f0' }}>{counts[k]}</strong>
              </span>
            ) : null)}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <input
            placeholder="Search name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 200 }}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
            <option value="all">All types</option>
            <option value="crypto">Crypto</option>
            <option value="stocks">Stocks</option>
            <option value="both">Both</option>
          </select>
          <button onClick={() => fetchSignups(creds.email, creds.password)} style={{
            padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: '#111827', border: '1px solid #1e2d45', color: '#64748b', cursor: 'pointer',
          }}>↻ Refresh</button>
        </div>

        {/* Table */}
        <div style={{ background: '#0b0f1e', border: '1px solid #1e2d45', borderRadius: 12, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', padding: 40, color: '#475569', fontSize: 14 }}>No signups found</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                    {['Name', 'Email', 'Trades', 'Found via', 'Signed up'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #0f1a2e' : 'none' }}>
                      <td style={{ padding: '11px 16px', color: '#e2e8f0', fontWeight: 500 }}>{s.name}</td>
                      <td style={{ padding: '11px 16px', color: '#94a3b8', fontFamily: 'monospace' }}>{s.email}</td>
                      <td style={{ padding: '11px 16px', color: '#64748b' }}>{TRADING_LABEL[s.trading_type] ?? s.trading_type}</td>
                      <td style={{ padding: '11px 16px', color: '#64748b' }}>{REFERRAL_LABEL[s.referral_source] ?? s.referral_source}</td>
                      <td style={{ padding: '11px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #1e2d45', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8, flexWrap: 'wrap' }}>
          <a href="mailto:contact@starsignal.io" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>Contact</a>
          <a href="https://www.linkedin.com/company/113175994/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>
            LinkedIn
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#334155' }}>© 2026 Futurotek LLC. All rights reserved.</p>
      </footer>
    </div>
  )
}

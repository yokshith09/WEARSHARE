'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

const P = '#7C3AED', P2 = '#8B5CF6', A = '#EC4899', D = '#0F172A', D2 = '#1E293B', L = '#F8FAFC', B = '#E2E8F0', G = '#10B981', R = '#EF4444', W = '#F59E0B'

const css = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0F172A;color:#F8FAFC}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{transform:translateX(300px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(124,58,237,.3)}50%{box-shadow:0 0 40px rgba(124,58,237,.6)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.fu{animation:fadeUp .5s ease-out forwards}
.glass{background:rgba(30,41,59,.7);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.08)}
.glass2{background:rgba(30,41,59,.5);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.06)}
.btn{border:none;cursor:pointer;font-weight:600;transition:all .25s;font-family:inherit;border-radius:10px}
.btn:hover{transform:translateY(-2px);filter:brightness(1.1)}
.btn:active{transform:scale(.97)}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.inp{width:100%;padding:.75rem 1rem;background:rgba(15,23,42,.6);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;font-size:.9rem;font-family:inherit;color:#F8FAFC;outline:none;transition:all .25s}
.inp:focus{border-color:${P};box-shadow:0 0 0 3px rgba(124,58,237,.15)}
.inp::placeholder{color:rgba(248,250,252,.3)}
select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23F8FAFC' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center}
textarea.inp{resize:vertical;min-height:80px}
.card{background:rgba(30,41,59,.6);backdrop-filter:blur(12px);border-radius:16px;border:1px solid rgba(255,255,255,.06);transition:all .35s}
.card:hover{border-color:rgba(124,58,237,.3);box-shadow:0 8px 32px rgba(124,58,237,.12)}
.grd{background:linear-gradient(135deg,${P},${A})}
.gt{background:linear-gradient(135deg,${P},${A});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sp{width:20px;height:20px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
.badge{display:inline-block;padding:.3rem .7rem;border-radius:20px;font-size:.75rem;font-weight:700;letter-spacing:.3px}
.tag{background:rgba(124,58,237,.15);color:${P2};border:1px solid rgba(124,58,237,.2)}
.collection-card:hover .collection-content{transform:translateY(-10px) !important}
.collection-card:hover .shop-btn{transform:translateX(5px);background:${P};color:#fff}
@media(max-width:768px){.hm{display:none!important}.mob-menu{display:flex!important}}
.upload-zone{border:2px dashed rgba(255,255,255,.15);border-radius:12px;padding:2rem;text-align:center;cursor:pointer;transition:all .3s}
.upload-zone:hover,.upload-zone.drag{border-color:${P};background:rgba(124,58,237,.05)}
.status-track{display:flex;align-items:center;gap:.5rem;position:relative}
.status-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0}
.status-line{height:2px;flex:1;background:rgba(255,255,255,.1);min-width:20px}
`

function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      {toasts.map(t => (
        <div key={t.id} className="glass" style={{
          padding: '.85rem 1.25rem', borderRadius: '12px', animation: 'slideR .3s ease-out',
          display: 'flex', alignItems: 'center', gap: '.6rem', minWidth: '260px',
          borderLeft: `3px solid ${t.type === 'success' ? G : R}`
        }}>
          <i className={`fas fa-${t.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ color: t.type === 'success' ? G : R }} />
          <span style={{ fontSize: '.9rem', fontWeight: 500 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

function Modal({ show, onClose, title, children, wide }) {
  if (!show) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} className="glass" style={{ borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: wide ? '720px' : '460px', animation: 'fadeUp .3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }} className="gt">{title}</h2>
          <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,.05)', fontSize: '1.2rem', color: '#94A3B8', padding: '.3rem .6rem' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FG({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '.35rem', fontSize: '.85rem', color: '#CBD5E1' }}>{label}</label>
      {children}
    </div>
  )
}

function getImg(l) { return l.imageData || l.imageUrl || '' }

export default function WearShareApp() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [toasts, setToasts] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [exploreFilters, setExploreFilters] = useState({})

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const refreshCart = useCallback(async () => {
    if (!user) return setCartCount(0)
    try {
      const r = await fetch('/api/cart')
      if (r.ok) { const d = await r.json(); setCartCount(d.items?.length || 0) }
    } catch { }
  }, [user])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(u => {
      setUser(u); setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { refreshCart() }, [refreshCart])

  const logout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    setUser(null); setCartCount(0); setPage('home'); toast('Logged out ✌️')
  }

  if (loading) return (
    <><style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: D }}>
        <div style={{ textAlign: 'center' }}>
          <div className="sp" style={{ borderTopColor: P, width: 44, height: 44, borderWidth: 3, marginBottom: '1rem' }} />
          <p className="gt" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Loading WearShare...</p>
        </div>
      </div></>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Toast toasts={toasts} />
      <Header user={user} page={page} setPage={setPage} cartCount={cartCount} logout={logout}
        onLogin={() => setShowLogin(true)} onRegister={() => setShowRegister(true)} onCart={() => setShowCart(true)}
        mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      {page === 'home' && <HomePage user={user} setPage={setPage} onRegister={() => setShowRegister(true)} setExploreFilters={setExploreFilters} />}
      {page === 'explore' && <ExplorePage user={user} toast={toast} refreshCart={refreshCart} onLogin={() => setShowLogin(true)} filters={exploreFilters} setFilters={setExploreFilters} />}
      {page === 'dashboard' && user && <DashboardPage user={user} toast={toast} onCreateListing={() => setShowCreateListing(true)} />}
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} setUser={setUser} toast={toast} switchToRegister={() => { setShowLogin(false); setShowRegister(true) }} />
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} setUser={setUser} toast={toast} switchToLogin={() => { setShowRegister(false); setShowLogin(true) }} />
      <CreateListingModal show={showCreateListing} onClose={() => setShowCreateListing(false)} toast={toast} user={user} />
      <CartModal show={showCart} onClose={() => setShowCart(false)} toast={toast} user={user} refreshCart={refreshCart} setPage={setPage} />
    </>
  )
}

function Header({ user, page, setPage, cartCount, logout, onLogin, onRegister, onCart, mobileMenu, setMobileMenu }) {
  const nav = (p) => { setPage(p); setMobileMenu(false) }
  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 500, padding: '.75rem 1.5rem', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <nav style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => nav('home')} style={{ fontSize: '1.5rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <span className="gt"><i className="fas fa-shirt" /> WearShare</span>
        </div>
        <div className="hm" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {['explore', 'dashboard'].map(p => (
            (p === 'dashboard' && !user) ? null :
              <button key={p} onClick={() => nav(p)} className="btn" style={{ background: page === p ? 'rgba(124,58,237,.15)' : 'none', color: page === p ? P2 : '#CBD5E1', padding: '.5rem .9rem', fontSize: '.9rem' }}>
                <i className={`fas fa-${p === 'explore' ? 'compass' : 'chart-pie'}`} style={{ marginRight: '.35rem' }} />{p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
          ))}
          {user && (
            <button onClick={onCart} className="btn" style={{ background: 'none', color: '#CBD5E1', padding: '.5rem', position: 'relative' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '1.1rem' }} />
              {cartCount > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-6px', background: A, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{cartCount}</span>}
            </button>
          )}
          {!user ? (
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <button onClick={onLogin} className="btn" style={{ padding: '.55rem 1.1rem', border: `1.5px solid ${P}`, color: P2, background: 'transparent', fontSize: '.85rem' }}>Login</button>
              <button onClick={onRegister} className="btn grd" style={{ padding: '.55rem 1.1rem', color: '#fff', fontSize: '.85rem', boxShadow: '0 4px 15px rgba(124,58,237,.35)' }}>Sign Up</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,' + P + ',' + A + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 700 }}>{user.name?.[0]}</div>
              <button onClick={logout} className="btn" style={{ padding: '.5rem .85rem', background: 'rgba(255,255,255,.06)', color: '#CBD5E1', fontSize: '.8rem', border: '1px solid rgba(255,255,255,.08)' }}>Logout</button>
            </div>
          )}
        </div>
        <button className="mob-menu btn" onClick={() => setMobileMenu(!mobileMenu)} style={{ background: 'none', color: '#CBD5E1', fontSize: '1.3rem', padding: '.4rem', display: 'none' }}>
          <i className={`fas fa-${mobileMenu ? 'times' : 'bars'}`} />
        </button>
      </nav>
      {mobileMenu && (
        <div className="fu" style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <button onClick={() => nav('explore')} className="btn" style={{ background: 'rgba(124,58,237,.1)', color: P2, padding: '.7rem', textAlign: 'left', width: '100%' }}><i className="fas fa-compass" style={{ marginRight: '.5rem' }} />Explore</button>
          {user && <button onClick={() => nav('dashboard')} className="btn" style={{ background: 'rgba(124,58,237,.1)', color: P2, padding: '.7rem', textAlign: 'left', width: '100%' }}><i className="fas fa-chart-pie" style={{ marginRight: '.5rem' }} />Dashboard</button>}
          {user && <button onClick={() => { onCart(); setMobileMenu(false) }} className="btn" style={{ background: 'rgba(124,58,237,.1)', color: P2, padding: '.7rem', textAlign: 'left', width: '100%' }}><i className="fas fa-shopping-bag" style={{ marginRight: '.5rem' }} />Cart {cartCount > 0 && `(${cartCount})`}</button>}
          {!user ? <>
            <button onClick={() => { onLogin(); setMobileMenu(false) }} className="btn" style={{ background: 'rgba(124,58,237,.1)', color: P2, padding: '.7rem', width: '100%' }}>Login</button>
            <button onClick={() => { onRegister(); setMobileMenu(false) }} className="btn grd" style={{ color: '#fff', padding: '.7rem', width: '100%' }}>Sign Up</button>
          </> : <button onClick={() => { logout(); setMobileMenu(false) }} className="btn" style={{ background: 'rgba(239,68,68,.1)', color: R, padding: '.7rem', width: '100%' }}>Logout</button>}
        </div>
      )}
    </header>
  )
}

function HomePage({ user, setPage, onRegister, setExploreFilters }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const dynamicTexts = ['Premium Fashion', 'Designer Dresses', 'Elegant Suits', 'Beautiful Sarees']
  useEffect(() => { const int = setInterval(() => { setCurrentTextIndex(i => (i + 1) % dynamicTexts.length) }, 3000); return () => clearInterval(int) }, [dynamicTexts.length])

  const steps = [
    { icon: 'fa-search', t: 'Browse', d: 'Explore curated fashion from your community' },
    { icon: 'fa-calendar-check', t: 'Book', d: 'Select dates and pay securely via Razorpay' },
    { icon: 'fa-box-open', t: 'Pickup', d: 'Collect from the community pickup point' },
    { icon: 'fa-rotate-left', t: 'Return', d: 'Return on time, get your deposit back' },
  ]
  const collections = [
    { title: 'Wedding Wear', category: 'saree', img: '/collections/wedding.png', count: '450+ Items' },
    { title: 'Formal Suits', category: 'suit', img: '/collections/formal.png', count: '320+ Items' },
    { title: 'Party Dresses', category: 'dress', img: '/collections/party.png', count: '280+ Items' },
    { title: 'Traditional Wear', category: 'lehenga', img: '/collections/traditional.png', count: '540+ Items' },
  ]
  return (
    <div style={{ background: D }}>
      <section style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* Floating Garment Silhouettes for visual polish */}
        <i className="fas fa-tshirt float" style={{ position: 'absolute', top: '20%', left: '15%', fontSize: '4rem', color: 'rgba(124,58,237,.05)', animationDuration: '6s' }} />
        <i className="fas fa-gem float" style={{ position: 'absolute', top: '30%', right: '15%', fontSize: '3rem', color: 'rgba(236,72,153,.05)', animationDuration: '4s', animationDelay: '1s' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }} className="fu">
          <div className="badge tag" style={{ marginBottom: '1.25rem', fontSize: '.8rem' }}>✨ Community Fashion Sharing Platform</div>
          <h1 style={{ fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem' }} className="gt">
            <span style={{ display: 'inline-block', minWidth: 300, transition: 'opacity 0.5s ease' }} key={currentTextIndex} className="fu">{dynamicTexts[currentTextIndex]}</span>,<br />Zero Waste
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Rent designer clothing from your community. Share your wardrobe and earn. Sustainable, affordable, and just a pickup away.
          </p>
          <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage('explore')} className="btn grd" style={{ padding: '.9rem 2.2rem', color: '#fff', fontSize: '1rem', boxShadow: '0 6px 24px rgba(124,58,237,.4)', animation: 'glow 3s infinite' }}>
              <i className="fas fa-compass" style={{ marginRight: '.5rem' }} />Explore Now
            </button>
            <button onClick={() => { const el = document.getElementById('how-it-works'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }} className="btn" style={{ padding: '.9rem 2.2rem', fontSize: '1rem', border: `1.5px solid rgba(124,58,237,.4)`, color: P2, background: 'rgba(124,58,237,.06)' }}>
              How it Works
            </button>
          </div>
        </div>
      </section>

      {/* Trust Signals Banner */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)', background: 'rgba(15,23,42,.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: '#64748B', fontSize: '.9rem', fontWeight: 600 }}>
          <span style={{ color: '#94A3B8' }}>Trusted by Community Members</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><i className="fas fa-shield-check" style={{ color: P }} /> 100% Verified Users</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><i className="fas fa-lock" style={{ color: P }} /> Secure Razorpay checkout</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><i className="fas fa-leaf" style={{ color: P }} /> Promoting Sustainable Fashion</div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
          {[['2K+', 'Community Items'], ['500+', 'Happy Members'], ['₹10L+', 'Saved Together'], ['4.9★', 'Trust Score']].map(([n, l]) => (
            <div key={l} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '.3rem' }} className="gt">{n}</div>
              <div style={{ color: '#64748B', fontWeight: 600, fontSize: '.85rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 900, marginBottom: '.5rem' }} className="gt">How It Works</h2>
        <p style={{ textAlign: 'center', color: '#64748B', marginBottom: '2.5rem' }}>Four simple steps to sustainable fashion</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem' }}>
          {steps.map((s, i) => (
            <div key={i} className="card" style={{ padding: '1.75rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-.6rem', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,' + P + ',' + A + ')', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 800 }}>{i + 1}</div>
              <i className={`fas ${s.icon}`} style={{ fontSize: '2rem', marginBottom: '.8rem', display: 'block', color: P2 }} />
              <h3 style={{ fontWeight: 700, marginBottom: '.4rem', fontSize: '1rem' }}>{s.t}</h3>
              <p style={{ color: '#64748B', fontSize: '.85rem', lineHeight: 1.5 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div className="badge tag" style={{ marginBottom: '.75rem' }}>TRENDING NOW</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.5px' }} className="gt">Handpicked Collections</h2>
          </div>
          <button onClick={() => setPage('explore')} className="btn" style={{ background: 'transparent', color: P2, fontWeight: 700, fontSize: '1rem', borderBottom: `2px solid ${P2}`, paddingBottom: '.2rem', borderRadius: 0 }}>View All <i className="fas fa-arrow-right" style={{ fontSize: '.8rem', marginLeft: '.4rem' }} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '2rem' }}>
          {collections.map((c, i) => (
            <div key={c.title} style={{ cursor: 'pointer' }} onClick={() => { setExploreFilters({ category: c.category }); setPage('explore') }} className="collection-card">
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 10px 30px rgba(0,0,0,.15)', background: `linear-gradient(135deg, ${P}22, ${A}22)` }}>
                <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)', transform: 'scale(1.02)' }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1.02)'} />

                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 40%, transparent 100%)', pointerEvents: 'none' }} />

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem', transform: 'translateY(10px)', transition: 'transform 0.3s', pointerEvents: 'none' }} className="collection-content">
                  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', padding: '.3rem .8rem', borderRadius: '4px', fontSize: '.75rem', fontWeight: 800, color: '#fff', letterSpacing: '1px', marginBottom: '.8rem', textTransform: 'uppercase' }}>{c.category}</div>
                  <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.6rem', marginBottom: '.4rem', textShadow: '0 2px 4px rgba(0,0,0,.5)', lineHeight: 1.2 }}>{c.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <span style={{ color: '#CBD5E1', fontSize: '.9rem', fontWeight: 500 }}>{c.count} available</span>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: D, transition: 'transform 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,.2)' }} className="shop-btn">
                      <i className="fas fa-arrow-right" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grd" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', margin: '1rem 0 0' }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '.75rem' }}>Ready to Join?</h2>
        <p style={{ color: 'rgba(255,255,255,.85)', marginBottom: '2rem', fontSize: '1rem' }}>Your community is already sharing. Don't miss out!</p>
        <button onClick={() => setPage('explore')} className="btn" style={{ background: '#fff', color: P, padding: '.9rem 2.2rem', fontSize: '1rem', fontWeight: 700 }}>
          Browse Items <i className="fas fa-arrow-right" style={{ marginLeft: '.5rem' }} />
        </button>
      </section>

      <footer style={{ background: 'rgba(15,23,42,.9)', color: '#475569', textAlign: 'center', padding: '1.5rem', fontSize: '.85rem', borderTop: '1px solid rgba(255,255,255,.04)' }}>
        © 2025 WearShare. Made with ❤️ for sustainable community fashion.
      </footer>
    </div>
  )
}


function ExplorePage({ user, toast, refreshCart, onLogin, filters, setFilters }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(filters?.search || '')
  const [category, setCategory] = useState(filters?.category || '')
  const [size, setSize] = useState(filters?.size || '')
  const [minPrice, setMinPrice] = useState(filters?.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(filters?.maxPrice || '')
  const [selectedListing, setSelectedListing] = useState(null)
  const [tryOnListing, setTryOnListing] = useState(null)

  const loadListings = async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (category) p.set('category', category)
    if (size) p.set('size', size)
    if (minPrice) p.set('min_price', minPrice)
    if (maxPrice) p.set('max_price', maxPrice)
    try { const r = await fetch('/api/listings?' + p); const d = await r.json(); setListings(Array.isArray(d) ? d : []) } catch { setListings([]) }
    setLoading(false)
  }
  useEffect(() => { loadListings() }, [])

  const addToCart = async (listing) => {
    if (!user) { onLogin(); return }
    const r = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId: listing._id, days: 1 }) })
    if (r.ok) { toast('Added to cart! 🛒'); refreshCart() } else toast('Failed to add', 'error')
  }

  const grads = ['linear-gradient(135deg,#7C3AED,#EC4899)', 'linear-gradient(135deg,#EC4899,#F59E0B)', 'linear-gradient(135deg,#10B981,#3B82F6)', 'linear-gradient(135deg,#F59E0B,#EF4444)', 'linear-gradient(135deg,#3B82F6,#7C3AED)']

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '.3rem' }} className="gt"><i className="fas fa-compass" style={{ marginRight: '.5rem' }} />Explore Fashion</h1>
        <p style={{ color: '#64748B' }}>Discover premium clothing from your community</p>
      </div>
      <div className="glass" style={{ padding: '1rem', marginBottom: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '.6rem', alignItems: 'flex-end', borderRadius: '14px' }}>
        <div style={{ flex: '2 1 200px' }}><input className="inp" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadListings()} placeholder="🔍 Search clothes, brands..." /></div>
        <div style={{ flex: '1 1 140px' }}>
          <select className="inp" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {['Dress', 'Suit', 'Jacket', 'Saree', 'Lehenga', 'Kurta', 'Shoes', 'Accessories'].map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <select className="inp" value={size} onChange={e => setSize(e.target.value)}>
            <option value="">All Sizes</option>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 100px' }}><input className="inp" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min ₹" /></div>
        <div style={{ flex: '1 1 100px' }}><input className="inp" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max ₹" /></div>
        <button onClick={loadListings} className="btn grd" style={{ color: '#fff', padding: '.75rem 1.3rem', whiteSpace: 'nowrap' }}><i className="fas fa-search" style={{ marginRight: '.3rem' }} />Search</button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="sp" style={{ borderTopColor: P, width: 40, height: 40, borderWidth: 3 }} /></div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
          <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: '#334155' }} />
          <h3 style={{ color: '#94A3B8' }}>No items found</h3><p style={{ color: '#64748B' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
          {listings.map((l, idx) => {
            const img = getImg(l)
            return (
              <div key={l._id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedListing(l)}>
                <div style={{ height: 200, background: grads[idx % grads.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {img ? <img src={img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} /> : <i className="fas fa-shirt" style={{ fontSize: '3.5rem', color: 'rgba(255,255,255,.25)' }} />}
                  <span style={{ position: 'absolute', top: '.75rem', right: '.75rem', background: 'rgba(0,0,0,.55)', color: '#fff', padding: '.25rem .6rem', borderRadius: '8px', fontSize: '.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>{l.condition}</span>
                  <button onClick={e => { e.stopPropagation(); setTryOnListing(l) }} className="btn" style={{ position: 'absolute', bottom: '.75rem', right: '.75rem', background: 'rgba(124,58,237,.85)', color: '#fff', padding: '.35rem .7rem', fontSize: '.7rem', backdropFilter: 'blur(4px)' }}>
                    <i className="fas fa-wand-magic-sparkles" style={{ marginRight: '.25rem' }} />Try On
                  </button>
                </div>
                <div style={{ padding: '1.1rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '.2rem', fontSize: '.95rem', color: '#F1F5F9' }}>{l.name}</h3>
                  <p style={{ color: '#64748B', fontSize: '.8rem', marginBottom: '.6rem' }}>{l.brand || 'Brand'} · Size {l.size}</p>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: P2, marginBottom: '.9rem' }}>₹{l.rentalPricePerDay}<span style={{ fontSize: '.8rem', fontWeight: 500, color: '#64748B' }}>/day</span></div>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <button onClick={e => { e.stopPropagation(); setSelectedListing(l) }} className="btn" style={{ flex: 1, padding: '.55rem', border: '1.5px solid rgba(124,58,237,.3)', color: P2, background: 'rgba(124,58,237,.06)', fontSize: '.82rem' }}>Details</button>
                    <button onClick={e => { e.stopPropagation(); addToCart(l) }} className="btn grd" style={{ flex: 1, padding: '.55rem', color: '#fff', fontSize: '.82rem' }}><i className="fas fa-cart-plus" style={{ marginRight: '.25rem' }} />Add</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {selectedListing && <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} addToCart={addToCart} onTryOn={() => { setTryOnListing(selectedListing); setSelectedListing(null) }} />}
      {tryOnListing && <TryOnModal listing={tryOnListing} onClose={() => setTryOnListing(null)} />}
    </div>
  )
}

function ListingDetailModal({ listing, onClose, addToCart, onTryOn }) {
  const img = getImg(listing)
  return (
    <Modal show={true} onClose={onClose} title={listing.name} wide>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ height: 250, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
            {img ? <img src={img} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} onError={e => { e.target.style.display = 'none' }} /> : <i className="fas fa-shirt" style={{ fontSize: '4rem', color: 'rgba(255,255,255,.3)' }} />}
          </div>
          <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '.9rem' }}>{listing.description || 'Beautiful item in excellent condition.'}</p>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: P2 }}>₹{listing.rentalPricePerDay}</div>
          <p style={{ color: '#64748B', marginBottom: '1.25rem', fontSize: '.85rem' }}>per day</p>
          {[['Brand', listing.brand || '-'], ['Size', listing.size], ['Condition', listing.condition], ['Deposit', '₹' + listing.securityDeposit], ['Lender', listing.ownerName || 'Community Member']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <span style={{ color: '#64748B', fontSize: '.88rem' }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: '.88rem', color: '#E2E8F0' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '1.25rem' }}>
            <button onClick={onTryOn} className="btn" style={{ flex: 1, padding: '.8rem', border: '1.5px solid rgba(124,58,237,.3)', color: P2, background: 'rgba(124,58,237,.06)', fontSize: '.9rem' }}><i className="fas fa-wand-magic-sparkles" style={{ marginRight: '.4rem' }} />Try On AI</button>
            <button onClick={() => { addToCart(listing); onClose() }} className="btn grd" style={{ flex: 1, padding: '.8rem', color: '#fff', fontSize: '.9rem' }}><i className="fas fa-shopping-cart" style={{ marginRight: '.4rem' }} />Add to Cart</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function TryOnModal({ listing, onClose }) {
  const [userPhoto, setUserPhoto] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const garmentImg = getImg(listing)

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto(ev.target.result);
    reader.readAsDataURL(file)
  }

  const generateTryOn = async () => {
    if (!userPhoto || !garmentImg) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: userPhoto,
          garmentImage: garmentImg,
          category: 'Upper-body'
        })
      });
      const data = await res.json();
      if (res.ok && data.resultImage) {
        setResultImage(data.resultImage);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal show={true} onClose={onClose} title="✨ AI Try-On Preview" wide>
      <p style={{ color: '#94A3B8', marginBottom: '1rem', fontSize: '.88rem' }}>Upload your photo to see how <strong style={{ color: '#E2E8F0' }}>{listing.name}</strong> looks on you using advanced AI!</p>

      {!userPhoto && !resultImage ? (
        <label className="upload-zone" style={{ display: 'block', cursor: 'pointer' }}>
          <i className="fas fa-camera" style={{ fontSize: '2.5rem', color: P2, display: 'block', marginBottom: '.75rem' }} />
          <p style={{ fontWeight: 600, color: '#CBD5E1', marginBottom: '.3rem' }}>Upload Your Photo</p>
          <p style={{ color: '#64748B', fontSize: '.82rem' }}>A clear front-facing, half-body photo works best</p>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
        </label>
      ) : resultImage ? (
        <div style={{ textAlign: 'center' }}>
          <img src={resultImage} alt="AI Try-On Result" style={{ width: '100%', maxWidth: 360, borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)' }} />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.25rem' }}>
            <button onClick={() => { setUserPhoto(null); setResultImage(null) }} className="btn" style={{ padding: '.7rem 1.5rem', border: '1px solid rgba(255,255,255,.2)', background: 'transparent', color: '#E2E8F0', fontSize: '.9rem' }}><i className="fas fa-redo" style={{ marginRight: '.4rem' }} />Try Another</button>
            <button onClick={onClose} className="btn grd" style={{ padding: '.7rem 1.5rem', color: '#fff', fontSize: '.9rem' }}><i className="fas fa-check" style={{ marginRight: '.4rem' }} />Looks Good!</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 160, height: 220, background: 'rgba(15,23,42,.5)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <img src={userPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="You" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: '.7rem', padding: '.25rem', backdropFilter: 'blur(4px)' }}>Your Photo</div>
            </div>
            <i className="fas fa-plus" style={{ color: '#64748B', fontSize: '1.5rem' }} />
            <div style={{ width: 160, height: 220, background: 'rgba(15,23,42,.5)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              {garmentImg ? <img src={garmentImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Garment" /> : <i className="fas fa-shirt" style={{ fontSize: '3rem', color: 'rgba(255,255,255,.2)', marginTop: '3rem' }} />}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: '.7rem', padding: '.25rem', backdropFilter: 'blur(4px)' }}>{listing.name}</div>
            </div>
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,.1)', color: R, padding: '.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '.85rem', border: '1px solid rgba(239,68,68,.2)' }}><i className="fas fa-exclamation-circle" style={{ marginRight: '.3rem' }} />{error}</div>}

          <button onClick={generateTryOn} disabled={loading} className="btn grd" style={{ width: '100%', maxWidth: 360, padding: '1rem', color: '#fff', fontSize: '1rem', position: 'relative', overflow: 'hidden' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}><span className="sp" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating Magic...</span>
            ) : (
              <><i className="fas fa-wand-magic-sparkles" style={{ marginRight: '.5rem' }} />Generate Realistic Try-On</>
            )}
            {loading && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }} />}
          </button>

          <div style={{ marginTop: '1.25rem' }}>
            <button onClick={() => { setUserPhoto(null); setError(null) }} disabled={loading} className="btn" style={{ background: 'none', color: '#64748B', fontSize: '.85rem' }}>Change Photo</button>
          </div>
        </div>
      )}
    </Modal>
  )
}


function CartModal({ show, onClose, toast, user, refreshCart, setPage }) {
  const [items, setItems] = useState([])
  const [rentalStart, setRentalStart] = useState('')
  const [deliveryDetails, setDeliveryDetails] = useState('')
  const [returnDetails, setReturnDetails] = useState('')
  const [pickupDetails, setPickupDetails] = useState('')
  const [collectDetails, setCollectDetails] = useState('')
  const [paying, setPaying] = useState(false)
  const loadCart = async () => { if (!user) return; const r = await fetch('/api/cart'); if (r.ok) { const d = await r.json(); setItems(d.items || []) } }
  useEffect(() => { if (show) loadCart() }, [show, user])
  const removeItem = async (lid) => { await fetch('/api/cart?listingId=' + lid, { method: 'DELETE' }); loadCart(); refreshCart() }
  const updateDays = async (lid, days) => { await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId: lid, days: Number(days) }) }); loadCart() }
  const subtotal = items.reduce((s, i) => s + i.rentalPricePerDay * i.days, 0)
  const deposit = items.reduce((s, i) => s + i.securityDeposit, 0)
  const platformFee = Math.round((subtotal + deposit) * 0.05)
  const total = subtotal + deposit + platformFee
  const checkout = async () => {
    if (!rentalStart) { toast('Select a rental start date', 'error'); return }
    if (!deliveryDetails || !returnDetails || !pickupDetails || !collectDetails) { toast('Please fill in all logistics details', 'error'); return }
    setPaying(true)
    try {
      const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rentalStart }) })
      const d = await r.json()
      if (!d.orderId) { toast(d.error || 'Checkout failed', 'error'); setPaying(false); return }
      const openRzp = (data) => {
        const rzp = new window.Razorpay({
          key: data.keyId, amount: data.amount, currency: data.currency, name: 'WearShare', description: 'Premium Clothing Rental', order_id: data.orderId, theme: { color: '#EC4899' },
          handler: async (res) => { const cr = await fetch('/api/checkout/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: res.razorpay_payment_id, orderId: res.razorpay_order_id, signature: res.razorpay_signature, rentalStart, deliveryDetails, returnDetails, pickupDetails, collectDetails }) }); if (cr.ok) { toast('Payment successful! 🎉'); onClose(); refreshCart(); setItems([]); setPage('dashboard') } else toast('Verification failed', 'error'); setPaying(false) },
          modal: { ondismiss: () => setPaying(false) }
        }); rzp.open()
      }
      if (window.Razorpay) { openRzp(d) } else { const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = () => openRzp(d); s.onerror = () => { toast('Failed to load Razorpay', 'error'); setPaying(false) }; document.body.appendChild(s) }
    } catch (e) { toast('Payment error: ' + e.message, 'error'); setPaying(false) }
  }
  return (
    <Modal show={show} onClose={onClose} title="🛒 Shopping Cart" wide>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748B' }}>
          <i className="fas fa-shopping-bag" style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block', color: 'rgba(255,255,255,.1)' }} />
          <h3 style={{ color: '#E2E8F0', fontSize: '1.25rem', fontWeight: 800, marginBottom: '.5rem' }}>Your cart feels so light!</h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>There is nothing in your bag. Let's add some items.</p>
          <button onClick={onClose} className="btn grd" style={{ color: '#fff', padding: '.8rem 2rem', fontWeight: 700, borderRadius: '8px' }}>Explore Fashion</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '1rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: '.75rem' }}>Items in your Bag</h3>
            {items.map(item => (
              <div key={item.listingId} style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', marginBottom: '1rem', alignItems: 'center', background: 'rgba(30,41,59,.4)', transition: 'all .3s', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}>
                <div style={{ width: 80, height: 100, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.imageData || item.imageUrl ? <img src={item.imageData || item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="fas fa-shirt" style={{ color: 'rgba(255,255,255,.5)', fontSize: '2rem' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC', marginBottom: '.3rem' }}>{item.name}</div>
                    <button onClick={() => removeItem(item.listingId)} className="btn" style={{ background: 'transparent', color: R, padding: '.2rem .5rem', fontSize: '1rem', opacity: .7 }}><i className="fas fa-times" /></button>
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '.85rem', marginBottom: '.6rem' }}>Size {item.size} | Sold by Community</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                      <span style={{ fontSize: '.85rem', color: '#CBD5E1', fontWeight: 600 }}>Days:</span>
                      <select value={item.days} onChange={e => updateDays(item.listingId, e.target.value)} className="inp" style={{ width: '70px', padding: '.3rem .6rem', fontSize: '.9rem', background: 'rgba(15,23,42,.8)' }}>
                        {[1, 2, 3, 4, 5, 7, 10, 14, 30].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div style={{ fontWeight: 900, color: P2, fontSize: '1.1rem' }}>₹{item.rentalPricePerDay * item.days}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2rem', paddingBottom: '1rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: '.75rem' }}><i className="fas fa-truck" style={{ marginRight: '.5rem', color: P2 }} />Logistics & Delivery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FG label="Start Date *"><input type="date" className="inp" value={rentalStart} min={new Date().toISOString().split('T')[0]} onChange={e => setRentalStart(e.target.value)} style={{ background: 'rgba(15,23,42,.6)' }} /></FG>
                <FG label="Delivery Details *"><input className="inp" value={deliveryDetails} onChange={e => setDeliveryDetails(e.target.value)} placeholder="House, Area, Landm..." style={{ background: 'rgba(15,23,42,.6)' }} /></FG>
                <FG label="Return Details *"><input className="inp" value={returnDetails} onChange={e => setReturnDetails(e.target.value)} placeholder="Return location/notes" style={{ background: 'rgba(15,23,42,.6)' }} /></FG>
                <FG label="Pickup Details *"><input className="inp" value={pickupDetails} onChange={e => setPickupDetails(e.target.value)} placeholder="Where to pick from?" style={{ background: 'rgba(15,23,42,.6)' }} /></FG>
                <div style={{ gridColumn: 'span 2' }}>
                  <FG label="Collect Details *"><input className="inp" value={collectDetails} onChange={e => setCollectDetails(e.target.value)} placeholder="Who will collect?" style={{ background: 'rgba(15,23,42,.6)' }} /></FG>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="glass2" style={{ padding: '1.5rem', borderRadius: '16px', position: 'sticky', top: '1rem', border: '1px solid rgba(255,255,255,.1)' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', fontSize: '1.1rem', color: '#E2E8F0', borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: '.75rem' }}>Price Details ({items.length} Items)</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem' }}><span style={{ color: '#94A3B8' }}>Total Rental</span><span style={{ fontWeight: 600, color: '#F8FAFC' }}>₹{subtotal}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem' }}><span style={{ color: '#94A3B8' }}>Security Deposit (Refundable)</span><span style={{ fontWeight: 600, color: '#F8FAFC' }}>₹{deposit}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem' }}><span style={{ color: '#94A3B8' }}>Platform Fee (5%)</span><span style={{ fontWeight: 600, color: '#F8FAFC' }}>₹{platformFee}</span></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,.15)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Amount</span>
                <span style={{ fontWeight: 900, fontSize: '1.4rem', color: P2 }}>₹{total}</span>
              </div>

              <button onClick={checkout} disabled={paying} className="btn grd" style={{ width: '100%', padding: '1.1rem', color: '#fff', fontSize: '1.05rem', fontWeight: 800, boxShadow: '0 8px 20px rgba(236,72,153,.3)', borderRadius: '10px' }}>
                {paying ? <span className="sp" /> : <><i className="fas fa-lock" style={{ marginRight: '.5rem' }} />Place Order</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', marginTop: '1.25rem', color: '#64748B', fontSize: '.75rem', fontWeight: 600 }}>
                <i className="fas fa-shield-check" style={{ color: '#10B981' }} />
                100% Secure Razorpay Checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

function DashboardPage({ user, toast, onCreateListing }) {
  const [tab, setTab] = useState('overview')
  const [rentals, setRentals] = useState([])
  const [lending, setLending] = useState([])
  const [myListings, setMyListings] = useState([])
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' })
  const [saving, setSaving] = useState(false)
  const loadData = () => { fetch('/api/bookings').then(r => r.json()).then(d => { setRentals(d.rentals || []); setLending(d.lending || []) }).catch(() => { }); fetch('/api/listings?user=true').then(r => r.json()).then(d => setMyListings(Array.isArray(d) ? d : [])).catch(() => { }) }
  useEffect(() => { loadData() }, [])
  const deleteListing = async (id) => { if (!confirm('Delete?')) return; const r = await fetch('/api/listings/' + id, { method: 'DELETE' }); if (r.ok) { toast('Deleted'); setMyListings(p => p.filter(l => l._id !== id)) } else toast('Failed', 'error') }
  const updateDeliveryStatus = async (bid, status) => { const r = await fetch('/api/bookings/status', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: bid, deliveryStatus: status }) }); if (r.ok) { toast('Status updated!'); loadData() } else toast('Failed', 'error') }
  const saveProfile = async () => { setSaving(true); const r = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }); setSaving(false); toast(r.ok ? 'Profile updated!' : 'Failed', r.ok ? 'success' : 'error') }
  const tabs = [{ id: 'overview', icon: 'fa-chart-pie', label: 'Overview' }, { id: 'rentals', icon: 'fa-shopping-bag', label: 'My Rentals' }, { id: 'lending', icon: 'fa-hand-holding-heart', label: 'Lending' }, { id: 'deliveries', icon: 'fa-truck', label: 'Pickup/Return' }, { id: 'listings', icon: 'fa-list', label: 'My Listings' }, { id: 'profile', icon: 'fa-user', label: 'Profile' }]
  const sC = { pending: '#F59E0B', ready_for_pickup: '#3B82F6', picked_up: '#8B5CF6', in_use: '#10B981', returned: '#6B7280' }
  const sL = { pending: 'Pending', ready_for_pickup: 'Ready', picked_up: 'Picked Up', in_use: 'In Use', returned: 'Returned' }
  const dSteps = ['pending', 'ready_for_pickup', 'picked_up', 'in_use', 'returned']
  const allBookings = [...rentals.map(b => ({ ...b, role: 'renter' })), ...lending.map(b => ({ ...b, role: 'lender' }))]
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '.3rem' }} className="gt"><i className="fas fa-user-circle" style={{ marginRight: '.5rem' }} />My Dashboard</h1>
      <p style={{ color: '#64748B', marginBottom: '1.75rem' }}>Manage your rentals, listings & deliveries</p>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem', height: 'fit-content', position: 'sticky', top: '80px' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className="btn" style={{ width: '100%', padding: '.6rem .8rem', textAlign: 'left', marginBottom: '.2rem', fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: '.6rem', background: tab === t.id ? 'linear-gradient(135deg,#7C3AED,#6D28D9)' : 'none', color: tab === t.id ? '#fff' : '#94A3B8', borderRadius: '8px' }}><i className={`fas ${t.icon}`} style={{ width: 16 }} />{t.label}</button>))}
          <hr style={{ margin: '.6rem 0', border: 'none', borderTop: '1px solid rgba(255,255,255,.06)' }} />
          <button onClick={onCreateListing} className="btn grd" style={{ width: '100%', padding: '.65rem', color: '#fff', fontSize: '.85rem' }}><i className="fas fa-plus" style={{ marginRight: '.4rem' }} />List Item</button>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          {tab === 'overview' && (<div>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#E2E8F0' }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '.8rem', marginBottom: '1.75rem' }}>
              {[['Rentals', rentals.length, 'fa-shopping-bag'], ['Lending', lending.length, 'fa-hand-holding-heart'], ['Listings', myListings.length, 'fa-list']].map(([l, v, i]) => (<div key={l} className="grd" style={{ borderRadius: '12px', padding: '1.25rem', color: '#fff' }}><i className={`fas ${i}`} style={{ fontSize: '1.3rem', marginBottom: '.4rem', display: 'block', opacity: .8 }} /><div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{v}</div><div style={{ fontSize: '.8rem', opacity: .9 }}>{l}</div></div>))}
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '.8rem', color: '#CBD5E1' }}>Recent Activity</h3>
            {rentals.slice(0, 3).length ? rentals.slice(0, 3).map(b => (<div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem .8rem', background: 'rgba(15,23,42,.4)', borderRadius: '8px', marginBottom: '.4rem' }}><span style={{ fontWeight: 600, fontSize: '.88rem', color: '#CBD5E1' }}>{b.listingName}</span><span className="badge" style={{ background: sC[b.deliveryStatus || 'pending'] + '20', color: sC[b.deliveryStatus || 'pending'] }}>{sL[b.deliveryStatus || 'pending']}</span></div>)) : <p style={{ color: '#475569' }}>No activity yet.</p>}
          </div>)}
          {tab === 'rentals' && (<div><h2 style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#E2E8F0' }}>My Rentals</h2>
            {rentals.length ? rentals.map(b => (<div key={b._id} className="glass2" style={{ padding: '1rem', borderRadius: '12px', marginBottom: '.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}><div><div style={{ fontWeight: 700, color: '#E2E8F0', marginBottom: '.2rem' }}>{b.listingName}</div><div style={{ color: '#64748B', fontSize: '.82rem' }}>{b.days} days · ₹{b.totalAmount}</div></div><span className="badge" style={{ background: sC[b.deliveryStatus || 'pending'] + '20', color: sC[b.deliveryStatus || 'pending'] }}>{sL[b.deliveryStatus || 'pending']}</span></div>)) : <p style={{ color: '#475569' }}>No rentals yet.</p>}
          </div>)}
          {tab === 'lending' && (<div><h2 style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#E2E8F0' }}>Items Being Rented Out</h2>
            {lending.length ? lending.map(b => (<div key={b._id} className="glass2" style={{ padding: '1rem', borderRadius: '12px', marginBottom: '.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}><div><div style={{ fontWeight: 700, color: '#E2E8F0', marginBottom: '.2rem' }}>{b.listingName}</div><div style={{ color: '#64748B', fontSize: '.82rem' }}>Renter: {b.renterName} · ₹{b.totalAmount}</div></div><span className="badge" style={{ background: sC[b.deliveryStatus || 'pending'] + '20', color: sC[b.deliveryStatus || 'pending'] }}>{sL[b.deliveryStatus || 'pending']}</span></div>)) : <p style={{ color: '#475569' }}>No one rented your items yet.</p>}
          </div>)}
          {tab === 'deliveries' && (<div>
            <h2 style={{ fontWeight: 700, marginBottom: '.5rem', color: '#E2E8F0' }}>Pickup & Return Tracking</h2>
            <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '.88rem' }}>Track and update delivery status for your bookings</p>
            {allBookings.length ? allBookings.map(b => (<div key={b._id + '_' + b.role} className="glass2" style={{ padding: '1.25rem', borderRadius: '14px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '.5rem' }}>
                <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#E2E8F0', marginBottom: '.2rem' }}>{b.listingName}</div><div style={{ color: '#64748B', fontSize: '.82rem' }}>You are the <strong style={{ color: P2 }}>{b.role}</strong> · {b.days} days · ₹{b.totalAmount}</div></div>
                <span className="badge" style={{ background: sC[b.deliveryStatus || 'pending'] + '20', color: sC[b.deliveryStatus || 'pending'] }}>{sL[b.deliveryStatus || 'pending']}</span>
              </div>
              <div className="status-track" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                {dSteps.map((step, i) => { const cur = dSteps.indexOf(b.deliveryStatus || 'pending'); const done = i <= cur; return (<div key={step} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flex: i < dSteps.length - 1 ? 1 : 'none' }}><div className="status-dot" style={{ background: done ? sC[step] : 'rgba(255,255,255,.1)', color: done ? '#fff' : '#475569' }}>{done ? '✓' : (i + 1)}</div>{i < dSteps.length - 1 && <div className="status-line" style={{ background: i < cur ? G : 'rgba(255,255,255,.08)' }} />}</div>) })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', background: 'rgba(15,23,42,.4)', padding: '.9rem', borderRadius: '10px', marginBottom: '.9rem' }}>
                <div><div style={{ color: '#64748B', fontSize: '.75rem', fontWeight: 600, marginBottom: '.2rem' }}>📍 PICKUP</div><div style={{ color: '#CBD5E1', fontSize: '.85rem' }}>{b.pickupLocation || 'Community Point'}</div></div>
                <div><div style={{ color: '#64748B', fontSize: '.75rem', fontWeight: 600, marginBottom: '.2rem' }}>📅 RETURN BY</div><div style={{ color: '#CBD5E1', fontSize: '.85rem' }}>{b.returnDeadline ? new Date(b.returnDeadline).toLocaleDateString() : 'TBD'}</div></div>
                {b.role === 'renter' && b.lenderPhone && <div><div style={{ color: '#64748B', fontSize: '.75rem', fontWeight: 600 }}>📞 LENDER</div><div style={{ color: '#CBD5E1', fontSize: '.85rem' }}>{b.lenderPhone}</div></div>}
                {b.role === 'lender' && b.renterPhone && <div><div style={{ color: '#64748B', fontSize: '.75rem', fontWeight: 600 }}>📞 RENTER</div><div style={{ color: '#CBD5E1', fontSize: '.85rem' }}>{b.renterPhone}</div></div>}
              </div>
              {(b.deliveryStatus || 'pending') !== 'returned' && (<div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {b.role === 'lender' && (b.deliveryStatus || 'pending') === 'pending' && <button onClick={() => updateDeliveryStatus(b._id, 'ready_for_pickup')} className="btn" style={{ padding: '.5rem 1rem', background: 'rgba(59,130,246,.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,.2)', fontSize: '.82rem' }}><i className="fas fa-box" style={{ marginRight: '.3rem' }} />Mark Ready</button>}
                {b.role === 'renter' && b.deliveryStatus === 'ready_for_pickup' && <button onClick={() => updateDeliveryStatus(b._id, 'picked_up')} className="btn" style={{ padding: '.5rem 1rem', background: 'rgba(139,92,246,.1)', color: P2, border: '1px solid rgba(139,92,246,.2)', fontSize: '.82rem' }}><i className="fas fa-hand-holding" style={{ marginRight: '.3rem' }} />Confirm Pickup</button>}
                {b.role === 'renter' && b.deliveryStatus === 'picked_up' && <button onClick={() => updateDeliveryStatus(b._id, 'in_use')} className="btn" style={{ padding: '.5rem 1rem', background: 'rgba(16,185,129,.1)', color: G, border: '1px solid rgba(16,185,129,.2)', fontSize: '.82rem' }}><i className="fas fa-check" style={{ marginRight: '.3rem' }} />Start Using</button>}
                {(b.deliveryStatus === 'in_use') && <button onClick={() => updateDeliveryStatus(b._id, 'returned')} className="btn" style={{ padding: '.5rem 1rem', background: 'rgba(107,114,128,.1)', color: '#9CA3AF', border: '1px solid rgba(107,114,128,.2)', fontSize: '.82rem' }}><i className="fas fa-rotate-left" style={{ marginRight: '.3rem' }} />{b.role === 'lender' ? 'Confirm Return' : 'Mark Returned'}</button>}
              </div>)}
            </div>)) : <p style={{ color: '#475569' }}>No active deliveries.</p>}
          </div>)}
          {tab === 'listings' && (<div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}><h2 style={{ fontWeight: 700, color: '#E2E8F0' }}>My Listings</h2><button onClick={onCreateListing} className="btn grd" style={{ color: '#fff', padding: '.55rem 1rem', fontSize: '.85rem' }}><i className="fas fa-plus" style={{ marginRight: '.3rem' }} />Add New</button></div>
            {myListings.length ? (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '.9rem' }}>{myListings.map(l => { const img = getImg(l); return (<div key={l._id} className="card" style={{ overflow: 'hidden' }}><div style={{ height: 110, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{img ? <img src={img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} /> : <i className="fas fa-shirt" style={{ fontSize: '2rem', color: 'rgba(255,255,255,.4)' }} />}</div><div style={{ padding: '.7rem' }}><div style={{ fontWeight: 700, fontSize: '.85rem', marginBottom: '.2rem', color: '#E2E8F0' }}>{l.name}</div><div style={{ color: P2, fontWeight: 700, fontSize: '.82rem', marginBottom: '.5rem' }}>₹{l.rentalPricePerDay}/day</div><button onClick={() => deleteListing(l._id)} className="btn" style={{ width: '100%', padding: '.35rem', background: 'rgba(239,68,68,.08)', color: R, fontSize: '.78rem', border: '1px solid rgba(239,68,68,.12)' }}><i className="fas fa-trash" style={{ marginRight: '.2rem' }} />Delete</button></div></div>) })}</div>) : (<div style={{ textAlign: 'center', padding: '2.5rem', color: '#475569' }}><i className="fas fa-inbox" style={{ fontSize: '2.5rem', marginBottom: '.8rem', display: 'block', color: '#334155' }} /><p style={{ color: '#94A3B8' }}>No listings yet.</p><button onClick={onCreateListing} className="btn grd" style={{ color: '#fff', padding: '.65rem 1.3rem', marginTop: '.8rem' }}>Create Listing</button></div>)}
          </div>)}
          {tab === 'profile' && (<div style={{ maxWidth: 420 }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', color: '#E2E8F0' }}>Edit Profile</h2>
            <FG label="Full Name"><input className="inp" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></FG>
            <FG label="Email (read-only)"><input className="inp" value={user.email} readOnly style={{ opacity: .5, cursor: 'not-allowed' }} /></FG>
            <FG label="Phone (WhatsApp)"><input className="inp" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" /></FG>
            <FG label="Address / Pickup Location"><input className="inp" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} placeholder="Your area/building" /></FG>
            <button onClick={saveProfile} disabled={saving} className="btn grd" style={{ color: '#fff', padding: '.75rem 1.8rem', fontSize: '.95rem' }}>{saving ? <span className="sp" /> : <><i className="fas fa-save" style={{ marginRight: '.4rem' }} />Save Changes</>}</button>
          </div>)}
        </div>
      </div>
    </div>
  )
}

function LoginModal({ show, onClose, setUser, toast, switchToRegister }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1); const [otp, setOtp] = useState('')
  const submit = async () => { if (!email || !password) { toast('Fill all fields', 'error'); return }; setLoading(true); const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const d = await r.json(); setLoading(false); if (r.ok) { if (d.requireOtp) { setStep(2); toast('OTP sent to email!'); return }; const me = await fetch('/api/auth/me').then(r => r.json()); setUser(me); toast('Welcome back! 👋'); onClose(); setEmail(''); setPassword(''); setStep(1) } else toast(d.error || 'Login failed', 'error') }
  const verifyOtp = async () => { if (!otp) { toast('Enter OTP', 'error'); return }; setLoading(true); const r = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp }) }); const d = await r.json(); setLoading(false); if (r.ok) { setUser(d.user); toast('Welcome back! 🎉'); onClose(); setEmail(''); setPassword(''); setOtp(''); setStep(1) } else toast(d.error || 'Verification failed', 'error') }
  return (<Modal show={show} onClose={() => { onClose(); setStep(1); setOtp('') }} title={step === 1 ? "👋 Welcome Back" : "🔐 Verify Code"}>
    {step === 1 ? (
      <>
        <FG label="Email"><input type="email" className="inp" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => e.key === 'Enter' && submit()} /></FG>
        <FG label="Password"><input type="password" className="inp" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} /></FG>
        <button onClick={submit} disabled={loading} className="btn grd" style={{ width: '100%', padding: '.9rem', color: '#fff', fontSize: '1rem' }}>{loading ? <span className="sp" /> : <><i className="fas fa-sign-in-alt" style={{ marginRight: '.5rem' }} />Sign In</>}</button>
        <p style={{ textAlign: 'center', marginTop: '.9rem', color: '#64748B', fontSize: '.88rem' }}>No account? <button onClick={switchToRegister} className="btn" style={{ background: 'none', color: P2, padding: 0, fontWeight: 700 }}>Sign Up</button></p>
      </>
    ) : (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '.9rem' }}>Enter the 6-digit code sent to <strong>{email}</strong></p>
        <FG label="Verification Code"><input type="text" className="inp" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '6px', fontWeight: 'bold' }} placeholder="------" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} onKeyDown={e => e.key === 'Enter' && verifyOtp()} /></FG>
        <button onClick={verifyOtp} disabled={loading || otp.length !== 6} className="btn grd" style={{ width: '100%', padding: '.9rem', color: '#fff', fontSize: '1rem' }}>{loading ? <span className="sp" /> : <><i className="fas fa-check-circle" style={{ marginRight: '.5rem' }} />Verify & Login</>}</button>
        <button onClick={() => setStep(1)} className="btn" style={{ marginTop: '1rem', background: 'none', color: '#64748B', fontSize: '.85rem' }}>Back to Login</button>
      </div>
    )}
  </Modal>)
}

function RegisterModal({ show, onClose, setUser, toast, switchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' }); const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1); const [otp, setOtp] = useState('')
  const submit = async () => { if (!form.name || !form.email || !form.password) { toast('Fill required fields', 'error'); return }; if (form.password.length < 6) { toast('Password min 6 chars', 'error'); return }; setLoading(true); const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); const d = await r.json(); setLoading(false); if (r.ok) { if (d.requireOtp) { setStep(2); toast('OTP sent to email!'); return }; const me = await fetch('/api/auth/me').then(r => r.json()); setUser(me); toast('Welcome to WearShare! 🎉'); onClose(); setForm({ name: '', email: '', phone: '', password: '' }); setStep(1) } else toast(d.error || 'Registration failed', 'error') }
  const verifyOtp = async () => { if (!otp) { toast('Enter OTP', 'error'); return }; setLoading(true); const r = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, otp }) }); const d = await r.json(); setLoading(false); if (r.ok) { setUser(d.user); toast('Welcome to WearShare! 🎉'); onClose(); setForm({ name: '', email: '', phone: '', password: '' }); setOtp(''); setStep(1) } else toast(d.error || 'Verification failed', 'error') }
  return (<Modal show={show} onClose={() => { onClose(); setStep(1); setOtp('') }} title={step === 1 ? "🌟 Create Account" : "🔐 Verify Code"}>
    {step === 1 ? (
      <>
        {[['name', 'Full Name *', 'text', 'Your full name'], ['email', 'Email *', 'email', 'you@example.com'], ['phone', 'Phone (WhatsApp)', 'text', '+91 XXXXX XXXXX'], ['password', 'Password *', 'password', 'Min 6 characters']].map(([k, l, t, ph]) => (<FG key={k} label={l}><input type={t} className="inp" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} onKeyDown={e => e.key === 'Enter' && submit()} /></FG>))}
        <button onClick={submit} disabled={loading} className="btn grd" style={{ width: '100%', padding: '.9rem', color: '#fff', fontSize: '1rem' }}>{loading ? <span className="sp" /> : <><i className="fas fa-user-plus" style={{ marginRight: '.5rem' }} />Create Account</>}</button>
        <p style={{ textAlign: 'center', marginTop: '.9rem', color: '#64748B', fontSize: '.88rem' }}>Have an account? <button onClick={switchToLogin} className="btn" style={{ background: 'none', color: P2, padding: 0, fontWeight: 700 }}>Sign In</button></p>
      </>
    ) : (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '.9rem' }}>Enter the 6-digit code sent to <strong>{form.email}</strong></p>
        <FG label="Verification Code"><input type="text" className="inp" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '6px', fontWeight: 'bold' }} placeholder="------" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} onKeyDown={e => e.key === 'Enter' && verifyOtp()} /></FG>
        <button onClick={verifyOtp} disabled={loading || otp.length !== 6} className="btn grd" style={{ width: '100%', padding: '.9rem', color: '#fff', fontSize: '1rem' }}>{loading ? <span className="sp" /> : <><i className="fas fa-check-circle" style={{ marginRight: '.5rem' }} />Verify Account</>}</button>
        <button onClick={() => setStep(1)} className="btn" style={{ marginTop: '1rem', background: 'none', color: '#64748B', fontSize: '.85rem' }}>Back to Registration</button>
      </div>
    )}
  </Modal>)
}

function CreateListingModal({ show, onClose, toast, user }) {
  const [form, setForm] = useState({ name: '', brand: '', category: 'dress', size: 'M', condition: 'excellent', description: '', rentalPricePerDay: '', securityDeposit: '', availableFrom: '' }); const [imageData, setImageData] = useState(''); const [loading, setLoading] = useState(false); const [dragOver, setDragOver] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleImage = (file) => { if (!file) return; if (file.size > 2 * 1024 * 1024) { toast('Max 2MB', 'error'); return }; const reader = new FileReader(); reader.onload = (e) => setImageData(e.target.result); reader.readAsDataURL(file) }
  const submit = async () => { if (!user) { toast('Login first', 'error'); return }; if (!form.name || !form.rentalPricePerDay || !form.securityDeposit) { toast('Fill required fields', 'error'); return }; setLoading(true); const r = await fetch('/api/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, rentalPricePerDay: Number(form.rentalPricePerDay), securityDeposit: Number(form.securityDeposit), imageData }) }); setLoading(false); if (r.ok) { toast('Listing created! 🎊'); onClose(); setForm({ name: '', brand: '', category: 'dress', size: 'M', condition: 'excellent', description: '', rentalPricePerDay: '', securityDeposit: '', availableFrom: '' }); setImageData('') } else { const d = await r.json(); toast(d.error || 'Failed', 'error') } }
  return (<Modal show={show} onClose={onClose} title="✨ Create Listing" wide>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem' }}>
      <FG label="Item Name *"><input className="inp" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Blue Silk Saree" /></FG>
      <FG label="Brand"><input className="inp" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Fabindia" /></FG>
      <FG label="Category"><select className="inp" value={form.category} onChange={e => set('category', e.target.value)}>{['dress', 'suit', 'jacket', 'saree', 'lehenga', 'kurta', 'shoes', 'accessories'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></FG>
      <FG label="Size"><select className="inp" value={form.size} onChange={e => set('size', e.target.value)}>{['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s}>{s}</option>)}</select></FG>
      <FG label="Condition"><select className="inp" value={form.condition} onChange={e => set('condition', e.target.value)}>{[['new', 'New'], ['excellent', 'Excellent'], ['good', 'Good'], ['fair', 'Fair']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></FG>
      <FG label="Price/Day (₹) *"><input className="inp" type="number" value={form.rentalPricePerDay} onChange={e => set('rentalPricePerDay', e.target.value)} placeholder="500" min="50" /></FG>
      <FG label="Deposit (₹) *"><input className="inp" type="number" value={form.securityDeposit} onChange={e => set('securityDeposit', e.target.value)} placeholder="2000" min="100" /></FG>
      <FG label="Available From"><input className="inp" type="date" value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} min={new Date().toISOString().split('T')[0]} /></FG>
    </div>
    <FG label="Description"><textarea className="inp" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe your item..." /></FG>
    <FG label="📸 Upload Photo">
      <div className={`upload-zone ${dragOver ? 'drag' : ''}`} onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleImage(e.dataTransfer.files[0]) }}>
        {imageData ? (<div style={{ position: 'relative' }}><img src={imageData} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} /><button onClick={e => { e.stopPropagation(); setImageData('') }} className="btn" style={{ position: 'absolute', top: '.4rem', right: '.4rem', background: 'rgba(0,0,0,.6)', color: '#fff', padding: '.3rem .5rem', fontSize: '.75rem' }}>✕</button></div>) : (<label style={{ cursor: 'pointer', display: 'block' }}><i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: P2, display: 'block', marginBottom: '.5rem' }} /><p style={{ fontWeight: 600, color: '#CBD5E1', marginBottom: '.2rem' }}>Drop photo or click to upload</p><p style={{ color: '#64748B', fontSize: '.8rem' }}>Max 2MB · JPG, PNG, WebP</p><input type="file" accept="image/*" onChange={e => handleImage(e.target.files[0])} style={{ display: 'none' }} /></label>)}
      </div>
    </FG>
    <button onClick={submit} disabled={loading} className="btn grd" style={{ width: '100%', padding: '.9rem', color: '#fff', fontSize: '1rem' }}>{loading ? <span className="sp" /> : <><i className="fas fa-plus" style={{ marginRight: '.5rem' }} />Create Listing</>}</button>
  </Modal>)
}

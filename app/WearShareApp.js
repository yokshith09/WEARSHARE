'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  p: '#E91E8C', p2: '#FF4DB8', p3: '#6B21A8',
  dark: '#0a0a0a', dark2: '#111111', dark3: '#1a1a1a',
  card: '#1c1c1e', border: 'rgba(255,255,255,.08)',
  text: '#F5F5F5', muted: '#9A9A9A', sub: '#555',
  green: '#22C55E', red: '#EF4444', gold: '#F59E0B',
  rent: '#7C3AED', buy: '#E91E8C',
  gradR: 'linear-gradient(135deg,#7C3AED,#A855F7)',
  gradB: 'linear-gradient(135deg,#E91E8C,#FF4DB8)',
  gradH: 'linear-gradient(135deg,#E91E8C,#7C3AED)',
}

// ─── Global CSS ──────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:${C.dark};color:${C.text};font-family:'Inter',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:${C.dark2}}
::-webkit-scrollbar-thumb{background:${C.p3};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes slideDown{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}
.fu{animation:fadeUp .4s ease forwards}
.fi{animation:fadeIn .3s ease forwards}
.btn{border:none;cursor:pointer;font-weight:600;transition:all .2s;font-family:inherit}
.btn:hover{filter:brightness(1.12)}
.btn:active{transform:scale(.97)}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.inp{width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:8px;font-size:.9rem;font-family:inherit;color:${C.text};outline:none;transition:all .2s}
.inp:focus{border-color:${C.p};box-shadow:0 0 0 3px rgba(233,30,140,.12)}
.inp::placeholder{color:rgba(255,255,255,.2)}
select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23F5F5F5' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center}
textarea.inp{resize:vertical;min-height:80px}
.card{background:${C.card};border-radius:12px;border:1px solid ${C.border};transition:all .25s}
.card:hover{border-color:rgba(233,30,140,.3);box-shadow:0 8px 25px rgba(0,0,0,.3)}
.pill{display:inline-flex;align-items:center;padding:.3rem .8rem;border-radius:20px;font-size:.78rem;font-weight:700;letter-spacing:.3px}
.tag-rent{background:rgba(124,58,237,.15);color:#A78BFA;border:1px solid rgba(124,58,237,.25)}
.tag-buy{background:rgba(233,30,140,.15);color:#F472B6;border:1px solid rgba(233,30,140,.25)}
.tag-new{background:rgba(34,197,94,.15);color:#4ADE80;border:1px solid rgba(34,197,94,.25)}
.sp{width:20px;height:20px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:999;backdrop-filter:blur(8px)}
.upload-zone{border:2px dashed rgba(255,255,255,.12);border-radius:10px;padding:2rem;text-align:center;cursor:pointer;transition:all .3s}
.upload-zone:hover,.upload-zone.drag{border-color:${C.p};background:rgba(233,30,140,.04)}
.hscroll{display:flex;gap:1rem;overflow-x:auto;padding-bottom:.75rem;-ms-overflow-style:none;scrollbar-width:none}
.hscroll::-webkit-scrollbar{display:none}
.cat-chip{display:inline-flex;flex-direction:column;align-items:center;gap:.5rem;padding:1rem;min-width:90px;border-radius:12px;cursor:pointer;border:1.5px solid transparent;transition:all .2s;background:${C.dark3};font-size:.78rem;font-weight:600;color:${C.muted}}
.cat-chip:hover,.cat-chip.active{border-color:${C.p};color:${C.p};background:rgba(233,30,140,.06)}
.product-card{background:${C.card};border-radius:12px;border:1px solid ${C.border};overflow:hidden;transition:all .3s;cursor:pointer;position:relative}
.product-card:hover{transform:translateY(-4px);box-shadow:0 12px 35px rgba(0,0,0,.4);border-color:rgba(233,30,140,.2)}
.product-card:hover .quick-actions{opacity:1;transform:translateY(0)}
.quick-actions{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 100%);padding:1rem .75rem .75rem;display:flex;gap:.5rem;opacity:0;transform:translateY(10px);transition:all .3s}
.badge-rent{background:${C.gradR};color:#fff}
.badge-buy{background:${C.gradB};color:#fff}
.wishlist-btn{position:absolute;top:.65rem;right:.65rem;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:2}
.wishlist-btn:hover,.wishlist-btn.active{background:rgba(233,30,140,.9);border-color:${C.p}}
.nav-dropdown{position:absolute;top:100%;left:0;background:${C.dark2};border:1px solid ${C.border};border-radius:12px;padding:1.25rem;min-width:240px;z-index:600;animation:slideDown .2s ease;box-shadow:0 20px 40px rgba(0,0,0,.5)}
.tab-btn{padding:.55rem 1.25rem;border-radius:8px;font-size:.85rem;font-weight:700;cursor:pointer;border:none;transition:all .2s;font-family:inherit}
.tab-active{background:${C.gradH};color:#fff}
.tab-inactive{background:transparent;color:${C.muted}}
.tab-inactive:hover{color:${C.text};background:rgba(255,255,255,.05)}
.sidebar-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;cursor:pointer;border:none;font-family:inherit;font-size:.9rem;font-weight:600;transition:all .2s;width:100%;text-align:left}
.sidebar-active{background:${C.gradH};color:#fff}
.sidebar-inactive{background:transparent;color:${C.muted}}
.sidebar-inactive:hover{background:rgba(255,255,255,.05);color:${C.text}}
.hero-slide{position:absolute;inset:0;transition:opacity .6s ease,transform .6s ease}
.page-enter{animation:fadeUp .35s ease forwards}
@media(max-width:768px){
  .desktop-only{display:none!important}
  .mobile-menu{display:flex!important}
}
@media(min-width:769px){.mobile-menu{display:none!important}}
`

// ─── Utilities ───────────────────────────────────────────────────────────────
function getImg(l) { return l?.imageData || l?.imageUrl || '' }
function formatPrice(n) { return '₹' + Number(n).toLocaleString('en-IN') }

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '.5rem', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding: '.85rem 1.25rem', borderRadius: '10px', animation: 'slideR .3s ease', display: 'flex', alignItems: 'center', gap: '.6rem', background: C.dark2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${t.type === 'success' ? C.green : C.red}`, boxShadow: '0 8px 24px rgba(0,0,0,.4)', minWidth: 260 }}>
          <i className={`fas fa-${t.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ color: t.type === 'success' ? C.green : C.red }} />
          <span style={{ fontSize: '.88rem', fontWeight: 500 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ size = 32 }) {
  return <div className="sp" style={{ width: size, height: size }} />
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function Modal({ show, onClose, title, children, wide, maxW }) {
  if (!show) return null
  return (
    <div className="overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.dark2, borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: maxW || (wide ? 740 : 480), maxHeight: '92vh', overflowY: 'auto', border: `1px solid ${C.border}`, animation: 'fadeUp .3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,.06)', color: C.muted, padding: '.3rem .65rem', borderRadius: '8px', fontSize: '1.1rem' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Field Group ─────────────────────────────────────────────────────────────
function FG({ label, children, half }) {
  return (
    <div style={{ marginBottom: '1rem', flex: half ? '1 1 calc(50% - .5rem)' : '1 1 100%', minWidth: 0 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '.35rem', fontSize: '.8rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</label>
      {children}
    </div>
  )
}

export default function WearShareApp() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [toasts, setToasts] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exploreFilters, setExploreFilters] = useState({})

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const refreshCart = useCallback(async () => {
    if (!user) return setCartCount(0)
    try { const r = await fetch('/api/cart'); if (r.ok) { const d = await r.json(); setCartCount(d.items?.length || 0) } } catch { }
  }, [user])

  const refreshWishlist = useCallback(async () => {
    if (!user) return setWishlistIds(new Set())
    try { const r = await fetch('/api/wishlist'); if (r.ok) { const d = await r.json(); setWishlistIds(new Set(d.wishlist.map(i => i._id || i))) } } catch { }
  }, [user])

  const toggleWishlist = async (listingId) => {
    if (!user) { setShowLogin(true); return }
    const has = wishlistIds.has(listingId)
    try {
      if (has) { await fetch('/api/wishlist?listingId=' + listingId, { method: 'DELETE' }); setWishlistIds(s => { const n = new Set(s); n.delete(listingId); return n }); toast('Removed from wishlist') }
      else { await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId }) }); setWishlistIds(s => new Set([...s, listingId])); toast('Added to wishlist ❤️') }
    } catch { toast('Failed', 'error') }
  }

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(u => { setUser(u); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { refreshCart(); refreshWishlist() }, [refreshCart, refreshWishlist])

  const logout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    setUser(null); setCartCount(0); setWishlistIds(new Set()); setPage('home'); toast('Logged out ✌️')
  }

  const navigate = (p, filters = {}) => { setPage(p); setExploreFilters(filters); setMobileMenuOpen(false) }

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.dark, flexDirection: 'column', gap: '1rem' }}>
        <Spinner size={44} />
        <p style={{ color: C.muted, fontWeight: 600, letterSpacing: '1px', fontSize: '.9rem' }}>Loading WearShare...</p>
      </div>
    </>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Toast toasts={toasts} />
      <AppHeader user={user} page={page} navigate={navigate} cartCount={cartCount} wishlistCount={wishlistIds.size} logout={logout} onLogin={() => setShowLogin(true)} onRegister={() => setShowRegister(true)} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main style={{ minHeight: 'calc(100vh - 56px)', paddingTop: '56px' }}>
        {page === 'home' && <HomePage navigate={navigate} user={user} />}
        {page === 'explore' && <ExplorePage user={user} toast={toast} refreshCart={refreshCart} onLogin={() => setShowLogin(true)} filters={exploreFilters} setFilters={setExploreFilters} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} navigate={navigate} />}
        {page === 'cart' && <CartPage user={user} toast={toast} refreshCart={refreshCart} navigate={navigate} />}
        {page === 'wishlist' && <WishlistPage user={user} toast={toast} refreshCart={refreshCart} onLogin={() => setShowLogin(true)} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} />}
        {page === 'dashboard' && user && <DashboardPage user={user} setUser={setUser} toast={toast} onCreateListing={() => setShowCreateListing(true)} navigate={navigate} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} refreshCart={refreshCart} />}
      </main>
      <AppFooter navigate={navigate} />
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} setUser={setUser} toast={toast} switchToRegister={() => { setShowLogin(false); setShowRegister(true) }} refreshCart={refreshCart} refreshWishlist={refreshWishlist} />
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} setUser={setUser} toast={toast} switchToLogin={() => { setShowRegister(false); setShowLogin(true) }} />
      <CreateListingModal show={showCreateListing} onClose={() => setShowCreateListing(false)} toast={toast} user={user} />
    </>
  )
}

// ─── App Header ──────────────────────────────────────────────────────────────
function AppHeader({ user, page, navigate, cartCount, wishlistCount, logout, onLogin, onRegister, mobileMenuOpen, setMobileMenuOpen }) {
  const [activeNav, setActiveNav] = useState(null)
  const navItems = [
    { label: 'MEN', key: 'men', cats: ['Shirts', 'T-Shirts', 'Jeans', 'Suits', 'Kurtas', 'Footwear', 'Accessories'] },
    { label: 'WOMEN', key: 'women', cats: ['Dresses', 'Sarees', 'Lehengas', 'Tops', 'Kurtis', 'Footwear', 'Accessories'] },
    { label: 'KIDS', key: 'kids', cats: ['Boys', 'Girls', 'Infant', 'Footwear', 'Accessories'] },
    { label: 'FOOTWEAR', key: 'footwear', cats: ['Sneakers', 'Heels', 'Boots', 'Sandals', 'Formal'] },
    { label: 'ACCESSORIES', key: 'accessories', cats: ['Bags', 'Jewellery', 'Belts', 'Scarves', 'Watches'] },
  ]
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#000', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 1.5rem', height: 56 }}>
        <div onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', cursor: 'pointer', marginRight: '2rem', flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: '7px', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className='fas fa-shirt' style={{ color: '#fff', fontSize: '.8rem' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>WearShare</span>
        </div>
        <nav className='desktop-only' style={{ display: 'flex', alignItems: 'stretch', flex: 1, height: 56 }}>
          {navItems.map(nav => (
            <div key={nav.key} style={{ position: 'relative' }} onMouseEnter={() => setActiveNav(nav.key)} onMouseLeave={() => setActiveNav(null)}>
              <button className='btn' onClick={() => navigate('explore', { gender: nav.key })} style={{ height: '100%', padding: '0 1rem', background: 'transparent', color: activeNav === nav.key ? '#fff' : 'rgba(255,255,255,.6)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.8px', borderBottom: activeNav === nav.key ? '2px solid #E91E8C' : '2px solid transparent', borderRadius: 0 }}>
                {nav.label}
              </button>
              {activeNav === nav.key && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#111', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', padding: '1.25rem', minWidth: 200, zIndex: 600, boxShadow: '0 20px 40px rgba(0,0,0,.6)', animation: 'slideDown .2s ease' }}>
                  <div style={{ fontSize: '.7rem', color: '#E91E8C', fontWeight: 800, letterSpacing: '1px', marginBottom: '.75rem' }}>{nav.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.3rem', marginBottom: '1rem' }}>
                    {nav.cats.map(c => (
                      <button key={c} className='btn' onClick={() => navigate('explore', { gender: nav.key, category: c.toLowerCase() })} style={{ background: 'transparent', color: 'rgba(255,255,255,.65)', fontSize: '.83rem', padding: '.4rem .5rem', textAlign: 'left', borderRadius: '6px', fontWeight: 500, transition: 'color .15s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,.65)'}>{c}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '.4rem', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '.8rem' }}>
                    <button className='btn' onClick={() => navigate('explore', { gender: nav.key, listingType: 'buy' })} style={{ flex: 1, background: 'rgba(233,30,140,.1)', color: '#F472B6', padding: '.45rem', borderRadius: '6px', fontSize: '.75rem', fontWeight: 700 }}>Shop</button>
                    <button className='btn' onClick={() => navigate('explore', { gender: nav.key, listingType: 'rent' })} style={{ flex: 1, background: 'rgba(124,58,237,.1)', color: '#A78BFA', padding: '.45rem', borderRadius: '6px', fontSize: '.75rem', fontWeight: 700 }}>Rent</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem', marginLeft: 'auto' }}>
          <button className='btn desktop-only' onClick={() => navigate('explore', { listingType: 'rent' })} style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', padding: '.4rem .9rem', borderRadius: '6px', fontSize: '.72rem', fontWeight: 800, marginRight: '.5rem' }}>
            <i className='fas fa-gem' style={{ marginRight: '.3rem', fontSize: '.65rem' }} />RENT NOW
          </button>
          {user && <>
            <button className='btn' onClick={() => navigate('wishlist')} style={{ background: 'transparent', color: wishlistCount > 0 ? '#E91E8C' : 'rgba(255,255,255,.5)', padding: '.5rem', position: 'relative', fontSize: '1.05rem' }}>
              <i className={`fa${wishlistCount > 0 ? 's' : 'r'} fa-heart`} />
              {wishlistCount > 0 && <span style={{ position: 'absolute', top: -2, right: -3, background: '#E91E8C', color: '#fff', borderRadius: '50%', width: 15, height: 15, fontSize: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{wishlistCount}</span>}
            </button>
            <button className='btn' onClick={() => navigate('cart')} style={{ background: 'transparent', color: cartCount > 0 ? '#fff' : 'rgba(255,255,255,.5)', padding: '.5rem', position: 'relative', fontSize: '1.05rem' }}>
              <i className='fas fa-shopping-bag' />
              {cartCount > 0 && <span style={{ position: 'absolute', top: -2, right: -3, background: '#E91E8C', color: '#fff', borderRadius: '50%', width: 15, height: 15, fontSize: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{cartCount}</span>}
            </button>
          </>}
          {!user ? (
            <div className='desktop-only' style={{ display: 'flex', gap: '.35rem', marginLeft: '.35rem' }}>
              <button onClick={onLogin} className='btn' style={{ padding: '.42rem .9rem', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.8)', background: 'transparent', fontSize: '.8rem', borderRadius: '7px' }}>Login</button>
              <button onClick={onRegister} className='btn' style={{ padding: '.42rem .9rem', background: '#E91E8C', color: '#fff', fontSize: '.8rem', borderRadius: '7px' }}>Sign Up</button>
            </div>
          ) : (
            <button onClick={() => navigate('dashboard')} className='btn' style={{ background: 'transparent', padding: '.3rem', marginLeft: '.2rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 800, color: '#fff' }}>{user.name?.[0]?.toUpperCase()}</div>
            </button>
          )}
          <button className='btn' onClick={() => setMobileMenuOpen(o => !o)} style={{ background: 'transparent', color: '#fff', padding: '.5rem', fontSize: '1.1rem', display: 'none' }} onMouseOver={function () { }} id='mobile-menu-btn'><i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`} /></button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,.06)', padding: '1rem 1.5rem', display: 'none' }} id='mobile-menu'>
          {navItems.map(n => (<button key={n.key} className='btn' onClick={() => navigate('explore', { gender: n.key })} style={{ display: 'block', width: '100%', background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '.65rem', textAlign: 'left', borderRadius: '8px', fontSize: '.9rem', fontWeight: 600, marginBottom: '.25rem' }}>{n.label}</button>))}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.06)', margin: '.5rem 0' }} />
          {user ? (
            <>
              <button className='btn' onClick={() => navigate('cart')} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,.05)', color: '#fff', padding: '.65rem', textAlign: 'left', borderRadius: '8px', fontSize: '.9rem', marginBottom: '.35rem' }}><i className='fas fa-shopping-bag' style={{ marginRight: '.5rem' }} />Cart ({cartCount})</button>
              <button className='btn' onClick={() => navigate('wishlist')} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,.05)', color: '#E91E8C', padding: '.65rem', textAlign: 'left', borderRadius: '8px', fontSize: '.9rem', marginBottom: '.35rem' }}><i className='fas fa-heart' style={{ marginRight: '.5rem' }} />Wishlist ({wishlistCount})</button>
              <button className='btn' onClick={logout} style={{ display: 'block', width: '100%', background: 'rgba(239,68,68,.1)', color: '#EF4444', padding: '.65rem', textAlign: 'left', borderRadius: '8px', fontSize: '.9rem' }}><i className='fas fa-sign-out-alt' style={{ marginRight: '.5rem' }} />Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button onClick={onLogin} className='btn' style={{ flex: 1, padding: '.65rem', border: '1px solid rgba(255,255,255,.2)', color: '#fff', background: 'transparent', borderRadius: '8px' }}>Login</button>
              <button onClick={onRegister} className='btn' style={{ flex: 1, padding: '.65rem', background: '#E91E8C', color: '#fff', borderRadius: '8px' }}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Explore Page ─────────────────────────────────────────────────────────────
function ExplorePage({ user, toast, refreshCart, onLogin, filters, setFilters, wishlistIds, toggleWishlist, navigate }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(filters?.search || '')
  const [activeType, setActiveType] = useState(filters?.listingType || 'all')
  const [gender, setGender] = useState(filters?.gender || '')
  const [selectedListing, setSelectedListing] = useState(null)
  const [size, setSize] = useState('')

  const loadListings = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (activeType !== 'all') p.set('listingType', activeType)
    if (gender && !['footwear', 'accessories', 'ethnic'].includes(gender)) p.set('gender', gender)
    if (size) p.set('size', size)
    try {
      const r = await fetch('/api/listings?' + p)
      const d = await r.json()
      let all = Array.isArray(d) ? d : []
      if (gender && ['footwear', 'accessories', 'ethnic'].includes(gender)) all = all.filter(l => (l.subcategory || l.category || '').toLowerCase().includes(gender.replace('ethnic', 'kurta')))
      if (search) all = all.filter(l => (l.name + l.brand + l.description + l.category).toLowerCase().includes(search.toLowerCase()))
      setListings(all)
    } catch { setListings([]) }
    setLoading(false)
  }, [search, activeType, gender, size])

  useEffect(() => {
    if (filters?.focusId) {
      fetch('/api/listings').then(r => r.ok ? r.json() : []).then(d => {
        if (Array.isArray(d)) { const found = d.find(l => l._id === filters.focusId); if (found) setSelectedListing(found); setListings(d) }
        setLoading(false)
      }).catch(() => setLoading(false))
    } else { loadListings() }
  }, [activeType, gender, size])

  const addToCart = async (listing) => {
    if (!user) { onLogin(); return }
    const r = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId: listing._id, days: 1 }) })
    if (r.ok) { toast('Added to cart 🛒'); refreshCart() } else toast('Could not add item', 'error')
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className='fas fa-search' style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input className='inp' value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadListings()} placeholder='Search styles, brands, sizes...' style={{ paddingLeft: '2.75rem', background: '#1c1c1e', border: '1px solid rgba(255,255,255,.08)' }} />
        </div>
        <button onClick={loadListings} className='btn' style={{ background: '#E91E8C', color: '#fff', padding: '.75rem 1.5rem', borderRadius: '8px', fontWeight: 700 }}>Search</button>
      </div>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[{ k: 'all', l: 'All' }, { k: 'rent', l: '🏠 Rentals' }, { k: 'buy', l: '🛍️ Buy' }].map(t => (
          <button key={t.k} onClick={() => setActiveType(t.k)} className='btn' style={{ padding: '.5rem 1.1rem', borderRadius: '8px', fontSize: '.85rem', fontWeight: 700, ...(activeType === t.k ? { background: '#E91E8C', color: '#fff' } : { background: '#1c1c1e', color: '#9A9A9A', border: '1px solid rgba(255,255,255,.07)' }) }}>
            {t.l}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select className='inp' value={size} onChange={e => setSize(e.target.value)} style={{ width: 105, background: '#1c1c1e', border: '1px solid rgba(255,255,255,.08)' }}>
          <option value=''>All Sizes</option>
          {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className='hscroll' style={{ gap: '.45rem', marginBottom: '1.25rem' }}>
        {['all', 'men', 'women', 'kids', 'footwear', 'accessories', 'ethnic'].map(g => (
          <button key={g} onClick={() => setGender(g === 'all' ? '' : g)} className='btn' style={{ padding: '.4rem 1rem', borderRadius: '20px', fontSize: '.78rem', fontWeight: 700, whiteSpace: 'nowrap', ...((gender === g || (g === 'all' && !gender)) ? { background: '#E91E8C', color: '#fff' } : { background: '#1c1c1e', color: '#9A9A9A', border: '1px solid rgba(255,255,255,.07)' }) }}>
            {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>
      {!loading && <p style={{ color: '#555', fontSize: '.82rem', marginBottom: '1.25rem' }}>{listings.length} items found</p>}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
          {Array(12).fill(0).map((_, i) => <div key={i} style={{ height: 360, borderRadius: '12px', background: 'linear-gradient(90deg,#1c1c1e,#242424,#1c1c1e)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />)}
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#555' }}>
          <i className='fas fa-search' style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: '#2a2a2a' }} />
          <h3 style={{ color: '#9A9A9A', marginBottom: '.5rem' }}>No items found</h3>
          <button onClick={() => { setSearch(''); setGender(''); setActiveType('all'); loadListings() }} className='btn' style={{ background: '#E91E8C', color: '#fff', padding: '.65rem 1.4rem', borderRadius: '8px', marginTop: '.75rem', fontWeight: 700 }}>Clear Filters</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
          {listings.map(l => (
            <PCard key={l._id} listing={l} onAdd={() => addToCart(l)} onDetail={() => setSelectedListing(l)} wishlisted={wishlistIds.has(l._id)} onWish={() => toggleWishlist(l._id)} />
          ))}
        </div>
      )}
      {selectedListing && <DetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} addToCart={addToCart} wishlisted={wishlistIds.has(selectedListing._id)} onWish={() => toggleWishlist(selectedListing._id)} />}
    </div>
  )
}

function PCard({ listing, onAdd, onDetail, wishlisted, onWish }) {
  const img = getImg(listing); const isR = listing.listingType !== 'buy'
  return (
    <div className='product-card' onClick={onDetail}>
      <div style={{ height: 270, background: 'linear-gradient(135deg,#1a0533,#2d0b6e)', position: 'relative' }}>
        {img && <img src={img} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
        {!img && <i className='fas fa-shirt' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '3rem', color: 'rgba(255,255,255,.07)' }} />}
        <span className='pill' style={{ position: 'absolute', top: '.6rem', left: '.6rem', fontSize: '.62rem', background: isR ? 'rgba(124,58,237,.9)' : 'rgba(233,30,140,.9)', color: '#fff' }}>{isR ? 'RENT' : 'BUY'}</span>
        <button className='wishlist-btn' onClick={e => { e.stopPropagation(); onWish() }} style={{ ...(wishlisted ? { background: '#E91E8C', borderColor: '#E91E8C' } : {}) }}>
          <i className={`fa${wishlisted ? 's' : 'r'} fa-heart`} style={{ fontSize: '.75rem', color: wishlisted ? '#fff' : '#aaa' }} />
        </button>
        <div className='quick-actions' onClick={e => e.stopPropagation()}>
          <button onClick={onDetail} className='btn' style={{ flex: 1, padding: '.45rem', background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: '6px', fontSize: '.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,.1)' }}>Details</button>
          <button onClick={onAdd} className='btn' style={{ flex: 1, padding: '.45rem', background: isR ? '#7C3AED' : '#E91E8C', color: '#fff', borderRadius: '6px', fontSize: '.75rem', fontWeight: 700 }}><i className='fas fa-cart-plus' style={{ marginRight: '.25rem' }} />{isR ? 'Rent' : 'Buy'}</button>
        </div>
      </div>
      <div style={{ padding: '.85rem' }}>
        <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '.1rem' }}>{listing.name}</div>
        <div style={{ color: '#444', fontSize: '.75rem', marginBottom: '.55rem' }}>{listing.brand || 'WearShare'} · {listing.size}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 900, fontSize: '.95rem', color: isR ? '#A78BFA' : '#F472B6' }}>{isR ? formatPrice(listing.rentalPricePerDay) + '/day' : formatPrice(listing.buyPrice)}</span>
          {listing.condition && <span className='pill' style={{ fontSize: '.62rem', background: 'rgba(34,197,94,.08)', color: '#4ADE80', border: '1px solid rgba(34,197,94,.12)' }}>{listing.condition}</span>}
        </div>
      </div>
    </div>
  )
}

function DetailModal({ listing, onClose, addToCart, wishlisted, onWish }) {
  const img = getImg(listing); const isR = listing.listingType !== 'buy'
  return (
    <Modal show={true} onClose={onClose} title={listing.name} wide>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ height: 320, background: 'linear-gradient(135deg,#1a0533,#2d0b6e)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
            {img ? <img src={img} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className='fas fa-shirt' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '4rem', color: 'rgba(255,255,255,.12)' }} />}
          </div>
          <p style={{ color: '#9A9A9A', lineHeight: 1.65, fontSize: '.88rem' }}>{listing.description || 'Premium quality item shared by our community.'}</p>
        </div>
        <div>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
            <span className={pill}>{isR ? '🏠 FOR RENT' : '🛍️ FOR SALE'}</span>
            {listing.gender && <span className='pill' style={{ background: 'rgba(255,255,255,.05)', color: '#555', border: '1px solid rgba(255,255,255,.07)', fontSize: '.7rem' }}>{listing.gender.toUpperCase()}</span>}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: isR ? '#A78BFA' : '#F472B6', marginBottom: '.25rem' }}>{isR ? formatPrice(listing.rentalPricePerDay) : formatPrice(listing.buyPrice)}</div>
          <p style={{ color: '#555', fontSize: '.82rem', marginBottom: '1.5rem' }}>{isR ? `per day · Deposit: ${formatPrice(listing.securityDeposit)}` : 'One-time purchase'}</p>
          {[['Brand', listing.brand || '-'], ['Size', listing.size], ['Condition', listing.condition], ['Category', listing.category], ['Listed by', listing.ownerName || 'Community']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.55rem 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <span style={{ color: '#555', fontSize: '.82rem' }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: '.82rem', color: '#E2E8F0' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '.65rem', marginTop: '1.5rem' }}>
            <button onClick={onWish} className='btn' style={{ width: 42, height: 42, borderRadius: '8px', border: wishlisted ? 'none' : '1px solid rgba(255,255,255,.1)', background: wishlisted ? 'rgba(233,30,140,.15)' : 'transparent', color: wishlisted ? '#E91E8C' : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fa${wishlisted ? 's' : 'r'} fa-heart`} />
            </button>
            <button onClick={() => { addToCart(listing); onClose() }} className='btn' style={{ flex: 1, height: 42, background: isR ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'linear-gradient(135deg,#E91E8C,#FF4DB8)', color: '#fff', borderRadius: '8px', fontWeight: 800, fontSize: '.95rem' }}>
              <i className='fas fa-shopping-cart' style={{ marginRight: '.5rem' }} />{isR ? 'Add to Rentals' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Cart Page (Full Page, 3-step) ───────────────────────────────────────────
function CartPage({ user, toast, refreshCart, navigate }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ rentalStart: '', delivery: '', returnD: '', pickup: '', collect: '' })
  const [paying, setPaying] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    const r = await fetch('/api/cart')
    if (r.ok) { const d = await r.json(); setItems(d.items || []) }
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const removeItem = async (id) => { await fetch('/api/cart?listingId=' + id, { method: 'DELETE' }); await load(); refreshCart() }
  const updateDays = async (id, days) => { await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId: id, days: Number(days) }) }); await load() }

  const sub = items.reduce((s, i) => s + (i.listingType === 'buy' ? (i.buyPrice || i.rentalPricePerDay) : i.rentalPricePerDay * i.days), 0)
  const dep = items.filter(i => i.listingType !== 'buy').reduce((s, i) => s + i.securityDeposit, 0)
  const fee = Math.round((sub + dep) * 0.05)
  const total = sub + dep + fee

  const pay = async () => {
    setPaying(true)
    try {
      const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rentalStart: form.rentalStart }) })
      const d = await r.json()
      if (!d.orderId) { toast(d.error || 'Checkout failed', 'error'); setPaying(false); return }
      const go = (data) => {
        const rzp = new window.Razorpay({
          key: data.keyId, amount: data.amount, currency: data.currency, name: 'WearShare', order_id: data.orderId, theme: { color: '#E91E8C' },
          handler: async (res) => {
            const cr = await fetch('/api/checkout/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: res.razorpay_payment_id, orderId: res.razorpay_order_id, signature: res.razorpay_signature, rentalStart: form.rentalStart, deliveryDetails: form.delivery, returnDetails: form.returnD, pickupDetails: form.pickup, collectDetails: form.collect }) })
            if (cr.ok) { toast('Payment successful! 🎉'); refreshCart(); setItems([]); navigate('dashboard') } else toast('Verification failed', 'error')
            setPaying(false)
          }, modal: { ondismiss: () => setPaying(false) }
        }); rzp.open()
      }
      if (window.Razorpay) go(d)
      else { const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = () => go(d); s.onerror = () => { toast('Load failed', 'error'); setPaying(false) }; document.body.appendChild(s) }
    } catch (e) { toast(e.message, 'error'); setPaying(false) }
  }

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <i className='fas fa-shopping-bag' style={{ fontSize: '3rem', color: '#1c1c1e' }} />
      <h2 style={{ color: '#9A9A9A' }}>Login to view your cart</h2>
    </div>
  )

  const steps = ['Your Bag', 'Delivery Info', 'Review & Pay']
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ fontWeight: 900, fontSize: '1.7rem', marginBottom: '.3rem' }}>Shopping Bag</h1>
      <p style={{ color: '#555', marginBottom: '2rem', fontSize: '.88rem' }}>{items.length} item{items.length !== 1 ? 's' : ''} in your bag</p>
      {/* Steps indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2.5rem', overflowX: 'auto' }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', cursor: i + 1 < step ? 'pointer' : 'default' }} onClick={() => i + 1 < step && setStep(i + 1)}>
              <div style={{ width: 27, height: 27, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.78rem', background: step > i + 1 ? '#22C55E' : step === i + 1 ? '#E91E8C' : '#1c1c1e', color: step >= i + 1 ? '#fff' : '#555', border: step === i + 1 ? 'none' : '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontWeight: 700, fontSize: '.85rem', color: step === i + 1 ? '#fff' : step > i + 1 ? '#22C55E' : '#555', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: '0 0 36px', height: 1, background: step > i + 1 ? '#22C55E' : 'rgba(255,255,255,.07)', margin: '0 .65rem', flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={44} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          <div>
            {step === 1 && (
              <>
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
                    <h2 style={{ fontWeight: 900, marginBottom: '.75rem' }}>Your bag is empty</h2>
                    <button onClick={() => navigate('explore')} className='btn' style={{ background: '#E91E8C', color: '#fff', padding: '.9rem 2rem', borderRadius: '8px', fontWeight: 800, marginTop: '.5rem' }}>Start Shopping</button>
                  </div>
                ) : (
                  <>
                    {items.map(item => {
                      const isR = item.listingType !== 'buy'
                      return (
                        <div key={item.listingId} style={{ display: 'flex', gap: '1.1rem', padding: '1.1rem', background: '#1c1c1e', borderRadius: '14px', marginBottom: '.85rem', border: '1px solid rgba(255,255,255,.05)', alignItems: 'flex-start' }}>
                          <div style={{ width: 80, height: 100, borderRadius: '10px', overflow: 'hidden', background: 'linear-gradient(135deg,#1a0533,#2d0b6e)', flexShrink: 0 }}>
                            {(item.imageData || item.imageUrl) && <img src={item.imageData || item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem' }}>
                              <div style={{ fontWeight: 800, fontSize: '.95rem', color: '#F5F5F5', paddingRight: '.5rem' }}>{item.name}</div>
                              <button onClick={() => removeItem(item.listingId)} className='btn' style={{ background: 'transparent', color: '#444', padding: '.15rem .35rem', fontSize: '.85rem', flexShrink: 0 }}><i className='fas fa-times' /></button>
                            </div>
                            <div style={{ color: '#444', fontSize: '.78rem', marginBottom: '.55rem' }}>Size: {item.size} · {isR ? 'Rental' : 'Purchase'}</div>
                            {isR ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                                <span style={{ color: '#9A9A9A', fontSize: '.82rem' }}>Days:</span>
                                <select value={item.days} onChange={e => updateDays(item.listingId, e.target.value)} className='inp' style={{ width: 75, padding: '.28rem .5rem', fontSize: '.85rem', background: '#111' }}>
                                  {[1, 2, 3, 4, 5, 7, 10, 14, 30].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <span style={{ fontWeight: 900, color: '#A78BFA', fontSize: '1rem' }}>{formatPrice(item.rentalPricePerDay * item.days)}</span>
                              </div>
                            ) : <div style={{ fontWeight: 900, color: '#F472B6', fontSize: '1rem' }}>{formatPrice(item.buyPrice || item.rentalPricePerDay)}</div>}
                          </div>
                        </div>
                      )
                    })}
                    {items.length > 0 && <button onClick={() => setStep(2)} className='btn' style={{ background: '#E91E8C', color: '#fff', padding: '1rem', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', width: '100%', marginTop: '.25rem' }}>Continue to Delivery Info →</button>}
                  </>
                )}
              </>
            )}

            {step === 2 && (
              <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,.05)' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.4rem' }}><i className='fas fa-truck' style={{ color: '#E91E8C', marginRight: '.5rem' }} />Delivery & Logistics Details</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <FG label='Start Date *' half><input type='date' className='inp' value={form.rentalStart} min={new Date().toISOString().split('T')[0]} onChange={e => setF('rentalStart', e.target.value)} /></FG>
                  <FG label='Delivery Address *' half><input className='inp' value={form.delivery} onChange={e => setF('delivery', e.target.value)} placeholder='House, street, area, city...' /></FG>
                  <FG label='Return Instructions *' half><input className='inp' value={form.returnD} onChange={e => setF('returnD', e.target.value)} placeholder='Where / how to return?' /></FG>
                  <FG label='Pickup Location *' half><input className='inp' value={form.pickup} onChange={e => setF('pickup', e.target.value)} placeholder='Where to pick up from?' /></FG>
                  <FG label='Collect Details *'><input className='inp' value={form.collect} onChange={e => setF('collect', e.target.value)} placeholder='Special instructions for collection' /></FG>
                </div>
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '.75rem' }}>
                  <button onClick={() => setStep(1)} className='btn' style={{ padding: '1rem 1.4rem', borderRadius: '10px', background: '#111', color: '#9A9A9A', fontWeight: 700, border: '1px solid rgba(255,255,255,.07)' }}>← Back</button>
                  <button onClick={() => { if (!form.rentalStart || !form.delivery || !form.returnD || !form.pickup || !form.collect) { toast('Please fill all fields', 'error'); return } setStep(3) }} className='btn' style={{ flex: 1, background: '#E91E8C', color: '#fff', padding: '1rem', borderRadius: '10px', fontWeight: 800, fontSize: '1rem' }}>Review Order →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,.05)' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.4rem' }}><i className='fas fa-check-circle' style={{ color: '#22C55E', marginRight: '.5rem' }} />Order Review</h3>
                {[['Delivery Address', form.delivery], ['Return Instructions', form.returnD], ['Pickup Location', form.pickup], ['Collection Details', form.collect], ['Start Date', form.rentalStart]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '1rem', padding: '.55rem 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: '.88rem' }}>
                    <span style={{ color: '#555', minWidth: 130, flexShrink: 0 }}>{k}:</span>
                    <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem' }}>
                  <button onClick={() => setStep(2)} className='btn' style={{ padding: '1rem 1.4rem', borderRadius: '10px', background: '#111', color: '#9A9A9A', fontWeight: 700, border: '1px solid rgba(255,255,255,.07)' }}>← Back</button>
                  <button onClick={pay} disabled={paying} className='btn' style={{ flex: 1, background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff', padding: '1rem', borderRadius: '10px', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(233,30,140,.3)' }}>
                    {paying ? <><span className='sp' style={{ width: 18, height: 18, borderWidth: 2, verticalAlign: 'middle', marginRight: '.5rem' }} />Processing...</> : <><i className='fas fa-lock' style={{ marginRight: '.5rem' }} />Pay {formatPrice(total)} Securely</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,.05)', position: 'sticky', top: '75px' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '.75rem', borderBottom: '1px solid rgba(255,255,255,.05)' }}>Price Details ({items.length} item{items.length !== 1 ? 's' : ''})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}><span style={{ color: '#9A9A9A' }}>Total MRP</span><span style={{ fontWeight: 600 }}>{formatPrice(sub)}</span></div>
              {dep > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}><span style={{ color: '#9A9A9A' }}>Security Deposit</span><span style={{ fontWeight: 600, color: '#22C55E' }}>{formatPrice(dep)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}><span style={{ color: '#9A9A9A' }}>Platform Fee (5%)</span><span style={{ fontWeight: 600 }}>{formatPrice(fee)}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,.08)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total Amount</span>
              <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#F472B6' }}>{formatPrice(total)}</span>
            </div>
            {dep > 0 && <div style={{ padding: '.6rem', background: 'rgba(34,197,94,.05)', borderRadius: '8px', border: '1px solid rgba(34,197,94,.1)', fontSize: '.75rem', color: '#4ADE80', marginBottom: '1rem' }}><i className='fas fa-info-circle' style={{ marginRight: '.35rem' }} />Deposit is fully refundable on return.</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.73rem', color: '#444' }}><i className='fas fa-shield-check' style={{ color: '#22C55E' }} />Secured by Razorpay · 100% Safe</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Wishlist Page ────────────────────────────────────────────────────────────
function WishlistPage({ user, toast, refreshCart, onLogin, wishlistIds, toggleWishlist }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetch('/api/wishlist').then(r => r.ok ? r.json() : { wishlist: [] }).then(d => { setItems(d.wishlist || []); setLoading(false) }).catch(() => setLoading(false))
  }, [user])

  const addToCart = async (listing) => {
    if (!user) { onLogin(); return }
    const r = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId: listing._id, days: 1 }) })
    if (r.ok) { toast('Added to cart ��'); refreshCart() } else toast('Failed', 'error')
  }

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <i className='fas fa-heart' style={{ fontSize: '3rem', color: '#1c1c1e' }} />
      <h2 style={{ color: '#9A9A9A' }}>Login to view your wishlist</h2>
      <button onClick={onLogin} className='btn' style={{ background: '#E91E8C', color: '#fff', padding: '.8rem 2rem', borderRadius: '8px', fontWeight: 700 }}>Login</button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ fontWeight: 900, fontSize: '1.7rem', marginBottom: '.3rem' }}><i className='fas fa-heart' style={{ color: '#E91E8C', marginRight: '.5rem' }} />Wishlist</h1>
      <p style={{ color: '#555', fontSize: '.88rem', marginBottom: '2rem' }}>{items.length} saved items</p>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size={44} /></div>
        : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤍</div>
            <h2 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '.75rem' }}>Nothing saved yet</h2>
            <p style={{ color: '#9A9A9A' }}>Tap the ♡ on any item to save it here</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
            {items.map(item => (
              <PCard key={item._id} listing={item} onAdd={() => addToCart(item)} onDetail={() => { }} wishlisted={wishlistIds.has(item._id)} onWish={() => { toggleWishlist(item._id); setItems(prev => prev.filter(i => i._id !== item._id)) }} />
            ))}
          </div>
        )}
    </div>
  )
}
// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ user, setUser, toast, onCreateListing, navigate, wishlistIds, toggleWishlist, refreshCart }) {
  const [tab, setTab] = useState('overview')
  const [myListings, setMyListings] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab === 'listings') { setLoading(true); fetch('/api/listings?mine=true').then(r => r.ok ? r.json() : []).then(d => { setMyListings(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }
    if (tab === 'orders') { setLoading(true); fetch('/api/bookings').then(r => r.ok ? r.json() : []).then(d => { setBookings(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }
  }, [tab])

  const tabs = [
    { k: 'overview', l: 'Overview', i: 'fa-home' },
    { k: 'orders', l: 'My Orders', i: 'fa-box' },
    { k: 'listings', l: 'My Listings', i: 'fa-shirt' },
    { k: 'wishlist', l: 'Wishlist', i: 'fa-heart' },
    { k: 'settings', l: 'Settings', i: 'fa-cog' },
  ]

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', minHeight: '80vh' }}>
      {/* Sidebar */}
      <div>
        <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(255,255,255,.06)', marginBottom: '1rem', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '0 auto 1rem' }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '.25rem' }}>{user.name}</div>
          <div style={{ color: '#555', fontSize: '.8rem' }}>{user.email}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.3rem', marginTop: '.65rem' }}>
            {wishlistIds.size > 0 && <span className="pill" style={{ background: 'rgba(233,30,140,.1)', color: '#F472B6', border: '1px solid rgba(233,30,140,.15)', fontSize: '.7rem' }}>{wishlistIds.size} ❤️ Wishlist</span>}
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className="btn sidebar-link" style={{ ...(tab === t.k ? { background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff' } : { background: 'transparent', color: '#9A9A9A' }) }}>
              <i className={`fas ${t.i}`} style={{ width: 18, textAlign: 'center' }} />{t.l}
            </button>
          ))}
          <button onClick={onCreateListing} className="btn sidebar-link" style={{ background: 'rgba(233,30,140,.1)', color: '#E91E8C', border: '1px solid rgba(233,30,140,.15)', marginTop: '.5rem' }}>
            <i className="fas fa-plus" style={{ width: 18, textAlign: 'center' }} />List an Item
          </button>
        </nav>
      </div>

      {/* Main */}
      <div>
        {tab === 'overview' && (
          <div className="page-enter">
            <h2 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Welcome back, {user.name?.split(' ')[0]}! 👋</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[['Cart Items', 'fa-shopping-bag', '#E91E8C', () => navigate('cart')], ['Wishlist', 'fa-heart', '#A855F7', () => navigate('wishlist')], ['My Listings', 'fa-shirt', '#3B82F6', () => setTab('listings')], ['Orders', 'fa-box', '#22C55E', () => setTab('orders')]].map(([l, i, c, a]) => (
                <div key={l} onClick={a} style={{ padding: '1.5rem', background: '#1c1c1e', borderRadius: '14px', border: '1px solid rgba(255,255,255,.06)', cursor: 'pointer', transition: 'all .2s', textAlign: 'center' }} onMouseOver={e => e.currentTarget.style.borderColor = c + '55'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'}>
                  <i className={`fas ${i}`} style={{ fontSize: '2rem', color: c, marginBottom: '.75rem', display: 'block' }} />
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#E2E8F0' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg,#1a0533,#2d0b6e)', borderRadius: '16px', border: '1px solid rgba(124,58,237,.2)' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '.75rem' }}>💡 Quick Actions</h3>
              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <button onClick={onCreateListing} className="btn" style={{ background: 'linear-gradient(135deg,#E91E8C,#FF4DB8)', color: '#fff', padding: '.75rem 1.4rem', borderRadius: '8px', fontWeight: 800, fontSize: '.9rem' }}><i className="fas fa-plus" style={{ marginRight: '.4rem' }} />List an Item</button>
                <button onClick={() => navigate('explore', { listingType: 'rent' })} className="btn" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', padding: '.75rem 1.4rem', borderRadius: '8px', fontWeight: 700, fontSize: '.9rem' }}><i className="fas fa-search" style={{ marginRight: '.4rem' }} />Browse Rentals</button>
                <button onClick={() => navigate('explore', { listingType: 'buy' })} className="btn" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', padding: '.75rem 1.4rem', borderRadius: '8px', fontWeight: 700, fontSize: '.9rem' }}><i className="fas fa-shopping-bag" style={{ marginRight: '.4rem' }} />Shop Items</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'listings' && (
          <div className="page-enter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 900, fontSize: '1.4rem' }}>My Listings</h2>
              <button onClick={onCreateListing} className="btn" style={{ background: '#E91E8C', color: '#fff', padding: '.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, fontSize: '.88rem' }}><i className="fas fa-plus" style={{ marginRight: '.4rem' }} />Add Listing</button>
            </div>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
              : myListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,.06)' }}>
                  <i className="fas fa-shirt" style={{ fontSize: '3rem', color: '#2a2a2a', marginBottom: '1rem', display: 'block' }} />
                  <h3 style={{ color: '#9A9A9A', marginBottom: '.5rem' }}>No listings yet</h3>
                  <button onClick={onCreateListing} className="btn" style={{ background: '#E91E8C', color: '#fff', padding: '.7rem 1.4rem', borderRadius: '8px', marginTop: '.75rem', fontWeight: 700 }}>Create First Listing</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
                  {myListings.map(l => (
                    <PCard key={l._id} listing={l} onAdd={() => { }} onDetail={() => { }} wishlisted={wishlistIds.has(l._id)} onWish={() => toggleWishlist(l._id)} />
                  ))}
                </div>
              )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="page-enter">
            <h2 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '1.5rem' }}>My Orders & Rentals</h2>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
              : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,.06)' }}>
                  <i className="fas fa-box" style={{ fontSize: '3rem', color: '#2a2a2a', marginBottom: '1rem', display: 'block' }} />
                  <h3 style={{ color: '#9A9A9A' }}>No orders yet</h3>
                </div>
              ) : bookings.map(b => (
                <div key={b._id} style={{ padding: '1.25rem', background: '#1c1c1e', borderRadius: '14px', marginBottom: '.85rem', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#F5F5F5', marginBottom: '.2rem' }}>Order #{b._id?.slice(-8).toUpperCase()}</div>
                      <div style={{ color: '#555', fontSize: '.82rem' }}>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="pill" style={{ background: b.status === 'confirmed' ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)', color: b.status === 'confirmed' ? '#4ADE80' : '#FBB040', border: `1px solid ${b.status === 'confirmed' ? 'rgba(34,197,94,.2)' : 'rgba(245,158,11,.15)'}`, marginBottom: '.35rem', display: 'inline-flex' }}>{b.status || 'Pending'}</span>
                      <div style={{ fontWeight: 900, color: '#F472B6', fontSize: '1.1rem' }}>₹{b.totalAmount}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {tab === 'wishlist' && (
          <div className="page-enter">
            <h2 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '1.5rem' }}><i className="fas fa-heart" style={{ color: '#E91E8C', marginRight: '.5rem' }} />Saved Items</h2>
            <WishlistPage user={user} toast={toast} refreshCart={refreshCart} onLogin={() => { }} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} />
          </div>
        )}

        {tab === 'settings' && (
          <div className="page-enter">
            <h2 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '1.5rem' }}>Account Settings</h2>
            <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <FG label="Full Name" half><input className="inp" defaultValue={user.name} /></FG>
                <FG label="Email" half><input className="inp" defaultValue={user.email} disabled style={{ opacity: .5 }} /></FG>
                <FG label="Phone"><input className="inp" defaultValue={user.phone} placeholder="+91 00000 00000" /></FG>
                <FG label="Address"><textarea className="inp" defaultValue={user.address} placeholder="Your address..." style={{ minHeight: 80 }} /></FG>
              </div>
              <button className="btn" style={{ background: '#E91E8C', color: '#fff', padding: '.8rem 1.5rem', borderRadius: '8px', fontWeight: 700, marginTop: '.5rem' }}>Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// ─── Login Modal ─────────────────────────────────────────────────────────────
function LoginModal({ show, onClose, setUser, toast, switchToRegister, refreshCart, refreshWishlist }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const d = await r.json()
    if (r.ok) { setUser(d.user); toast('Welcome back, ' + d.user.name?.split(' ')[0] + '! 👋'); onClose(); refreshCart(); refreshWishlist() }
    else toast(d.error || 'Login failed', 'error')
    setLoading(false)
  }

  return (
    <Modal show={show} onClose={onClose} title="Welcome back 👋">
      <form onSubmit={submit}>
        <FG label="Email"><input type="email" className="inp" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="your@email.com" required /></FG>
        <FG label="Password"><input type="password" className="inp" value={form.password} onChange={e => setF('password', e.target.value)} placeholder="Your password" required /></FG>
        <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', marginTop: '.5rem' }}>
          {loading ? <span className="sp" /> : 'Login'}
        </button>
        <p style={{ textAlign: 'center', color: '#555', fontSize: '.85rem', marginTop: '1rem' }}>
          New to WearShare? <button type="button" onClick={switchToRegister} className="btn" style={{ background: 'transparent', color: '#E91E8C', fontWeight: 700, fontSize: '.85rem', textDecoration: 'underline' }}>Create Account</button>
        </p>
      </form>
    </Modal>
  )
}

// ─── Register Modal ───────────────────────────────────────────────────────────
function RegisterModal({ show, onClose, setUser, toast, switchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const register = async (e) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const d = await r.json()
    if (r.ok) { toast('OTP sent to ' + form.email); setStep(2) }
    else toast(d.error || 'Registration failed', 'error')
    setLoading(false)
  }

  const verify = async (e) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, otp }) })
    const d = await r.json()
    if (r.ok) { setUser(d.user); toast('Account created! Welcome to WearShare 🎉'); onClose() }
    else toast(d.error || 'Invalid OTP', 'error')
    setLoading(false)
  }

  return (
    <Modal show={show} onClose={onClose} title={step === 1 ? 'Create Account ✨' : 'Verify Email 📧'}>
      {step === 1 ? (
        <form onSubmit={register}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <FG label="Full Name" half><input className="inp" value={form.name} onChange={e => setF('name', e.target.value)} placeholder="Your full name" required /></FG>
            <FG label="Phone" half><input className="inp" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+91 00000 00000" /></FG>
            <FG label="Email"><input type="email" className="inp" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="your@email.com" required /></FG>
            <FG label="Password"><input type="password" className="inp" value={form.password} onChange={e => setF('password', e.target.value)} placeholder="Create a password" required minLength={6} /></FG>
          </div>
          <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', marginTop: '.5rem' }}>
            {loading ? <span className="sp" /> : 'Create Account →'}
          </button>
          <p style={{ textAlign: 'center', color: '#555', fontSize: '.85rem', marginTop: '1rem' }}>
            Already have an account? <button type="button" onClick={switchToLogin} className="btn" style={{ background: 'transparent', color: '#E91E8C', fontWeight: 700, fontSize: '.85rem', textDecoration: 'underline' }}>Login</button>
          </p>
        </form>
      ) : (
        <form onSubmit={verify}>
          <p style={{ color: '#9A9A9A', marginBottom: '1.5rem', lineHeight: 1.65 }}>We sent a 6-digit code to <strong style={{ color: '#fff' }}>{form.email}</strong></p>
          <FG label="Enter OTP"><input className="inp" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} required style={{ letterSpacing: '.5rem', textAlign: 'center', fontSize: '1.2rem' }} /></FG>
          <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', marginTop: '.5rem' }}>
            {loading ? <span className="sp" /> : 'Verify & Activate Account'}
          </button>
        </form>
      )}
    </Modal>
  )
}

// ─── Create Listing Modal ─────────────────────────────────────────────────────
function CreateListingModal({ show, onClose, toast, user }) {
  const [form, setForm] = useState({ name: '', description: '', category: '', subcategory: '', brand: '', size: '', condition: '', listingType: 'rent', gender: 'unisex', rentalPricePerDay: '', buyPrice: '', securityDeposit: '', availableFrom: '', availableUntil: '' })
  const [imageData, setImageData] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleImage = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setImageData(e.target.result)
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.size || !form.condition) { toast('Fill required fields', 'error'); return }
    if (form.listingType === 'rent' && !form.rentalPricePerDay) { toast('Enter rental price', 'error'); return }
    if (form.listingType === 'buy' && !form.buyPrice) { toast('Enter buy price', 'error'); return }
    setLoading(true)
    const payload = { ...form, rentalPricePerDay: Number(form.rentalPricePerDay) || 0, buyPrice: Number(form.buyPrice) || 0, securityDeposit: Number(form.securityDeposit) || 0, imageData }
    const r = await fetch('/api/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (r.ok) { toast('Item listed successfully! 🎉'); onClose(); setForm({ name: '', description: '', category: '', subcategory: '', brand: '', size: '', condition: '', listingType: 'rent', gender: 'unisex', rentalPricePerDay: '', buyPrice: '', securityDeposit: '', availableFrom: '', availableUntil: '' }); setImageData(null) }
    else { const d = await r.json(); toast(d.error || 'Failed to create listing', 'error') }
    setLoading(false)
  }

  return (
    <Modal show={show} onClose={onClose} title="📦 List an Item" wide maxW={720}>
      <form onSubmit={submit}>
        {/* Listing Type */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontWeight: 700, fontSize: '.78rem', color: '#9A9A9A', letterSpacing: '.5px', textTransform: 'uppercase', display: 'block', marginBottom: '.6rem' }}>Listing For *</label>
          <div style={{ display: 'flex', gap: '.65rem' }}>
            {[{ k: 'rent', l: '🏠 For Rent', d: 'Earn from daily rentals' }, { k: 'buy', l: '🛍️ For Sale', d: 'Sell it to someone' }].map(t => (
              <div key={t.k} onClick={() => setF('listingType', t.k)} style={{ flex: 1, padding: '1rem', borderRadius: '10px', border: `2px solid ${form.listingType === t.k ? (t.k === 'rent' ? '#7C3AED' : '#E91E8C') : 'rgba(255,255,255,.08)'}`, cursor: 'pointer', background: form.listingType === t.k ? (t.k === 'rent' ? 'rgba(124,58,237,.08)' : 'rgba(233,30,140,.08)') : 'transparent', transition: 'all .2s' }}>
                <div style={{ fontWeight: 800, color: '#E2E8F0', marginBottom: '.2rem' }}>{t.l}</div>
                <div style={{ color: '#555', fontSize: '.78rem' }}>{t.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <FG label="Item Name *"><input className="inp" value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Blue Silk Saree" required /></FG>
          <FG label="Gender *" half>
            <select className="inp" value={form.gender} onChange={e => setF('gender', e.target.value)}>
              {['unisex', 'men', 'women', 'kids'].map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
            </select>
          </FG>
          <FG label="Category *" half>
            <select className="inp" value={form.category} onChange={e => setF('category', e.target.value)} required>
              <option value="">Select Category</option>
              {['Clothing', 'Sarees', 'Lehengas', 'Suits', 'Ethnic Wear', 'Kurtas', 'T-Shirts', 'Jeans', 'Dresses', 'Tops', 'Jackets', 'Footwear', 'Accessories', 'Jewellery', 'Bags', 'Others'].map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </FG>
          <FG label="Brand" half><input className="inp" value={form.brand} onChange={e => setF('brand', e.target.value)} placeholder="e.g. Manyavar, H&M" /></FG>
          <FG label="Size *" half>
            <select className="inp" value={form.size} onChange={e => setF('size', e.target.value)} required>
              <option value="">Select Size</option>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size', 'Custom'].map(s => <option key={s}>{s}</option>)}
            </select>
          </FG>
          <FG label="Condition *" half>
            <select className="inp" value={form.condition} onChange={e => setF('condition', e.target.value)} required>
              <option value="">Select Condition</option>
              {['New with tags', 'Like New', 'Excellent', 'Good', 'Fair'].map(c => <option key={c}>{c}</option>)}
            </select>
          </FG>

          {form.listingType === 'rent' ? (
            <>
              <FG label="Rental Price per Day (₹) *" half><input type="number" className="inp" value={form.rentalPricePerDay} onChange={e => setF('rentalPricePerDay', e.target.value)} placeholder="e.g. 250" min="1" required={form.listingType === 'rent'} /></FG>
              <FG label="Security Deposit (₹)" half><input type="number" className="inp" value={form.securityDeposit} onChange={e => setF('securityDeposit', e.target.value)} placeholder="e.g. 1000" min="0" /></FG>
              <FG label="Available From" half><input type="date" className="inp" value={form.availableFrom} onChange={e => setF('availableFrom', e.target.value)} /></FG>
              <FG label="Available Until" half><input type="date" className="inp" value={form.availableUntil} onChange={e => setF('availableUntil', e.target.value)} /></FG>
            </>
          ) : (
            <FG label="Selling Price (₹) *"><input type="number" className="inp" value={form.buyPrice} onChange={e => setF('buyPrice', e.target.value)} placeholder="e.g. 1500" min="1" required={form.listingType === 'buy'} /></FG>
          )}

          <FG label="Description"><textarea className="inp" value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Fabric type, occasion, any defects..." /></FG>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontWeight: 700, fontSize: '.78rem', color: '#9A9A9A', letterSpacing: '.5px', textTransform: 'uppercase', display: 'block', marginBottom: '.6rem' }}>Photo</label>
          <div className={`upload-zone ${dragging ? 'drag' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleImage(e.dataTransfer.files[0]) }}>
            {imageData ? (
              <img src={imageData} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <div style={{ color: '#555' }}>
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', marginBottom: '.65rem', display: 'block', color: '#333' }} />
                <p style={{ fontWeight: 600, marginBottom: '.25rem' }}>Drag & drop or click to upload</p>
                <p style={{ fontSize: '.8rem' }}>JPG, PNG, WEBP up to 5MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImage(e.target.files[0])} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff', borderRadius: '10px', fontWeight: 800, fontSize: '1rem' }}>
          {loading ? <span className="sp" /> : <><i className="fas fa-check" style={{ marginRight: '.5rem' }} />Publish Listing</>}
        </button>
      </form>
    </Modal>
  )
}

// ─── App Footer ───────────────────────────────────────────────────────────────
function AppFooter({ navigate }) {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,.06)', padding: '3rem 2rem 1.5rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '7px', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-shirt" style={{ color: '#fff', fontSize: '.75rem' }} /></div>
              <span style={{ fontWeight: 900, color: '#fff' }}>WearShare</span>
            </div>
            <p style={{ color: '#444', fontSize: '.85rem', lineHeight: 1.7 }}>India's community fashion rental & resale platform. Wear more, waste less.</p>
          </div>
          {[
            { title: 'Shop', links: [['Men', 'men'], ['Women', 'women'], ['Kids', 'kids'], ['Footwear', 'footwear'], ['Accessories', 'accessories']] },
            { title: 'Rent', links: [['Browse Rentals', { listingType: 'rent' }], ['Luxe Rentals', { listingType: 'rent' }], ['How it Works', {}]] },
            { title: 'Company', links: [['About', ''], ['Blog', ''], ['Careers', ''], ['Contact', '']] },
          ].map(s => (
            <div key={s.title}>
              <div style={{ fontWeight: 800, fontSize: '.88rem', color: '#fff', marginBottom: '.9rem', letterSpacing: '.3px' }}>{s.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                {s.links.map(([l, f]) => (
                  <button key={l} onClick={() => typeof f === 'object' ? navigate('explore', f) : {}} className="btn" style={{ background: 'transparent', color: '#444', fontSize: '.85rem', textAlign: 'left', padding: 0, fontWeight: 400, transition: 'color .15s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#444'}>{l}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: '1.25rem' }}>
          <p style={{ color: '#333', fontSize: '.78rem' }}>© 2025 WearShare. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['fa-instagram', 'fa-twitter', 'fa-linkedin'].map(ic => (
              <button key={ic} className="btn" style={{ background: 'transparent', color: '#333', fontSize: '1rem', padding: '.25rem', transition: 'color .15s' }} onMouseOver={e => e.currentTarget.style.color = '#E91E8C'} onMouseOut={e => e.currentTarget.style.color = '#333'}>
                <i className={`fab ${ic}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ navigate, user }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070', title: 'Premium Ethnic Wear', sub: 'Rent authentic designer pieces for a fraction of the cost.', cta: 'Explore Collections', link: { gender: 'women' } },
    { img: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=2070', title: 'The Ultimate Men\'s Edit', sub: 'Sharp suits, kurtas, and more. Own the room.', cta: 'Shop Men', link: { gender: 'men' } },
    { img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070', title: 'Luxe Aesthetics', sub: 'Sustainable fashion meets premium quality.', cta: 'Rent Now', link: { listingType: 'rent' } }
  ]

  useEffect(() => { const timer = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 5000); return () => clearInterval(timer) }, [])

  const cats = [
    { n: 'Women', i: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300', l: { gender: 'women' } },
    { n: 'Men', i: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300', l: { gender: 'men' } },
    { n: 'Kids', i: 'https://images.unsplash.com/photo-1519238263530-990100fbfef2?w=300', l: { gender: 'kids' } },
    { n: 'Footwear', i: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300', l: { gender: 'footwear' } },
    { n: 'Accessories', i: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=300', l: { gender: 'accessories' } }
  ]

  return (
    <div>
      {/* Hero Carousel */}
      <div style={{ position: 'relative', height: '65vh', minHeight: 450, overflow: 'hidden', background: '#000' }}>
        {slides.map((s, i) => (
          <div key={i} className='hero-slide' style={{ opacity: currentSlide === i ? 1 : 0, transform: `scale(${currentSlide === i ? 1 : 1.05})`, zIndex: currentSlide === i ? 1 : 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: `url(${s.img}) center/cover` }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,.9) 20%, rgba(0,0,0,.3) 100%)' }} />
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10vw', maxWidth: 600, paddingRight: '2rem' }}>
              <h1 style={{ fontSize: '3.5vw', minFontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-1px' }}>{s.title}</h1>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem', fontWeight: 500, lineHeight: 1.5 }}>{s.sub}</p>
              <button onClick={() => navigate('explore', s.link)} className='btn' style={{ padding: '1.1rem 2.5rem', background: '#fff', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,.3)' }}>
                {s.cta} <i className='fas fa-arrow-right' style={{ marginLeft: '.5rem' }} />
              </button>
            </div>
          </div>
        ))}
        {/* Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '10vw', display: 'flex', gap: '.5rem', zIndex: 10 }}>
          {slides.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className='btn' style={{ width: currentSlide === i ? 40 : 12, height: 6, borderRadius: 3, background: currentSlide === i ? '#E91E8C' : 'rgba(255,255,255,.3)', transition: 'all .3s' }} />)}
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Category Strip */}
        <div className='hscroll' style={{ marginBottom: '4rem', marginTop: '-5rem', position: 'relative', zIndex: 20 }}>
          {cats.map(c => (
            <div key={c.n} onClick={() => navigate('explore', c.l)} style={{ flexShrink: 0, width: 140, cursor: 'pointer', group: 'true' }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#1c1c1e', overflow: 'hidden', border: '4px solid #000', outline: '2px solid rgba(255,255,255,.1)', marginBottom: '1rem', transition: 'all .3s' }} onMouseOver={e => e.currentTarget.style.outlineColor = '#E91E8C'} onMouseOut={e => e.currentTarget.style.outlineColor = 'rgba(255,255,255,.1)'}>
                <img src={c.i} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={c.n} />
              </div>
              <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '.95rem', letterSpacing: '.5px', color: '#E2E8F0' }}>{c.n.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Action Split: Rent vs Buy */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2rem', marginBottom: '5rem' }}>
          <div onClick={() => navigate('explore', { listingType: 'rent' })} style={{ position: 'relative', height: 380, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
            <img src='https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000' style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt='Rentals' />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(124,58,237,.9) 0%, rgba(0,0,0,.2) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div style={{ fontSize: '.8rem', fontWeight: 800, color: '#fff', letterSpacing: '2px', marginBottom: '.5rem' }}>SUSTAINABLE FASHION</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>Rent The Look</h2>
              <button className='btn' style={{ padding: '.8rem 2rem', background: '#fff', color: '#7C3AED', fontWeight: 800, borderRadius: '8px' }}>Explore Rentals</button>
            </div>
          </div>
          <div onClick={() => navigate('explore', { listingType: 'buy' })} style={{ position: 'relative', height: 380, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
            <img src='https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000' style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt='Buy' />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(233,30,140,.9) 0%, rgba(0,0,0,.2) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div style={{ fontSize: '.8rem', fontWeight: 800, color: '#fff', letterSpacing: '2px', marginBottom: '.5rem' }}>PRELOVED & NEW</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>Buy Must-Haves</h2>
              <button className='btn' style={{ padding: '.8rem 2rem', background: '#fff', color: '#E91E8C', fontWeight: 800, borderRadius: '8px' }}>Shop Collection</button>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div style={{ background: 'linear-gradient(135deg,#1c1c1e,#111)', borderRadius: '20px', padding: '4rem 2rem', border: '1px solid rgba(255,255,255,.05)', marginBottom: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '3rem' }}>Why Choose WearShare?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem' }}>
            {[
              { i: 'fa-box-open', t: 'Try Before You Buy', d: 'Rent to test, buy if you love it.' },
              { i: 'fa-leaf', t: 'Eco-Friendly', d: 'Reduce textile waste by sharing.' },
              { i: 'fa-shield-alt', t: '100% Secure', d: 'Safe payments & verified users.' },
              { i: 'fa-rupee-sign', t: 'Earn Money', d: 'List your idle wardrobe to earn.' }
            ].map(s => (
              <div key={s.t}>
                <div style={{ width: 60, height: 60, borderRadius: '15px', background: 'rgba(233,30,140,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <i className={`fas ${s.i}`} style={{ fontSize: '1.5rem', color: '#E91E8C' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '.5rem' }}>{s.t}</div>
                <div style={{ color: '#9A9A9A', fontSize: '.9rem', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h2 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: '1rem' }}>Join the Fashion Revolution</h2>
          <p style={{ color: '#9A9A9A', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>Whether you're looking for your next party outfit or want to clear out your closet, WearShare is your community.</p>
          <button onClick={() => navigate('explore')} className='btn' style={{ padding: '1.2rem 3rem', background: 'linear-gradient(135deg,#E91E8C,#7C3AED)', color: '#fff', fontSize: '1.1rem', fontWeight: 800, borderRadius: '10px', boxShadow: '0 10px 30px rgba(233,30,140,.3)' }}>Start Exploring Now</button>
        </div>
      </div>
    </div>
  )
}

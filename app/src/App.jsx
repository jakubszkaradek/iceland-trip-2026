import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom'
import './App.css'

// ============ DATA ============
const USERS = {
  kuba: { name: 'Kuba', emoji: '🧔', password: 'kuba' },
  paulinka: { name: 'Paulina', emoji: '👩', password: 'paulinka' },
  klara: { name: 'Klara', emoji: '👱‍♀️', password: 'klara' },
  natu: { name: 'Natalia', emoji: '👩‍🦰', password: 'natu' },
}

const ROUTE_DATA = [
  {
    day: 0, date: '16.09', weekday: 'Wt', title: 'Przylot & Odbiór Auta KEF',
    summary: 'Wylot WAW 20:55 → KEF ~23:00 → Odbiór RAV4 na lotnisku → Airbnb',
    km: 50, drive: '45 min',
    camping: 'Airbnb Snorrabraut 71, Reykjavik',
    points: [
      '✈️ Wylot WAW 20:55 (1200 PLN/os)',
      '🛬 Lądowanie KEF ~23:00 IST',
      '🚗 Odbiór Toyoty RAV4 pod terminalem KEF (Sheep Car)',
      '💳 Dopłata na lotnisku 1101 PLN (zaliczka 263 PLN)',
      '🏠 Dojazd do Airbnb Snorrabraut 71 (190 PLN/os)',
    ],
    mapUrl: 'https://www.google.com/maps/dir/Keflavik+Airport/Snorrabraut+71,+Reykjavik',
  },
  {
    day: 1, date: '17.09', weekday: 'Śr', title: 'Golden Circle',
    summary: 'Start z Airbnb (auto pod oknem!) → Þingvellir → Geysir → Gullfoss → Bónus → Kerið',
    km: 230, drive: '3h 15min',
    camping: 'Hvolsvöllur Camping',
    points: [
      '08:30 Start prosto z Airbnb (auto gotowe)',
      '09:15 Þingvellir — UNESCO, szczelina Almannagjá',
      '11:45 Geysir/Strokkur — gejzer co 6-8 min',
      '13:30 Gullfoss — dwustopniowa kaskada',
      '15:30 Selfoss Bónus — ZAKUPY na kolejne dni',
      '17:15 Kerið — krater (opcja)',
      '18:45 Hvolsvöllur Camping',
    ],
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Reykjavik&destination=Hvolsvollur&waypoints=Thingvellir%7CGeysir%7CGullfoss%7CSelfoss%7CKerid',
  },
  {
    day: 2, date: '18.09', weekday: 'Czw', title: 'Wodospady & Czarne Plaże',
    summary: 'Seljalandsfoss → Skógafoss → Dyrhólaey → Reynisfjara Beach → Skaftafell',
    km: 250, drive: '3h 15min',
    camping: 'Skaftafell Camping',
    points: [
      '08:30 Seljalandsfoss + Gljúfrabúi',
      '10:30 Skógafoss + Kvernufoss',
      '13:00 Dyrhólaey — klify',
      '14:20 Reynisfjara Beach ⚠️ SNEAKER WAVES',
      '15:30 Przejazd do Skaftafell',
      '18:00 Skaftafell Camping',
    ],
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Hvolsvollur&destination=Skaftafell&waypoints=Seljalandsfoss%7CSkogafoss%7CDyrholaey%7CReynisfjara+Beach',
  },
  {
    day: 3, date: '19.09', weekday: 'Pt', title: 'Lodowiec, Diamenty & Basen Vík',
    summary: 'Trekking lodowiec → Jökulsárlón → Diamond Beach → Fjaðrárgljúfur → Basen Vík',
    km: 270, drive: '3h 30min',
    camping: 'Vík Campsite',
    points: [
      '08:45 🧊 TREKKING PO LODOWCU (3.5h)',
      '13:15 Jökulsárlón — laguna, foki',
      '14:30 Diamond Beach — lód na piasku',
      '17:00 Fjaðrárgljúfur — kanion',
      '19:15 Vík Campsite — rozbicie namiotu',
      '20:00 ♨️ Basen miejski Sundlaug Vík (~30 PLN) — wygrzanie po lodowcu!',
    ],
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Skaftafell&destination=Vik&waypoints=Jokulsarlon%7CDiamond+Beach%7CFjadrargljufur%7CSundlaug+Vikur',
  },
  {
    day: 4, date: '20.09', weekday: 'Sob', title: 'Transfer → Snæfellsnes',
    summary: 'Vík → Borgarnes → Ytri Tunga → Búðakirkja → Arnarstapi',
    km: 370, drive: '4h 45min',
    camping: 'Arnarstapi Camping ⭐',
    points: [
      '07:30 Wczesny start z Vík!',
      '11:00 Borgarnes — kawa, paliwo',
      '12:45 Ytri Tunga — foki!',
      '14:00 Búðakirkja — czarny kościół',
      '15:15 Arnarstapi — klify, Gatklettur',
      '17:30 Lóndrangar — iglice',
      '18:45 Arnarstapi Camping',
    ],
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Vik&destination=Arnarstapi&waypoints=Borgarnes%7CYtri+Tunga%7CBudakirkja%7CLondrangar',
  },
  {
    day: 5, date: '21.09', weekday: 'Nd', title: 'Kirkjufell → Reykjavík & Kvika Footbath',
    summary: 'Djúpalónssandur → Saxhóll → Kirkjufell → Reykjavík → Kvika Footbath',
    km: 230, drive: '3h',
    camping: 'Reykjavík Eco Campsite',
    points: [
      '09:00 Djúpalónssandur — czarna plaża',
      '10:45 Saxhóll — krater 360°',
      '12:15 Kirkjufell + Kirkjufellsfoss',
      '14:00 Przejazd do Reykjavíku',
      '18:00 Reykjavík Eco Campsite',
      '20:30 ♨️ Kvika Footbath (Grótta) — darmowe moczenie nóg pod zorzę!',
    ],
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Arnarstapi&destination=Reykjavik&waypoints=Djupalonssandur%7CSaxholl+Crater%7CKirkjufell%7CKvika+Footbath',
  },
  {
    day: 6, date: '22.09', weekday: 'Pn', title: 'Reykjavík, Reykjanes & Wylot',
    summary: 'Miasto → Seltún → Brimketill → Basen (opcja) → Lotnisko KEF',
    km: 90, drive: '1h 30min',
    camping: '✈️ Wylot 23:50',
    points: [
      '09:00 Pakowanie',
      '10:00 Hallgrímskirkja, Rainbow St, Harpa',
      '13:30 🍽️ Obiad na mieście (GF!)',
      '14:00 Seltún Geothermal Area',
      '16:00 Brimketill lava rock pool — klify i fale',
      '17:30 Most Między Kontynentami (Bridge Between Continents)',
      '19:00 ♨️ Basen Vatnaveröld Keflavík / Sky Lagoon (OPCJA — jak starczy czasu)',
      '21:00 🚗 Zwrot auta bezpośrednio na lotnisku KEF',
      '23:50 ✈️ WYLOT do Warszawy',
    ],
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Reykjavik&destination=Keflavik+Airport&waypoints=Seltun+Geothermal+Area%7CBrimketill+lava+rock+pool%7CBridge+Between+Continents',
  },
]

const CAMPING_DATA = [
  { name: 'Hvolsvöllur Camping', night: '17→18', price: '~2000 ISK/os', website: 'tjalda.is', facilities: 'Kuchnia, prysznice, osłonięty drzewami', phone: '⚠️ Sprawdzić' },
  { name: 'Skaftafell Camping', night: '18→19', price: '~2500 ISK/os', website: 'vjp.is', facilities: 'Ogromny, pralnia, suszarnie, całoroczny', phone: '⚠️ Sprawdzić' },
  { name: 'Vík Campsite', night: '19→20', price: '~2500 ISK/os', website: 'vik.is/camping', facilities: 'Ogrzewana kuchnia, pralki, suszarki, WiFi', phone: '⚠️ Sprawdzić' },
  { name: 'Arnarstapi Camping ⭐', night: '20→21', price: '~2000 ISK/os', website: 'arnarstapicenter.is', facilities: '"Petarda" — widoki, prysznice, spacer klifami', phone: '⚠️ Sprawdzić' },
  { name: 'Reykjavík Eco Campsite', night: '21→22', price: '~3555+400 ISK/os', website: 'reykjavikcampsite.is', facilities: '2km od centrum, kuchnia, prąd', phone: '⚠️ Sprawdzić' },
]

const FAQ_DATA = [
  { q: 'Woda z kranu?', a: 'TAK — najlepsza na świecie. Nie kupujcie butelkowanej!' },
  { q: 'Gotówka?', a: 'NIE potrzebna. Wszędzie karta. Ale PIN WYMAGANY na stacjach paliw!' },
  { q: 'Prędkość na drogach?', a: '90 km/h na asfalcie, 80 km/h na szutrze. Mandaty są ASTRONOMICZNE.' },
  { q: 'F-roads?', a: 'Macie ubezpieczenie F-roads. RAV4 4x4 da radę. Ale sprawdzajcie road.is!' },
  { q: 'Parkingi?', a: 'Parka.is / EasyPark! Kamery skanują tablice. Bez opłaty = kara!' },
  { q: 'Pogoda?', a: 'vedur.is każdego ranka. Zmienia się co godzinę. 7-12°C dzień, 2-5°C noc.' },
  { q: 'Tankowanie?', a: 'Tankujcie gdy widzicie stację! Na południu 100+ km między stacjami.' },
  { q: 'Sneaker waves?', a: 'Na Reynisfjara NIE podchodzić do wody. Fale zabijają ludzi co roku.' },
  { q: 'Zorza polarna?', a: 'Realne szanse od połowy września. Wyjedźcie poza miasto, apka Aurora Forecast.' },
  { q: 'Jedzenie import?', a: 'Max 3 kg/os, fabrycznie pakowane. Zakaz surowego mięsa/nabiału.' },
  { q: 'Limit prędkości F-roads?', a: 'Maksymalnie 40-50 km/h. Kamienie lecą w podwozie i szyby.' },
  { q: 'Wildcamp?', a: 'ZAKAZANY bez zgody właściciela. Tylko oficjalne campingi!' },
]

const PACKING_SHARED = [
  { item: 'Apteczka (Compeed, ibuprofen, bandaż)', who: 'Kuba', packed: false },
  { item: 'Taśma naprawcza + izolacja', who: 'Kuba', packed: false },
  { item: 'Worki strunowe (10 szt)', who: 'Kuba', packed: false },
  { item: 'Worki na śmieci (rolka)', who: 'Paulina', packed: false },
  { item: 'Folie NRC pod śpiwor', who: 'Kuba', packed: false },
  { item: 'Osłonka aluminiowa na palnik', who: 'Kuba', packed: false },
  { item: 'Shaker + długi spork', who: 'Kuba', packed: false },
]

const PACKING_PERSONAL = [
  'Dowód/paszport',
  'Prawo jazdy (PLASTIK!)',
  'Karta płatnicza (PIN!)',
  'Telefon + ładowarka',
  'Powerbank (≥10k mAh) → PODRĘCZNY!',
  'Termos (≥0.75L)',
  'Klapki/Crocsy',
  'Kąpielówki/strój kąpielowy',
  'Ręcznik szybkoschnący',
  'Rękawiczki wiatroodporne',
  'Czapka merino',
  'Komin/buff ×2',
  'Krem z filtrem + pomadka',
  'Stopery + maska na oczy',
  'Okulary przeciwsłoneczne',
  'Peleryna przeciwdeszczowa',
]

// ============ HELPERS ============
const getUser = () => localStorage.getItem('iceland_user')
const setUser = (u) => localStorage.setItem('iceland_user', u)
const clearUser = () => localStorage.removeItem('iceland_user')

const DEFAULT_COSTS = [
  { id: 1, user: 'kuba', desc: 'Auto Sheep Car — zaliczka', amount: 263, currency: 'PLN', split: 'all', date: 'Wpłacone' },
  { id: 2, user: 'kuba', desc: 'Auto Sheep Car — dopłata KEF', amount: 1101, currency: 'PLN', split: 'all', date: 'Na miejscu' },
  { id: 3, user: 'kuba', desc: 'Airbnb Snorrabraut 71 (pokój)', amount: 760, currency: 'PLN', split: 'all', date: 'Opłacone' },
  { id: 4, user: 'kuba', desc: 'Lot WizzAir w 2 strony (Kuba)', amount: 1200, currency: 'PLN', split: 'personal', date: 'Opłacone' },
  { id: 5, user: 'paulinka', desc: 'Lot WizzAir w 2 strony (Paulina)', amount: 1200, currency: 'PLN', split: 'personal', date: 'Opłacone' },
  { id: 6, user: 'natu', desc: 'Lot WizzAir w 2 strony (Natalia)', amount: 1200, currency: 'PLN', split: 'personal', date: 'Opłacone' },
  { id: 7, user: 'klara', desc: 'Lot WizzAir w 2 strony (Klara)', amount: 1200, currency: 'PLN', split: 'personal', date: 'Opłacone' },
]

function getCosts() {
  try {
    const raw = localStorage.getItem('iceland_costs')
    return raw ? JSON.parse(raw) : DEFAULT_COSTS
  } catch {
    return DEFAULT_COSTS
  }
}
function saveCosts(costs) { localStorage.setItem('iceland_costs', JSON.stringify(costs)) }

function getPackingState() {
  try { return JSON.parse(localStorage.getItem('iceland_packing') || '{}') } catch { return {} }
}
function savePackingState(s) { localStorage.setItem('iceland_packing', JSON.stringify(s)) }

// ============ COMPONENTS ============

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const user = USERS[username]
    if (user && user.password === password) {
      setUser(username)
      navigate('/route')
    } else {
      setError('Złe dane!')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🇮🇸 Islandia 2026</h1>
        <p className="login-subtitle">16-22 Września</p>
        <form onSubmit={handleLogin}>
          <input placeholder="Login" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          <input placeholder="Hasło" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="error">{error}</p>}
          <button type="submit">Wejdź →</button>
        </form>
        <div className="login-users">
          {Object.entries(USERS).map(([k, v]) => (
            <span key={k} className="user-chip" onClick={() => { setUsername(k); setPassword(v.password) }}>
              {v.emoji} {v.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = USERS[getUser()]
  const tabs = [
    { path: '/route', label: '🗺️ Trasa', },
    { path: '/packing', label: '🎒 Pakowanie' },
    { path: '/costs', label: '💰 Koszty' },
    { path: '/camping', label: '⛺ Campingi' },
    { path: '/faq', label: '❓ FAQ' },
  ]

  return (
    <nav className="nav">
      <div className="nav-top">
        <span className="nav-title">🇮🇸 Islandia</span>
        <span className="nav-user" onClick={() => { clearUser(); navigate('/') }}>
          {user?.emoji} {user?.name} ✕
        </span>
      </div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <Link key={t.path} to={t.path} className={`nav-tab ${location.pathname === t.path ? 'active' : ''}`}>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function RoutePage() {
  return (
    <div className="page">
      <h2>🗺️ Trasa — Dzień po Dniu</h2>
      {ROUTE_DATA.map(day => (
        <div key={day.day} className="route-day">
          <div className="day-header">
            <span className="day-badge">D{day.day}</span>
            <div>
              <h3>{day.date} ({day.weekday}) — {day.title}</h3>
              <p className="day-meta">{day.km} km | {day.drive} | ⛺ {day.camping}</p>
            </div>
          </div>
          <p className="day-summary">{day.summary}</p>
          <ul className="day-points">
            {day.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          {day.mapUrl && (
            <a href={day.mapUrl} target="_blank" rel="noopener" className="map-link">
              📍 Otwórz w Google Maps →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

function PackingPage() {
  const [state, setState] = useState(getPackingState())
  const currentUser = getUser()

  const toggle = (key) => {
    const next = { ...state, [key]: !state[key] }
    setState(next)
    savePackingState(next)
  }

  return (
    <div className="page">
      <h2>🎒 Lista Pakowania</h2>

      <h3>Rzeczy wspólne</h3>
      <div className="packing-list">
        {PACKING_SHARED.map((item, i) => {
          const key = `shared_${i}`
          return (
            <label key={key} className={`packing-item ${state[key] ? 'checked' : ''}`}>
              <input type="checkbox" checked={!!state[key]} onChange={() => toggle(key)} />
              <span>{item.item}</span>
              <span className="packing-who">→ {item.who}</span>
            </label>
          )
        })}
      </div>

      <h3>Każdy bierze ({USERS[currentUser]?.name})</h3>
      <div className="packing-list">
        {PACKING_PERSONAL.map((item, i) => {
          const key = `personal_${currentUser}_${i}`
          return (
            <label key={key} className={`packing-item ${state[key] ? 'checked' : ''}`}>
              <input type="checkbox" checked={!!state[key]} onChange={() => toggle(key)} />
              <span>{item}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function CostsPage() {
  const [costs, setCosts] = useState(getCosts())
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('PLN')
  const [splitMode, setSplitMode] = useState('all')
  const currentUser = getUser()

  const addCost = (e) => {
    e.preventDefault()
    if (!desc || !amount) return
    const newCost = {
      id: Date.now(),
      user: currentUser,
      desc,
      amount: parseFloat(amount),
      currency,
      split: splitMode,
      date: new Date().toLocaleDateString('pl-PL'),
    }
    const next = [newCost, ...costs]
    setCosts(next)
    saveCosts(next)
    setDesc('')
    setAmount('')
  }

  const deleteCost = (id) => {
    const next = costs.filter(c => c.id !== id)
    setCosts(next)
    saveCosts(next)
  }

  const totalPLN = costs.filter(c => c.currency === 'PLN').reduce((s, c) => s + c.amount, 0)
  const totalISK = costs.filter(c => c.currency === 'ISK').reduce((s, c) => s + c.amount, 0)

  const perUserPLN = {}
  const perUserISK = {}
  Object.keys(USERS).forEach(u => { perUserPLN[u] = 0; perUserISK[u] = 0 })
  costs.forEach(c => {
    if (c.currency === 'PLN') perUserPLN[c.user] = (perUserPLN[c.user] || 0) + c.amount
    else perUserISK[c.user] = (perUserISK[c.user] || 0) + c.amount
  })

  return (
    <div className="page">
      <h2>💰 Koszty</h2>

      <div className="costs-summary">
        <div className="cost-total">
          <span>Razem PLN</span>
          <strong>{totalPLN.toFixed(0)} PLN</strong>
        </div>
        <div className="cost-total">
          <span>Razem ISK</span>
          <strong>{totalISK.toFixed(0)} ISK</strong>
        </div>
      </div>

      <div className="costs-per-user">
        {Object.entries(USERS).map(([k, v]) => (
          <div key={k} className="user-cost">
            <span>{v.emoji} {v.name}</span>
            <span>{(perUserPLN[k] || 0).toFixed(0)} PLN / {(perUserISK[k] || 0).toFixed(0)} ISK</span>
          </div>
        ))}
      </div>

      <form className="cost-form" onSubmit={addCost}>
        <input placeholder="Opis (np. paliwo, parking)" value={desc} onChange={e => setDesc(e.target.value)} />
        <div className="cost-row">
          <input type="number" placeholder="Kwota" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" />
          <select value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="PLN">PLN</option>
            <option value="ISK">ISK</option>
          </select>
        </div>
        <select value={splitMode} onChange={e => setSplitMode(e.target.value)}>
          <option value="all">Dzielone na 4</option>
          <option value="personal">Tylko moje</option>
        </select>
        <button type="submit">+ Dodaj koszt</button>
      </form>

      <div className="costs-list">
        {costs.map(c => (
          <div key={c.id} className="cost-entry">
            <div className="cost-info">
              <span className="cost-desc">{USERS[c.user]?.emoji} {c.desc}</span>
              <span className="cost-meta">{c.date} | {c.split === 'all' ? '÷4' : 'osobiste'}</span>
            </div>
            <div className="cost-amount">
              <strong>{c.amount.toFixed(0)} {c.currency}</strong>
              {c.user === currentUser && (
                <button className="cost-delete" onClick={() => deleteCost(c.id)}>✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CampingPage() {
  return (
    <div className="page">
      <h2>⛺ Campingi</h2>
      {CAMPING_DATA.map((c, i) => (
        <div key={i} className="camping-card">
          <h3>{c.name}</h3>
          <p><strong>Noc:</strong> {c.night}</p>
          <p><strong>Cena:</strong> {c.price}</p>
          <p><strong>Facilities:</strong> {c.facilities}</p>
          <p><strong>Web:</strong> <a href={`https://${c.website}`} target="_blank" rel="noopener">{c.website}</a></p>
          <p><strong>Tel:</strong> {c.phone}</p>
        </div>
      ))}
    </div>
  )
}

function FaqPage() {
  return (
    <div className="page">
      <h2>❓ FAQ — Islandia</h2>
      {FAQ_DATA.map((f, i) => (
        <div key={i} className="faq-item">
          <h4>{f.q}</h4>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  )
}

function ProtectedRoute({ children }) {
  return getUser() ? <>{children}</> : <Navigate to="/" replace />
}

function Layout({ children }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/route" element={<ProtectedRoute><Layout><RoutePage /></Layout></ProtectedRoute>} />
        <Route path="/packing" element={<ProtectedRoute><Layout><PackingPage /></Layout></ProtectedRoute>} />
        <Route path="/costs" element={<ProtectedRoute><Layout><CostsPage /></Layout></ProtectedRoute>} />
        <Route path="/camping" element={<ProtectedRoute><Layout><CampingPage /></Layout></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><Layout><FaqPage /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App

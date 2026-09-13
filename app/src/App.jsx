import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { TripStatusWidget } from './TripStatusWidget'
import { DAY_MAP_URLS } from './tripSchedule'
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
    mapUrl: DAY_MAP_URLS[0],
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
    mapUrl: DAY_MAP_URLS[1],
  },
  {
    day: 2, date: '18.09', weekday: 'Czw', title: 'Wodospady & Czarne Plaże',
    summary: 'Seljalandsfoss → Skógafoss → Dyrhólaey → Reynisfjara Beach → Skaftafell',
    km: 250, drive: '3h 15min',
    camping: 'Skaftafell Camping',
    points: [
      '08:30 Seljalandsfoss + Gljúfrabúi',
      '10:30 Skógafoss + Kvernufoss',
      '12:30 🧊 Sólheimajökull — Trekking po lodowcu z Sheep Car Rental (przewodnik Szczepan Lizęga, 12k ISK)',
      '15:30 Dyrhólaey — klify bazaltowe',
      '16:45 Reynisfjara Beach ⚠️ SNEAKER WAVES',
      '18:00 Skaftafell Camping (lub nocleg w Vík)',
    ],
    mapUrl: DAY_MAP_URLS[2],
  },
  {
    day: 3, date: '19.09', weekday: 'Pt', title: 'Laguna, Diamenty & Basen Vík',
    summary: 'Jökulsárlón → Diamond Beach → Fjaðrárgljúfur → Basen Vík (lub Sólheimajökull z Vík)',
    km: 270, drive: '3h 30min',
    camping: 'Vík Campsite',
    points: [
      '09:00 Jökulsárlón — laguna lodowcowa, foki',
      '10:30 Diamond Beach — błękitny lód na czarnym piasku',
      '14:00 Fjaðrárgljúfur — baśniowy kanion',
      '17:30 Vík Campsite — rozbicie namiotu, ogrzewana kuchnia',
      '19:00 ♨️ Basen miejski Sundlaug Vík (~30 PLN) — wygrzanie po lodowcu!',
    ],
    mapUrl: DAY_MAP_URLS[3],
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
    mapUrl: DAY_MAP_URLS[4],
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
    mapUrl: DAY_MAP_URLS[5],
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
    mapUrl: DAY_MAP_URLS[6],
  },
]

const CAMPING_DATA = [
  { 
    name: '1. Hvolsvöllur Camping', 
    night: '17→18.09', 
    price: '2 900 ISK/os (Klara 2 000)', 
    website: 'https://tjalda.is/en/hvolsvollur/', 
    facilities: 'Ogrzewana kuchnia, darmowa pralka i suszarka (0 ISK!), prysznic 400 ISK, lasek tłumiący wiatr', 
    phone: '+354 866 8945',
    status: '✅ Otwarty do 01.11 (Walk-in)'
  },
  { 
    name: '2. Skaftafell Camping', 
    night: '18→19.09', 
    price: '2 800 ISK/os (Klara 2 300)', 
    website: 'https://www.vatnajokulsthjodgardur.is/', 
    facilities: 'Darmowe gorące prysznice (0 ISK!), darmowe pralki, darmowy parking po zgłoszeniu rejestracji! ⚠️ BRAK ogrzewanej kuchni (gotowanie z palnika)', 
    phone: '+354 470 8300',
    status: '✅ Całoroczny (Walk-in, zgłosić auto rano o 09:00)'
  },
  { 
    name: '3. Vík Campsite', 
    night: '19→20.09', 
    price: '2 100 ISK/os + 400 ISK namiot', 
    website: 'https://vikcamping.is/', 
    facilities: 'Duża ogrzewana sala kuchenna (30-40 os.), pralki i suszarki (800 ISK), prysznic 300 ISK, Wi-Fi. 500m do basenu Sundlaug Vík!', 
    phone: '+354 487 1345',
    status: '✅ Otwarty do 01.11 (Walk-in)'
  },
  { 
    name: '4. Arnarstapi Camping ⭐', 
    night: '20→21.09', 
    price: '2 500 ISK/os + 400 ISK namiot', 
    website: 'https://parka.is/arnarstapi/', 
    facilities: 'Darmowe prysznice w cenie! Widok na klify i lodowiec. ⚠️ BRAK ogrzewanej kuchni (zlewy na zewnątrz). Awaryjny: Ólafsvík (25 km, pełna kuchnia)', 
    phone: '+354 435 6600',
    status: '✅ Otwarty do 06.10 (Płatność Parka.is)'
  },
  { 
    name: '5. Reykjavík Eco Campsite', 
    night: '21→22.09', 
    price: '3 350 ISK/os (~97 PLN/os ze zniżką online)', 
    website: 'https://reykjavikcampsite.is/', 
    facilities: 'Nowoczesna ogrzewana kuchnia, nielimitowane geotermalne prysznice (0 ISK), darmowa półka z jedzeniem i gazem, obok basenów termalnych', 
    phone: '+354 568 6944',
    status: '✅ Całoroczny (Wymagana rezerwacja online → kod PIN do bramy)'
  },
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
  { q: 'Karta parkingowa Klary (parkingi)?', a: 'W Reykjavíku (strefy P1-P4) z wyłożoną za szybą niebieską kartą parkowanie jest w 100% DARMOWE. W Þingvellir zgłaszamy tablice w Visitor Centre Hakid, by skasować opłatę Parka.is. W Skaftafell parking w cenie kempingu.' },
  { q: 'Zniżki dla opiekuna Klary?', a: 'TAK! Na miejskich basenach termalnych (Sundlaug Vík, Laugardalslaug) oraz w muzeach opiekun osoby z niepełnosprawnością (fylgdarmaður) wchodzi ZA DARMO (100% zniżki) po okazaniu karty Klary!' },
  { q: 'Gdzie obiad D6 (dla Natu & Kuby GF)?', a: '1) Messinn (Reykjavík) — świeże ryby na miedzianych patelniach, bezpieczne dla celiakii. 2) Reykjavík Fish — bezpieczne GF Fish & Chips przy porcie. 3) Kaffi Duus (Keflavík marina) — 5 min od lotniska przed zwrotem RAV4!' },
]

const PACKING_SHARED = [
  { item: 'Szampon (wspólny, max 100ml / kostka)', who: 'Paulina', packed: false },
  { item: 'Płyn do mycia twarzy', who: 'Paulina', packed: false },
  { item: 'Pasta do zębów (duża)', who: 'Natu', packed: false },
  { item: 'Krem do twarzy (ochrona przed wiatrem)', who: 'Natu & Klara', packed: false },
  { item: 'Płyn do mycia / żel pod prysznic', who: 'Klara', packed: false },
  { item: 'Szczotka do włosów', who: 'Klara', packed: false },
  { item: 'Europejska karta parkingowa ("inwalidka" — zniżki Parka!)', who: 'Klara', packed: false },
  { item: 'Suszarka do włosów', who: 'Kuba', packed: false },
  { item: 'Ładowarka 12V rozdzielacz do auta (od taty)', who: 'Klara', packed: false },
  { item: 'Apteczka wyprawowa', who: 'Kuba', packed: false },
  { item: 'Taśma Duct Tape + trytki + naprawczy set', who: 'Kuba', packed: false },
  { item: 'Worki na śmieci mocne (rolka)', who: 'Paulina', packed: false },
  { item: 'Gąbka + mały płyn do naczyń', who: 'Paulina', packed: false },
  { item: 'Folie NRC pod materace (4 szt)', who: 'Kuba', packed: false },
  { item: 'Osłonka aluminiowa na palnik', who: 'Kuba', packed: false },
  { item: 'Shaker do Huela + długi spork', who: 'Kuba', packed: false },
]

const PACKING_PERSONAL = [
  'Korki do uszu (stopery do namiotu!)',
  'Szczoteczka do zębów',
  'Klapki do mycia / Crocsy',
  'Strój kąpielowy (Vík pool, Kvika footbath)',
  'Ręcznik cienki (szybkoschnący mikrofibra)',
  'Ręcznik normalny',
  'Fizyczne prawo jazdy (PLASTIK!)',
  'Karta EKUZ (fizyczna karta!)',
  'Antybiotyk + osobiste lekarstwa',
  'Termos (min. 0.75 L na wrzątek)',
  'Dowód osobisty / paszport',
  'Karta płatnicza z PIN (Revolut/mBank)',
  'Telefon + kabel ładowania',
  'Powerbank (≥10k mAh) → TYLKO PODRĘCZNY!',
  'Czapka merino',
  'Komin / buff × 2',
  'Rękawiczki polarowe + wiatroodporne',
  'Krem z filtrem SPF + pomadka ochronna',
  'Okulary przeciwsłoneczne',
  'Kurtka i spodnie przeciwdeszczowe',
]

// ============ HELPERS ============
const getUser = () => localStorage.getItem('iceland_user')
const setUser = (u) => localStorage.setItem('iceland_user', u)
const clearUser = () => localStorage.removeItem('iceland_user')

const DEFAULT_COSTS = [
  { id: '1', user: 'kuba', desc: 'Auto Sheep Car — zaliczka (4× 263 PLN)', amount: 1052, currency: 'PLN', split: 'all', category: 'Auto', date: 'Wpłacone' },
  { id: '2', user: 'kuba', desc: 'Auto Sheep Car — dopłata KEF (4× 1100 PLN)', amount: 4400, currency: 'PLN', split: 'all', category: 'Auto', date: 'Do opłacenia na KEF' },
  { id: '3', user: 'kuba', desc: 'Airbnb Snorrabraut 71 (pokój 4 os.)', amount: 760, currency: 'PLN', split: 'all', category: 'Nocleg', date: 'Opłacone' },
  { id: '4', user: 'kuba', desc: 'Lot WizzAir w 2 strony (Kuba)', amount: 1200, currency: 'PLN', split: 'personal', category: 'Lot', date: 'Opłacone' },
  { id: '5', user: 'paulinka', desc: 'Lot WizzAir w 2 strony (Paulina)', amount: 1200, currency: 'PLN', split: 'personal', category: 'Lot', date: 'Opłacone' },
  { id: '6', user: 'natu', desc: 'Lot WizzAir w 2 strony (Natalia)', amount: 1200, currency: 'PLN', split: 'personal', category: 'Lot', date: 'Opłacone' },
  { id: '7', user: 'klara', desc: 'Lot WizzAir w 2 strony (Klara)', amount: 1200, currency: 'PLN', split: 'personal', category: 'Lot', date: 'Opłacone' },
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
        <TripStatusWidget isCompact={false} />
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
      <TripStatusWidget isCompact={true} />
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
        <div key={day.day} className="route-day" id={`day-${day.day}`}>
          <div className="day-header">
            <span className="day-badge">D{day.day}</span>
            <div>
              <h3>{day.date} ({day.weekday}) — {day.title}</h3>
              <p className="day-meta">{day.km} km | {day.drive} | ⛺ {day.camping}</p>
            </div>
          </div>
          <p className="day-summary">{day.summary}</p>
          <ul className="day-points">
            {day.points.map((p, i) => {
              // Extract clean place name for direct Google Maps search
              const cleanName = p
                .replace(/^[0-9:]+\s*/, '')
                .replace(/^[^\w\s\u00C0-\u017F]+\s*/, '')
                .split('—')[0]
                .split('(')[0]
                .trim()
              const spotSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName + ', Iceland')}`
              return (
                <li key={i} className="day-point-item">
                  <span className="point-text">{p}</span>
                  <a
                    href={spotSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="point-pin-btn"
                    title={`Pinezka: otwórz ${cleanName} w Google Maps`}
                  >
                    📍
                  </a>
                </li>
              )
            })}
          </ul>
          {day.mapUrl && (
            <a href={day.mapUrl} target="_blank" rel="noopener noreferrer" className="map-link">
              🗺️ Otwórz całą trasę D{day.day} w Google Maps ({day.km} km) →
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
  const [costs, setCosts] = useState(() => getCosts())
  const [loading, setLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('PLN')
  const [splitMode, setSplitMode] = useState('all')
  const [category, setCategory] = useState('Inne')
  const [filter, setFilter] = useState('all') // 'all', 'shared', 'mine'
  const [budgetLimit, setBudgetLimit] = useState(() => {
    return parseFloat(localStorage.getItem('iceland_budget_limit') || '4500')
  })
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [tempBudget, setTempBudget] = useState('4500')
  const currentUser = getUser()

  const ISK_TO_PLN = 0.029

  // Load from Supabase on mount
  useEffect(() => {
    loadCloudCosts()
    const channel = supabase
      .channel('public:expenses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        loadCloudCosts(true)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadCloudCosts(silent = false) {
    if (!silent) setLoading(true)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setCosts(data)
        saveCosts(data)
      }
    } catch (e) {
      console.warn('Offline mode / local cache fallback', e)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const addCost = async (e) => {
    e.preventDefault()
    if (!desc.trim() || !amount) return
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    setIsSyncing(true)
    const newCost = {
      id: Date.now().toString(),
      user: currentUser,
      desc: desc.trim(),
      amount: numAmount,
      currency,
      split: splitMode,
      category,
      date: new Date().toLocaleDateString('pl-PL'),
    }

    const next = [newCost, ...costs]
    setCosts(next)
    saveCosts(next)
    setDesc('')
    setAmount('')

    try {
      await supabase.from('expenses').insert([{
        user: newCost.user,
        desc: newCost.desc,
        amount: newCost.amount,
        currency: newCost.currency,
        split: newCost.split,
        category: newCost.category,
        date: newCost.date,
      }])
    } catch (err) {
      console.error('Supabase save error', err)
    } finally {
      setIsSyncing(false)
      loadCloudCosts(true)
    }
  }

  const deleteCost = async (id) => {
    const next = costs.filter(c => c.id !== id)
    setCosts(next)
    saveCosts(next)
    try {
      await supabase.from('expenses').delete().eq('id', id)
    } catch (err) {
      console.error('Supabase delete error', err)
    }
  }

  const handleSaveBudget = (e) => {
    e.preventDefault()
    const val = parseFloat(tempBudget)
    if (!isNaN(val) && val > 0) {
      setBudgetLimit(val)
      localStorage.setItem('iceland_budget_limit', val.toString())
      setIsEditingBudget(false)
    }
  }

  const toPLN = (amt, curr) => curr === 'ISK' ? amt * ISK_TO_PLN : amt

  // Calculations per user
  const userOwes = { kuba: 0, paulinka: 0, natu: 0, klara: 0 }
  const userPaid = { kuba: 0, paulinka: 0, natu: 0, klara: 0 }

  costs.forEach(c => {
    const pln = toPLN(c.amount, c.currency)
    if (userPaid[c.user] !== undefined) {
      userPaid[c.user] += pln
    }
    if (c.split === 'all') {
      const share = pln / 4
      Object.keys(userOwes).forEach(u => { userOwes[u] += share })
    } else {
      if (userOwes[c.user] !== undefined) {
        userOwes[c.user] += pln
      }
    }
  })

  const mySpent = userOwes[currentUser] || 0
  const remainingBudget = budgetLimit - mySpent
  const budgetPercent = Math.min(100, Math.max(0, Math.round((mySpent / budgetLimit) * 100)))

  const groupTotalPLN = Object.values(userPaid).reduce((s, v) => s + v, 0)
  const groupRemainingPLN = (budgetLimit * 4) - groupTotalPLN

  // Filtered expenses
  const filteredCosts = costs.filter(c => {
    if (filter === 'shared') return c.split === 'all'
    if (filter === 'mine') return c.user === currentUser || c.split === 'all'
    return true
  })

  const CATEGORIES = [
    { label: '⛽ Paliwo', desc: 'Paliwo N1 / Orkan', split: 'all', cat: 'Paliwo' },
    { label: '🛒 Bónus', desc: 'Zakupy Bónus', split: 'all', cat: 'Jedzenie' },
    { label: '⛺ Kemping', desc: 'Kemping', split: 'all', cat: 'Nocleg' },
    { label: '🅿️ Parking', desc: 'Parking Parka.is', split: 'all', cat: 'Parking' },
    { label: '☕ Kawiarnia', desc: 'Kawa / Przekąski', split: 'all', cat: 'Gastronomia' },
    { label: '♨️ Basen', desc: 'Wejście na basen', split: 'all', cat: 'Relaks' },
    { label: '👤 Osobisty', desc: 'Wydatek własny', split: 'personal', cat: 'Osobiste' },
  ]

  return (
    <div className="page">
      <div className="costs-header-row">
        <h2>💰 Wydatki & Budżet</h2>
        <span className="sync-badge">
          {isSyncing ? '🟡 Zapisywanie...' : loading ? '🟡 Ładowanie...' : '🟢 W chmurze'}
        </span>
      </div>

      {/* ===== GAUGE / ILE ZOSTAŁO ===== */}
      <div className="budget-card">
        <div className="budget-top">
          <div>
            <span className="budget-label">Pozostało Ci do wydania:</span>
            <div className={`budget-amount ${remainingBudget < 500 ? 'budget-danger' : remainingBudget < 1200 ? 'budget-warning' : 'budget-ok'}`}>
              {remainingBudget.toFixed(0)} <span className="budget-currency">PLN</span>
            </div>
          </div>
          <button className="budget-edit-btn" onClick={() => { setIsEditingBudget(!isEditingBudget); setTempBudget(budgetLimit.toString()) }}>
            {isEditingBudget ? '✕' : '✏️ Limit'}
          </button>
        </div>

        {isEditingBudget && (
          <form className="budget-edit-form" onSubmit={handleSaveBudget}>
            <input
              type="number"
              value={tempBudget}
              onChange={e => setTempBudget(e.target.value)}
              placeholder="Twój limit (PLN)"
              autoFocus
            />
            <button type="submit">Zapisz</button>
          </form>
        )}

        <div className="progress-bar-bg">
          <div
            className={`progress-bar-fill ${budgetPercent > 90 ? 'bg-danger' : budgetPercent > 70 ? 'bg-warning' : 'bg-ok'}`}
            style={{ width: `${budgetPercent}%` }}
          />
        </div>

        <div className="budget-stats-row">
          <span>Wykorzystano: <strong>{budgetPercent}%</strong> ({mySpent.toFixed(0)} PLN)</span>
          <span>Limit: <strong>{budgetLimit.toFixed(0)} PLN</strong></span>
        </div>

        <div className="group-budget-mini">
          <span>👥 Cała ekipa: wydano <strong>{groupTotalPLN.toFixed(0)} PLN</strong> | zostało: <strong>{groupRemainingPLN.toFixed(0)} PLN</strong></span>
        </div>
      </div>

      {/* ===== KTO ILE WYDAŁ (PODGLĄD GRUPOWY) ===== */}
      <div className="costs-per-user">
        {Object.entries(USERS).map(([k, v]) => {
          const spent = userOwes[k] || 0
          const left = budgetLimit - spent
          return (
            <div key={k} className={`user-cost ${k === currentUser ? 'current-user-card' : ''}`}>
              <div className="user-cost-header">
                <strong>{v.emoji} {v.name}</strong>
                <span className="user-cost-spent">{spent.toFixed(0)} PLN</span>
              </div>
              <span className="user-cost-sub">Zostało: <strong>{left.toFixed(0)} PLN</strong></span>
            </div>
          )
        })}
      </div>

      {/* ===== SZYBKIE DODAWANIE (MOBILE FIRST) ===== */}
      <div className="quick-add-card">
        <h3>+ Dodaj wydatek</h3>

        {/* Quick chips */}
        <div className="category-chips">
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              type="button"
              className="chip-btn"
              onClick={() => { setDesc(c.desc); setSplitMode(c.split); setCategory(c.cat) }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <form className="cost-form" onSubmit={addCost}>
          <input
            placeholder="Opis (np. Paliwo N1, Bónus Selfoss)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            required
          />

          <div className="cost-amount-row">
            <input
              type="number"
              step="any"
              placeholder="Kwota"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="amount-input"
              required
            />
            <div className="currency-toggle">
              <button
                type="button"
                className={`curr-btn ${currency === 'PLN' ? 'active' : ''}`}
                onClick={() => setCurrency('PLN')}
              >
                PLN
              </button>
              <button
                type="button"
                className={`curr-btn ${currency === 'ISK' ? 'active' : ''}`}
                onClick={() => setCurrency('ISK')}
              >
                ISK
              </button>
            </div>
          </div>

          {currency === 'ISK' && amount && (
            <div className="isk-preview">
              ≈ {(parseFloat(amount) * ISK_TO_PLN).toFixed(1)} PLN (kurs 100 ISK = 2.90 PLN)
            </div>
          )}

          <div className="split-toggle-row">
            <button
              type="button"
              className={`split-btn ${splitMode === 'all' ? 'active' : ''}`}
              onClick={() => setSplitMode('all')}
            >
              👥 Wspólne (÷4)
            </button>
            <button
              type="button"
              className={`split-btn ${splitMode === 'personal' ? 'active' : ''}`}
              onClick={() => setSplitMode('personal')}
            >
              👤 Tylko moje
            </button>
          </div>

          <button type="submit" className="submit-cost-btn" disabled={isSyncing}>
            {isSyncing ? 'Zapisuję w chmurze...' : '✓ Zapisz wydatek'}
          </button>
        </form>
      </div>

      {/* ===== LISTA WYDATKÓW Z FILTREM ===== */}
      <div className="history-header">
        <h3>Historia wydatków ({costs.length})</h3>
        <div className="filter-chips">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Wszystkie</button>
          <button className={`filter-btn ${filter === 'shared' ? 'active' : ''}`} onClick={() => setFilter('shared')}>Wspólne</button>
          <button className={`filter-btn ${filter === 'mine' ? 'active' : ''}`} onClick={() => setFilter('mine')}>Moje</button>
        </div>
      </div>

      <div className="costs-list">
        {filteredCosts.length === 0 ? (
          <p className="empty-costs">Brak wydatków w tej kategorii.</p>
        ) : (
          filteredCosts.map(c => {
            const plnVal = toPLN(c.amount, c.currency)
            return (
              <div key={c.id} className="cost-entry">
                <div className="cost-info">
                  <div className="cost-title-row">
                    <span className="cost-user-badge">{USERS[c.user]?.emoji || '👤'} {USERS[c.user]?.name || c.user}</span>
                    <span className="cost-desc">{c.desc}</span>
                  </div>
                  <span className="cost-meta">
                    {c.date} • {c.split === 'all' ? 'Wspólne (÷4)' : 'Osobisty'}
                  </span>
                </div>
                <div className="cost-amount-box">
                  <strong>{c.amount.toLocaleString()} {c.currency}</strong>
                  {c.currency === 'ISK' && (
                    <span className="cost-pln-sub">≈ {plnVal.toFixed(0)} PLN</span>
                  )}
                  {c.split === 'all' && (
                    <span className="cost-share-sub">({(plnVal / 4).toFixed(0)} PLN/os)</span>
                  )}
                  <button
                    className="cost-delete"
                    onClick={() => deleteCost(c.id)}
                    title="Usuń wydatek"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function CampingPage() {
  return (
    <div className="page">
      <h2>⛺ Campingi na Trasie</h2>
      {CAMPING_DATA.map((c, i) => (
        <div key={i} className="camping-card">
          <h3>{c.name}</h3>
          <p><strong>Noc:</strong> {c.night}</p>
          <p><strong>Status:</strong> {c.status}</p>
          <p><strong>Cena:</strong> {c.price}</p>
          <p><strong>Udogodnienia:</strong> {c.facilities}</p>
          <p><strong>Tel:</strong> {c.phone}</p>
          <p><strong>Strona:</strong> <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener">Przejdź do strony kempingu →</a></p>
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

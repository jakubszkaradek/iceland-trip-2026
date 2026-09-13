import React, { useState, useEffect } from 'react'
import { getTripStatus } from './tripSchedule'

export function TripStatusWidget({ isCompact = false }) {
  const [simulatedDate, setSimulatedDate] = useState(null)
  const [status, setStatus] = useState(() => getTripStatus(simulatedDate))
  const [isExpanded, setIsExpanded] = useState(!isCompact)

  useEffect(() => {
    setStatus(getTripStatus(simulatedDate))
    const timer = setInterval(() => {
      setStatus(getTripStatus(simulatedDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [simulatedDate])

  const setSimDay = (dateStr) => {
    setSimulatedDate(new Date(dateStr))
    if (isCompact) {
      setIsExpanded(true)
    }
  }

  const resetRealTime = () => {
    setSimulatedDate(null)
  }

  // Format time HH:MM
  const formatTime = (dateObj) => {
    if (!dateObj) return ''
    const h = dateObj.getUTCHours().toString().padStart(2, '0')
    const m = dateObj.getUTCMinutes().toString().padStart(2, '0')
    return `${h}:${m} GMT`
  }

  if (isCompact && !isExpanded) {
    return (
      <div className="trip-status-compact" onClick={() => setIsExpanded(true)}>
        <div className="compact-left">
          <span className={`live-dot ${status.phase === 'during' ? 'pulse' : ''}`}></span>
          {status.phase === 'before' ? (
            <span className="compact-text">
              ⏳ Do startu: <strong>{status.countdown.days}d {status.countdown.hours}h {status.countdown.minutes}m</strong>
            </span>
          ) : status.currentEvent ? (
            <span className="compact-text">
              {status.currentEvent.icon} <strong>{status.currentEvent.title}</strong> ({formatTime(status.currentEvent.start)}–{formatTime(status.currentEvent.end)})
            </span>
          ) : (
            <span className="compact-text">🇮🇸 Wyprawa na Islandię</span>
          )}
        </div>
        <div className="compact-right">
          {simulatedDate && <span className="sim-indicator">🔮 SIM</span>}
          <button className="compact-toggle-btn" title="Rozwiń szczegóły">▼</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`trip-status-card ${isCompact ? 'compact-mode' : ''}`}>
      <div className="status-card-header">
        <div className="status-badge-row">
          <span className={`status-badge ${status.phase}`}>
            {status.phase === 'before' ? '⏳ DO WYJAZDU' : status.phase === 'after' ? '🏁 KONIEC' : '🟢 NA ŻYWO'}
          </span>
          <span className="time-clocks">
            🇮🇸 {status.timeStrIceland} • 🇵🇱 {status.timeStrPoland}
          </span>
        </div>
        {isCompact && (
          <button className="compact-close-btn" onClick={() => setIsExpanded(false)} title="Zwiń">▲</button>
        )}
      </div>

      {status.phase === 'before' ? (
        <div className="countdown-section">
          <div className="countdown-grid">
            <div className="countdown-box">
              <span className="num">{String(status.countdown.days).padStart(2, '0')}</span>
              <span className="label">DNI</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-box">
              <span className="num">{String(status.countdown.hours).padStart(2, '0')}</span>
              <span className="label">GODZ</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-box">
              <span className="num">{String(status.countdown.minutes).padStart(2, '0')}</span>
              <span className="label">MIN</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-box highlight">
              <span className="num">{String(status.countdown.seconds).padStart(2, '0')}</span>
              <span className="label">SEK</span>
            </div>
          </div>

          <div className="next-event-banner">
            <span className="banner-sub">Pierwszy krok:</span>
            <strong>✈️ 16.09 (Śr), 20:55 — Wylot WizzAir W6 1501 z Warszawy</strong>
          </div>
        </div>
      ) : status.phase === 'after' ? (
        <div className="after-trip-banner">
          <h3>🇮🇸 Wyprawa zakończona sukcesem!</h3>
          <p>Dziękujemy za wspólne odkrywanie Islandii!</p>
        </div>
      ) : (
        <div className="live-event-section">
          {status.currentEvent ? (
            <div className="current-event-box">
              <div className="event-title-row">
                <span className="event-icon">{status.currentEvent.icon}</span>
                <div>
                  <span className="event-day-tag">{status.currentEvent.dayLabel}</span>
                  <h3 className="event-title">{status.currentEvent.title}</h3>
                </div>
              </div>

              <div className="event-time-location">
                <span>🕒 {formatTime(status.currentEvent.start)} – {formatTime(status.currentEvent.end)}</span>
                <span>📍 {status.currentEvent.location}</span>
              </div>

              <p className="event-desc">{status.currentEvent.description}</p>

              {status.currentEvent.next && (
                <div className="next-up-row">
                  <span className="next-tag">Następnie:</span>
                  <span className="next-title">{status.currentEvent.next}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="between-events-box">
              <p>🚗 Przejazd / przerwa w trasie</p>
              {status.nextEvent && (
                <p>Kolejny punkt: <strong>{status.nextEvent.title}</strong> ({formatTime(status.nextEvent.start)})</p>
              )}
            </div>
          )}

          {/* Pasek postępu */}
          <div className="trip-progress-container">
            <div className="progress-labels">
              <span>Postęp całej wyprawy:</span>
              <strong>{status.tripProgress}%</strong>
            </div>
            <div className="trip-progress-bg">
              <div className="trip-progress-fill" style={{ width: `${status.tripProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Symulator godzinówki */}
      <div className="simulator-bar">
        <div className="simulator-header">
          <span>🔮 Symulator trasy (kliknij punkt):</span>
          {simulatedDate && (
            <button className="reset-sim-btn" onClick={resetRealTime}>🔴 Czas realny</button>
          )}
        </div>
        <div className="sim-chips">
          <button className="sim-btn" onClick={() => setSimDay('2026-09-16T21:30:00+02:00')}>D0 Lot WAW</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-17T09:45:00+00:00')}>D1 Þingvellir</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-17T12:00:00+00:00')}>D1 Geysir</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-17T16:00:00+00:00')}>D1 Bónus</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-18T13:00:00+00:00')}>D2 Lodowiec</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-18T17:00:00+00:00')}>D2 Reynisfjara</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-19T10:00:00+00:00')}>D3 Diamenty</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-19T19:30:00+00:00')}>D3 Basen Vík</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-20T16:00:00+00:00')}>D4 Klify</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-21T12:30:00+00:00')}>D5 Kirkjufell</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-21T21:00:00+00:00')}>D5 Kvika Footbath</button>
          <button className="sim-btn" onClick={() => setSimDay('2026-09-22T13:30:00+00:00')}>D6 Obiad GF</button>
        </div>
      </div>
    </div>
  )
}

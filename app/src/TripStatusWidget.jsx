import React, { useState, useEffect } from 'react'
import { getTripStatus, TRIP_EVENTS } from './tripSchedule'

export function TripStatusWidget({ isCompact = false }) {
  const [simulatedIndex, setSimulatedIndex] = useState(null)
  const [status, setStatus] = useState(() => getTripStatus(null))
  const [isExpanded, setIsExpanded] = useState(!isCompact)

  useEffect(() => {
    const update = () => {
      if (simulatedIndex === null) {
        setStatus(getTripStatus(null))
      } else {
        const ev = TRIP_EVENTS[simulatedIndex]
        if (ev) {
          const midTime = new Date((ev.start.getTime() + ev.end.getTime()) / 2)
          setStatus(getTripStatus(midTime))
        }
      }
    }
    update()
    const timer = setInterval(() => {
      if (simulatedIndex === null) {
        setStatus(getTripStatus(null))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [simulatedIndex])

  const handlePrev = (e) => {
    e?.stopPropagation()
    if (simulatedIndex === null) return
    if (simulatedIndex === 0) {
      setSimulatedIndex(null)
    } else {
      setSimulatedIndex(simulatedIndex - 1)
    }
  }

  const handleNext = (e) => {
    e?.stopPropagation()
    if (simulatedIndex === null) {
      setSimulatedIndex(0)
    } else if (simulatedIndex < TRIP_EVENTS.length - 1) {
      setSimulatedIndex(simulatedIndex + 1)
    }
  }

  const resetRealTime = (e) => {
    e?.stopPropagation()
    setSimulatedIndex(null)
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
      <div className="trip-status-compact">
        <button
          type="button"
          className="compact-arrow-btn"
          onClick={handlePrev}
          disabled={simulatedIndex === null}
          title="Poprzedni krok"
        >
          ◀
        </button>

        <div className="compact-center-content" onClick={() => setIsExpanded(true)}>
          <span className={`live-dot ${status.phase === 'during' ? 'pulse' : ''}`}></span>
          {simulatedIndex !== null ? (
            <span className="compact-text">
              <span className="sim-badge">SIM {simulatedIndex + 1}/{TRIP_EVENTS.length}</span> <strong>D{TRIP_EVENTS[simulatedIndex].day}</strong> {TRIP_EVENTS[simulatedIndex].icon} {TRIP_EVENTS[simulatedIndex].title}
            </span>
          ) : status.phase === 'before' ? (
            <span className="compact-text">
              ⏳ Do startu: <strong>{status.countdown.days}d {status.countdown.hours}h {status.countdown.minutes}m</strong>
            </span>
          ) : status.currentEvent ? (
            <span className="compact-text">
              {status.currentEvent.icon} <strong>{status.currentEvent.title}</strong>
            </span>
          ) : (
            <span className="compact-text">🇮🇸 Wyprawa na Islandię</span>
          )}
        </div>

        <button
          type="button"
          className="compact-arrow-btn"
          onClick={handleNext}
          disabled={simulatedIndex !== null && simulatedIndex >= TRIP_EVENTS.length - 1}
          title="Następny krok"
        >
          ▶
        </button>

        <button
          type="button"
          className="compact-toggle-btn"
          onClick={() => setIsExpanded(true)}
          title="Rozwiń szczegóły"
        >
          ▼
        </button>
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
            <span className="banner-sub">Pierwszy krok wyprawy:</span>
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

      {/* Kompaktowy stepper z nawigacją strzałkami */}
      <div className="stepper-bar">
        <div className="stepper-nav-row">
          <button
            type="button"
            className="stepper-nav-btn"
            onClick={handlePrev}
            disabled={simulatedIndex === null}
            title="Poprzedni krok"
          >
            ◀
          </button>

          <div className="stepper-nav-center">
            {simulatedIndex === null ? (
              <div className="stepper-label-live">
                <span className="live-dot pulse"></span>
                <span>CZAS REALNY (ODLICZANIE)</span>
              </div>
            ) : (
              <div className="stepper-label-step">
                <span className="stepper-step-badge">Krok {simulatedIndex + 1} / {TRIP_EVENTS.length}</span>
                <span className="stepper-step-title">
                  {TRIP_EVENTS[simulatedIndex].icon} D{TRIP_EVENTS[simulatedIndex].day}: {TRIP_EVENTS[simulatedIndex].title}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="stepper-nav-btn"
            onClick={handleNext}
            disabled={simulatedIndex !== null && simulatedIndex >= TRIP_EVENTS.length - 1}
            title="Następny krok"
          >
            ▶
          </button>
        </div>

        {simulatedIndex !== null && (
          <div className="stepper-reset-row">
            <button type="button" className="reset-sim-btn" onClick={resetRealTime}>
              🔴 Przywróć czas realny
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

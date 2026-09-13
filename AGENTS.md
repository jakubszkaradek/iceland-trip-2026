# AGENTS.md — Iceland Trip Planner (busy-bardeen)

## Projekt
Planowanie wycieczki na Islandię (16-22 września 2026) dla 4 osób: Kuba, Paulina, Natalia, Klara.

## Osoby
- **Kuba** (user/orchestrator): 180cm/85kg, celiakia (bezglutenowo!), prowadzi auto
- **Paulina**: 167cm/65kg, dziewczyna Kuby
- **Natalia (Natu)**: koleżanka, MUSI WYROBIĆ EKUZ
- **Klara**: koleżanka

## Kluczowe daty
- **Wylot**: 16.09 o 20:55 WizzAir z Warszawy → Keflavik (~23:00 IST)
- **Powrót**: 22.09 o ~23:50 z Keflavik → Warszawa
- **Airbnb noc 0**: Snorrabraut 71, Reykjavik (750 PLN)
- **Auto**: Sheep Car Rental — Toyota RAV4 4x4 + pełen pakiet campingowy

## Bagaż
- 4× walizka kabinowa: 55×40×23cm
- 4× bagaż podręczny: 40×30×20cm
- Roof box 330L na aucie

## Żelazne zasady agenta
1. **Język**: Odpowiadaj po polsku (chyba że user pisze po angielsku)
2. **Caveman mode**: Aktywny — skrócona, zwięzła komunikacja
3. **Celiakia**: KAŻDE jedzenie musi być weryfikowane pod kątem glutenu
4. **Koszty**: Studencki budżet — optymalizuj, nie przepłacaj
5. **Nie kończ pracy** dopóki user nie zaakceptuje planu
6. **Web app**: Buduj DOPIERO po akceptacji planu
7. **Fizyczne prawo jazdy**: Plastik, nie mObywatel
8. **Revolut**: Apple/Google Pay + fizyczna karta mBank z PIN

## Struktura projektu
```
busy-bardeen/
├── AGENTS.md                  # Ten plik
├── gemini_conversation.txt    # Ekstrakt z 16-stronnej konwersacji z Gemini
├── assets/                    # Screeny, zdjęcia, linki od usera
├── agency/                    # Oddziały agency-agents (project-management, research, strategy, specialized)
├── plan/                      # Kompletny zestaw 9 plików markdown z planem
└── app/                       # Web app (Vite + React)
```

## Źródła wiedzy
- `gemini_conversation.txt` — 2173 linii szczegółowej analizy sprzętu, trasy, jedzenia
- Konwersacja z koleżanką Pauliny (w PDF) — recenzje campingów, tips
- Plan Natalii — 6-dniowy itinerary z atrakcjami
- Sheep Car Rental: https://sheepcarrental.com/
- Camping apps: Parka.is, EasyPark (parkingi)

## Auto — Sheep Car Rental
- Toyota RAV4 4x4 (potwierdzone)
- Zawarte: WiFi router, kuchenka gazowa, 4 krzesełka, roof box 330L
- 2× materac dmuchany 140cm, namiot 4-os (2 sypialnie)
- Zestaw kuchenny, 4× śpiwór + poduszka, 3 butle gazu
- Ubezpieczenie opon + szyb + F-roads
- 4 kierowców (1 w cenie + 3× 2000 ISK)
- Zaliczka wpłacona, reszta na miejscu
- Zniżka 25% (konkurs)

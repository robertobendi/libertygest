# CybHotel (eRoomNetwork) — Deep Analysis & LibertyGest Reference

**URL:** https://admin.eroomnetwork.com
**Vendor:** Antoptima SA (cybhotel.com)
**Analysis Date:** 2026-04-13
**Hotel Instance:** "Test CH" (user: rocco_lettieri)
**Property:** 59 rooms across 10 floors, 8 room types
**Booking Engine:** booking.eroomnetwork.com?hotel_ext_id=512

---

## TABLE OF CONTENTS

1. [Complete Feature Inventory](#1-complete-feature-inventory)
2. [UX/UI Analysis](#2-uxui-analysis)
3. [Strengths](#3-strengths)
4. [Weaknesses & Improvement Opportunities](#4-weaknesses--improvement-opportunities)
5. [Architectural Observations](#5-architectural-observations)
6. [Recommendations for LibertyGest](#6-recommendations-for-libertygest)

---

## 1. COMPLETE FEATURE INVENTORY

### 1.1 Navigation Structure

The application uses a fixed left sidebar with icons + text labels. Top-level items are direct links; grouped items are collapsible dropdowns.

#### Direct Links (top-level)
| Label | Route |
|---|---|
| Dashboard | `/dashboard` |
| Piano camere (Room Floor Plan) | `/` (homepage) |
| Calendario prezzi e disponibilita | `/calendar` |
| Nuova prenotazione | `/reservation` |
| Restrizioni | `/restrictions` |
| Gestisci gli utenti | `/users/manage` |
| Sale riunioni | `/meeting_rooms` |
| Apricancello | `/gate_opener` |
| Aiuto | `/ticket` |

#### Dropdown: Prenotazioni
| Label | Route |
|---|---|
| Elenco delle prenotazioni | `/reservations/list` |
| Prenotazioni incomplete | `/reservations/incomplete` |
| Tutti gli ordini | `/reservations/orders` |
| Ordini non pagati | `/reservations/unpaid_orders` |
| Pagamenti da riscuotere da OTA | `/reservations/ota_collected` |
| Rimborsi | `/reservations/to_be_reimbursed` |
| Colazioni | `/reservations/breakfasts` |
| Supplementi a calendario | `/reservations/calendar_extras` |
| Importazione di massa | `/reservations/bulk` |
| Richieste di servizi convenzionati | `/partner_services_requests` |

#### Dropdown: Tariffe
| Label | Route |
|---|---|
| Piani tariffari | `/pricing/rates` |
| Gestione dei prezzi | `/pricing/management` |
| Algoritmo dei prezzi | `/pricing/algo_points` |
| Supplementi | `/pricing/supplements` |
| Tasse locali | `/pricing/visitors_tax` |
| I.V.A. | `/pricing/manage_vat` |

#### Dropdown: Sconti
| Label | Route |
|---|---|
| Promozioni | `/promo/promotions` |
| Voucher | `/promo/vouchers` |

#### Dropdown: Indisponibilita
| Label | Route |
|---|---|
| Camere | `/unavailability/rooms` |
| Supplementi | `/unavailability/extra` |

#### Dropdown: OTAs
| Label | Route |
|---|---|
| Impostazioni | `/otas` |
| Pagamenti da riscuotere da OTA | `/reservations/ota_collected` |

#### Dropdown: Statistiche
| Label | Route |
|---|---|
| Pernottamenti | `/stats/overnights` |
| Introito | `/stats/income` |
| Marketing | `/stats/marketing` |
| Sales | `/stats/sales` |
| Clienti | `/stats/clients` |
| Voti e commenti | `/stats/ratings` |
| Dettagli delle prenotazioni | `/stats/details` |
| KPI | `/economic_cockpit` |

#### Dropdown: Report
| Label | Route |
|---|---|
| Check-in | `/report/checkin` |
| Income | `/report/income` |
| Touristic | `/report/touristic` |

#### Dropdown: App per la pulizia
| Label | Route |
|---|---|
| Gestione stanze | `/housekeeping` |
| Previsioni | `/housekeeping/forecast` |
| Storico | `/housekeeping/history` |
| Gestisci staff | `/housekeeping/manage_staff` |

#### Dropdown: Gestore di contenuti
| Label | Route |
|---|---|
| Camere | `/content_manager/rooms` |
| Termini generali e condizioni | `/content_manager/terms` |
| Privacy policy | `/content_manager/disclaimers` |
| Conferma della prenotazione | `/content_manager/confirmation` |
| Gestione email personalizzate | `/content_manager/custom_emails` |
| Vetrina | `/content_manager/showcase` |
| Servizi convenzionati | `/content_manager/partner_services` |
| News/Posts | `/content_manager/posts` |
| Colazione (extra edit) | `/pricing/edit_extra?extra_id=3` |
| Piscina (extra edit) | `/pricing/edit_extra?extra_id=4` |
| No daily clean (extra edit) | `/pricing/edit_extra?extra_id=6` |
| Animali domestici (extra edit) | `/pricing/edit_extra?extra_id=7` |
| Tassa di soggiorno (extra edit) | `/pricing/edit_extra?extra_id=1` |
| Tassa di promozione turistica (extra edit) | `/pricing/edit_extra?extra_id=2` |

#### Dropdown: Gestione hotel
| Label | Route |
|---|---|
| Impostazioni | `/hotel_management/settings` |
| Tipologie di stanze | `/hotel_management/room-types` |
| Camere | `/hotel_management/rooms` |

---

### 1.2 Dashboard (`/dashboard`)

**Widgets displayed:**
- **Situazione pulizie**: Count tiles for "Richiede check-out", "Da pulire e controllare", "Da controllare", "Libera e pulita"
- **Situazione pagamenti ordini**: "Pagato Oggi" (CHF), "Pagamenti in scadenza" (CHF), "Pagamenti scaduti" (CHF)
- **Check-in / Checkout**: Daily totals
- **Occupazione**: Per-room-type breakdown (occupied / total)
- **Biancheria**: Linen requirements by room type
- **Extra**: Summary of additional services in use

---

### 1.3 Piano Camere — Room Floor Plan (`/`)

Primary operational view — a Gantt-style grid.

**Controls:**
- Date range selector: "Dal" / "Al" + "Mostra" button
- View modes: Basic / Advanced toggle; Standard / Compact toggle
- Sort by: Piano (floor) or Tipologia (room type)
- Per-floor collapsible sections ("Nascondi" button)

**Grid cells:**
- Reservation ID + guest name when occupied
- Color-coded by status
- Hover tooltip: room type + status (e.g., "Doppia Superiore - Libera e pulita")

**Bottom summary:**
- Free rooms and occupancy % per date, per room type

**Room inventory:**
| Abbreviation | Full Name | Count |
|---|---|---|
| Si.Vi.Ci. | Singola Vista Citta | 6 |
| Do. | Doppia Standard | 18 |
| Do.Su. | Doppia Superiore | 16 |
| Tr.St. | Tripla Standard | 4 |
| Qu.St. | Quadrupla Standard | 5 |
| Su. | Suite | 2 |
| Ju.Su. | Junior Suite | 3 |
| Do.Le.si. | Twin (Doppia Letti singoli) | 5 |
| **Total** | | **59** |

Room numbering convention: first digit = floor number (room 25 = floor 2, room 5).

---

### 1.4 Calendario Prezzi e Disponibilita (`/calendar`)

Calendar grid showing per room type, per date:
- Availability count (rooms available)
- Price per night
- Inline editable: modify availability and calendar values
- Filterable by date range
- Rows = room types; Columns = dates

---

### 1.5 Nuova Prenotazione (`/reservation`)

**Form fields (one room block, repeatable via "Aggiungi camera"):**
- Data d'arrivo (date picker)
- Data di partenza (date picker)
- room_request[N] → specific_room: combobox ("Qualsiasi tipo" + all 8 room types)
- num_adults: spinbutton (1–4)
- num_kids: spinbutton (0–3)

**Buttons:**
- "Aggiungi camera" — adds a second room block
- "Verificare la disponibilita" — submits availability search

**Booking link shown:** `booking.eroomnetwork.com?hotel_ext_id=512`

**Offer selection screen (`/select_offer`):**
- Sidebar summary: Arrivo, Partenza, Notti, Adulti, Bambini, Camera count
- Results table: up to 23 offers (all room types × all applicable rate plans)
- Price range example: 162 CHF (Doppia Non rimborsabile) → 1,000 CHF (Suite All inclusive)
- "Mostra/nascondi dettagli" per offer for per-night breakdown
- "Seleziona offerta" submit per row

---

### 1.6 Reservation Detail

**Sample reservation 138217575347:**
- Guest: John McDoe, antoptima.sa@gmail.com, +41912224028, Country: CH
- Room: 95 - Twin
- Channel: Admin
- Payment status: Completamente pagato
- Check-in status: Abilitato
- Dates: 10/04/2026 → 14/04/2026
- Amount: 496.00 CHF
- Rimborsi: 0.00

---

### 1.7 Elenco Prenotazioni (`/reservations/list`)

**Filters:**
- Date range Dal/Al
- Data di riferimento: Check-in / Booking date toggle
- Canale di provenienza (source channel)
- Reservation number, guest name, confirmation status, email

**Table columns:**
Numero di prenotazione, Data di arrivo, Data di partenza, Email, Nazionalita, Camere, Canale, Azioni

---

### 1.8 Ordini / Orders (`/reservations/orders`)

**Filters:** Date range, reference date / order date, payment type, order status

**Table columns:**
Prev., #, Tipo, Stato del pagamento, Tatt., Ammontare, Ospite, Riferimento fattura, Data emissione documento fiscale, Data di scadenza, Actions

---

### 1.9 Statistiche — Dettagli delle Prenotazioni (`/stats/details`)

**7 date reference options:**
1. Booking date
2. Arrival date
3. Overnight date
4. Check-in date
5. Check-out date
6. Invoice date
7. Payment date

**~20 sortable columns** with export functionality.

**Advanced filters:**
- Reservation number
- Guest name
- Channel
- Payment status
- Check-in status
- Invoice reference
- Cancellation

---

### 1.10 Colazioni / Breakfasts (`/reservations/breakfasts`)

- Filter by date and reservation number
- Table: Colazione, Ospite, Modello, Notte, Numero di prenotazione, Data dell'ordine

---

### 1.11 Piani Tariffari (`/pricing/rates`)

**Rate list table columns:**
Titolo, Tipologia (Primario/Derivato), Supplementi inclusi, Tipi di stanza, Piano delle restrizioni, Politiche di cancellazione, Attivo, Modifica

**5 existing plans:**
| Name | Type | Modification |
|---|---|---|
| Standard | Primary | — |
| Non rimborsabile | Derived | -10% |
| Colazione inclusa | Derived | +15 CHF (absolute) |
| All inclusive | Primary | — |
| All inclusive derived | Derived | +50% |

**Rate Edit Form (`/pricing/rate/{id}`) — all fields:**
- Titolo (text)
- Attivo (checkbox)
- Supplementi inclusi (checkboxes): Breakfast, Pool, No daily clean, Pets
- Tipologie di stanze (checkboxes for all 8 room types)
- Tipologia: combobox — "Primario" or "Derivato"
- If Derivato:
  - Piano primario di riferimento (combobox — select parent plan)
  - Variazione (spinbutton + unit selector: CHF absolute or % percentage)
- Piano delle restrizioni (combobox — link to a restriction plan)
- Politiche di cancellazione: table of rows "≥ N giorni → rimborso X%" with "Aggiungi nuovo livello" button and per-row remove. Zero rows = non-refundable.
- Save button: "Aggiorna" (edit) or "Crea" (new)

---

### 1.12 Gestione dei Prezzi (`/pricing/management`)

**Rate selector** at top (Primary plans only — Derived plans are not selectable here).

**Section: Valori di default**
Table per room type with spinbuttons:
- Prezzo minimo
- Prezzo massimo
- Sconto per persona

**Default values example:**
| Room Type | Min | Max |
|---|---|---|
| Singola | 130 | 200 |
| Doppia Standard | 80 | 100 |
| Doppia Superiore | 100 | 200 |

**Section: Valori a calendario**
- Toggle: "Modalita a calendario" (cell-by-cell) / "Modalita di massa" (bulk override with day-of-week checkboxes)
- Calendar grid: each cell has 3 spinbuttons (min price, max price, per-person discount)
- Date range filter

---

### 1.13 Algoritmo dei Prezzi (`/pricing/algo_points`)

**Three input scoring tables (all values editable):**

1. **Occupazione** (4 bands):
   - 0–11% → 2 pts
   - 11–20% → 3 pts
   - 20–41% → 7 pts
   - 41–59% → 9 pts

2. **Intervalli di tempo / Lead time** (4 bands):
   - 0–10 days → 10 pts
   - 10–30 days → 8 pts
   - 30–60 days → 4 pts
   - 60+ days → 0 pts

3. **Fine settimana** (single value):
   - Weekend → 4 pts

**Logic:** Points from all three tables are summed. The total is interpolated between the min and max price configured per room type for the matching rate plan.

**Sommario:** 32-cell matrix (4 occupancy bands × 4 lead-time bands × 2 day types: weekday/weekend) with gauge chart indicators per cell, showing the projected price level for each combination.

---

### 1.14 Supplementi (`/pricing/supplements`)

**Tab selector per extra type:**
- Colazione (Breakfast)
- Piscina (Pool)
- No daily clean
- Animali domestici (Pets)

**Per tab:** Date-range pricing rows with columns Dal, Al, Prezzo. Rows are addable and removable.

**Limitation:** New extra types can only be created by contacting CybHotel support — not self-service.

---

### 1.15 Tasse Locali / Visitors Tax (`/pricing/visitors_tax`)

Same structure as Supplements. Tabs:
- Tassa di soggiorno
- Tassa di promozione turistica

---

### 1.16 I.V.A. (`/pricing/manage_vat`)

Combobox per category. Available rates: 7.7%, 3.7%, 2.5%, 0%.

| Category | Default VAT |
|---|---|
| Camera | 3.7% |
| Colazione | 0% (confirmed from agent) / 8% (from original analysis — verify) |
| Piscina | 2.5% |
| No daily clean | 0% |
| Animali domestici | 2.5% |
| Tassa di soggiorno | 0% |
| Tassa di promozione turistica | 0% |

---

### 1.17 Promozioni (`/promo/promotions`)

**Promotion create/edit form — all fields:**
- Nome promozione (text)
- Attivo (checkbox)
- Cumulabile con altre promozioni (checkbox — stackable with other promos)
- Prenotazione da / Prenotazione a (booking date window)
- Soggiorno da / Soggiorno a (stay date window)
- Date di soggiorno escluse (interactive calendar — click to exclude specific dates)
- Promozione last minute (yes/no toggle, then: N giorni or N ore threshold)
- Notti minime (spinbutton)
- Notti massime (spinbutton)
- Sconto % (spinbutton)
- Valido per Kiosk (checkbox)
- Validita su webapp: combobox — Tutti / Utenti registrati / Utenti business / Nessuno
- Utenti specifici: dual listbox to assign promo to specific user accounts
- Tipologie di stanze (checkboxes per room type)
- Tariffe (checkboxes per rate plan)

---

### 1.18 Voucher (`/promo/vouchers`)

**Filter:** Valido / Scaduto / Usato

**Bulk generation:** Number of vouchers spinbutton + "Genera voucher" button

**Per voucher fields:**
- Codice promozionale (auto-generated code)
- Valido dal (start date)
- Valido fino a (end date)
- Tipo: combobox — Sconto % / Sconto CHF / Prezzo totale / Prezzo per notte
- Valore (value)
- Extra checkboxes (which extras are included)
- Tipologie di stanze checkboxes

---

### 1.19 Indisponibilita Camere (`/unavailability/rooms`)

- Filter: Corrente e attivo / Visuale
- List of unavailable room blocks with dates and notes
- "Crea nuova indisponibilita" button
- Color-coded status indicators

---

### 1.20 Restrizioni (`/restrictions`)

**Controls:**
- Piano delle restrizioni selector (named restriction plans)
- View modes: "Modifica a calendario" / "Modifica di massa"
- Date range filter

**Grid:** Restriction types × room types × dates

**Restriction types available:**
- Soggiorno minimo / massimo (min/max stay nights)
- Finestra di prenotazione (booking lead-time window)
- Giorno di arrivo consentito (check-in allowed days)
- Giorno di partenza consentito (check-out allowed days)
- Color-coded cells: green, yellow, red, gray

---

### 1.21 OTA Settings (`/otas`)

- **Valori di default**: Max OTA availability per room type (Singola: 4, Doppia Standard: 7, etc.)
- **Tassa di soggiorno**: Currently "Escluso" — changing this requires contacting support
- **Incremento prezzo**: 20% markup over base price for OTA channels
- **Moneta del prezzo**: CHF
- **Valori a calendario**: Calendar overrides for OTA availability

---

### 1.22 Statistiche — Pernottamenti (`/stats/overnights`)

- Monthly reference period
- Breakdown: Nazione di residenza, Giorno, Totale
- Sub-categories: Svizzeri vs. Stranieri; Adulti vs. Minori
- Exportable

---

### 1.23 Statistiche — Introito (`/stats/income`)

- Period selection (monthly or custom)
- Breakdown columns: Periodo, Tipo, Camera, Tassa di soggiorno, Tassa di promozione turistica, Colazione, Piscina, No daily clean, Animali domestici
- Includes refunds and VAT components

---

### 1.24 Statistiche — Marketing (`/stats/marketing`)

Three sections:
1. **Sommario**: Pie/donut charts for booking sources (by reservation date vs. arrival date), CHF revenue, room count
2. **Riepilogo mensile**: Bar chart comparing channels over months
3. **Confronti**: Channel comparison table (Direct, Booking.com, etc.) with metrics

---

### 1.25 Statistiche — Sales (`/stats/sales`)

- Period with weekly breakdown
- Occupazione per room type: Disp. / Occ. / %
- Columns: Camere Totali, B&B, Other, Notte media (avg nightly rate)
- Year-over-year comparison available

---

### 1.26 Statistiche — Clienti (`/stats/clients`)

- **Aggrega per**: Cognome, Citta, Regione, Nazione, Continente, Lingua, Canale, Azienda, E-mail
- Table: Nome, Cognome, Ammontare, Notti, Prenotazioni
- Per-client action buttons (search icons for drill-down)
- Export functionality

---

### 1.27 Statistiche — Voti e Commenti (`/stats/ratings`)

- Filter: date range, Riferimento Valutazione
- Chart: Voto medio per mese (line chart)
- Table: Floor #, Data arrivo, Data partenza, Cognome, Riferimento Valutaz., Actions

---

### 1.28 KPI (`/economic_cockpit`)

**11 metrics tracked:**
1. Occ% (Occupancy percentage)
2. RN (Room Nights)
3. Av. Rooms (Available Rooms)
4. ADR (Average Daily Rate)
5. ARG (Average Rate with extras)
6. REVPAR (Revenue per Available Room)
7. TREVPAR (Total Revenue per Available Room)
8. BW (Booking Window)
9. Pick up (recent booking pace)
10. Ricavi stanze (Room revenue)
11. Tot ricavi (Total revenue)

**Per metric:** Yesterday / MTD / YTD values with color-coded % change

**Chart options:** Giornaliera / Settimanale / Mensile / Annuale aggregation

**Date range:** Year + month selectors

---

### 1.29 Report — Check-in (`/report/checkin`)

- Date selector per check-in date
- "Genera il rapporto di ieri" button
- "Scarica rapporto" (download PDF/export)
- List of dates with generation status icons

---

### 1.30 Report — Income (`/report/income`)

- Monthly date selector
- Export buttons
- Historical report list

---

### 1.31 Report — Touristic (`/report/touristic`)

- Monthly date selector
- "Scarica rapporto" functionality
- Historical report list (likely ISTAT/Swiss HESTA compliance)

---

### 1.32 Housekeeping — Gestione Stanze (`/housekeeping`)

**Stats bar:**
- Ritardo check-out: 4
- Da pulire a fondo: 3
- Da rassettare: 0
- Occupata e pulita: 0
- Libera e pulita: 52

**Dedicated staff URL:** `housekeeping.eroomnetwork.com?hotel_ext_id=512`

**Per room card shows:**
- Room number (large)
- Room type
- Booking reference
- Cleaning schedule
- Status with color coding

**Status update interaction:** Clicking a room triggers `window.confirm("Aggiorna lo stato della stanza nr. X?")` — a browser-native dialog. Simple yes/no only. No rich UI, no status selection.

**Notes panel:** Maintenance notes per room

---

### 1.33 Housekeeping — Previsioni (`/housekeeping/forecast`)

- Grid: columns = room types, rows = dates
- Per cell: Da pulire a fondo (N), Da rassettare (N), Occupata (N)
- Legend: "Uscita e linde" (checkout clean), "In ricambio" (turnover), "Prevista" (forecast)

---

### 1.34 Housekeeping — Storico (`/housekeeping/history`)

- Date range filter
- Dropdowns: Camera / Stato da / Stato a / Utente
- Table: Data, Camera, Stato da, Stato a, Utente

---

### 1.35 Housekeeping — Gestisci Staff (`/housekeeping/manage_staff`)

- "Crea nuovo membro" button
- Table: E-mail, Livello (Level), Gestisci, Modifica, Cambia la password

---

### 1.36 Content Manager — Camere (`/content_manager/rooms`)

**Language tabs:** IT / EN / FR / DE

**Per room type:**
- Nome visualizzato (text — DISABLED, read-only)
- Descrizione (text area — DISABLED)
- Caratteristiche (checkboxes — DISABLED)
- Letti (bed config — DISABLED)
- Immagini (3 photo slots — DISABLED)

**Critical finding: ALL FIELDS ARE DISABLED on this page.** The page serves as a read-only display. Content editing is not possible from the CMS UI.

---

### 1.37 Content Manager — Conferma della Prenotazione (`/content_manager/confirmation`)

**Tabs:** Corpo email, Regole cancellazione, Informazioni Generali, Preview

**Available template variables:**
- `{customerFirstName}`, `{customerLastName}`
- `{hotelName}`
- `{checkinDate}`, `{checkoutDate}`
- `{orderReservationNumber}`

**Example cancellation rules configured:**
- 100% refund if cancelled ≥ 4 days before arrival
- No refund if cancelled < 2 days before arrival

---

### 1.38 Content Manager — Vetrina / Showcase (`/content_manager/showcase`)

**6 sections:**
1. Benvenuto principale
2. Benvenuto secondario
3. Descrizione hotel
4. Come raggiungerci
5. Descrizione location
6. Servizi alberghieri

**Services items have:** Titolo, Icona, Description

**Available template variables in services:** `{bookingFromHour}`, `{bookingToHour}`

---

### 1.39 Content Manager — Custom Emails (`/content_manager/custom_emails`)

- "Crea email personalizzata" button
- Table: Titolo, Pianificazione, Oggetto, Allegati, Attivo
- Note: This route redirects within 1–2 seconds — observed instability

---

### 1.40 Content Manager — Partner Services (`/content_manager/partner_services`)

- "Aggiungi un nuovo servizio convenzionato" button
- Table: Servizio, Email, Attivo, Richiesta inviata, Richiesta ricevuta

---

### 1.41 Content Manager — Posts (`/content_manager/posts`)

- "Aggiungi un nuovo post" button
- Table: Titolo, Commento, Pubblicato il

---

### 1.42 Hotel Management — Impostazioni (`/hotel_management/settings`)

**ALL fields documented:**

**Design:**
- Colore principale (hex color picker, default: #060a84)

**Registro alberghiero:**
- Telefono
- CAP e citta
- Indirizzo
- Email
- URL sito

**Registro proprieta:**
- Ragione sociale
- Nazione (200+ countries, priority: CH / IT / DE / FR)
- Indirizzo
- CAP
- Citta
- Partita IVA
- IBAN
- BESR ID (Swiss payment slip identifier)

**Registro HESTA (Swiss hotel stats):**
- Email contatto
- Telefono
- Referente
- ID UST (BUR number)
- Auto-send checkbox

**POLCA:**
- Codice utente (format: XNA...)

**Apricancello (Gate opener):**
- Numero telefono

**Email gestione:**
- CC per prenotazioni
- Email riepilogo colazione

**Ospiti Wi-Fi:**
- SSID
- Password
- Username (optional)

**Formattazione:**
- Delimitatore CSV

---

### 1.43 Hotel Management — Tipologie di Stanze (`/hotel_management/room-types`)

- Add form: Nome, Capacita nominale, Max OTA availability
- List with multilingual names (IT / DE / EN / FR flags), edit / delete per type
- 8 room types total
- Note: This route redirects within 1–2 seconds — observed instability

---

### 1.44 Hotel Management — Camere (`/hotel_management/rooms`)

- Add form: Numero stanza, Tipologia di stanza, Piano stanza
- List with edit (blue) and delete (red) buttons, paginated
- All 59 rooms displayed
- Note: This route also redirects within 1–2 seconds — observed instability

---

### 1.45 Gestisci Utenti (`/users/manage`)

**User types:** Standard or Business (only 2 types — no granular permissions)

**Create form fields:**
- Nome utente
- Email
- Conferma email
- Password
- Conferma password
- Tipo: combobox — Standard / Business

---

### 1.46 Sale Riunioni / Meeting Rooms (`/meeting_rooms`)

- Filter: Camera (room), date
- "Genera chiave" (Generate key) button
- Table: Camera, Data (datetime), Azioni, Ore di prenotazione
- QR codes generated per booking for access
- Displays "Meeting Room 1" entries with timestamps

---

### 1.47 Apricancello / Gate Opener (`/gate_opener`)

- Single-action interface
- Button "Apri Ingresso" (Open entrance)
- Description: "Cybhotel apricancello e utilizzato per sbloccare l'ingresso principale dell'edificio"

---

### 1.48 Aiuto / Help (`/ticket`)

- Support ticket form
- Instructions for providing detailed information

---

## 2. UX/UI ANALYSIS

### 2.1 What Works Well

**The Piano Camere (room floor plan) is genuinely excellent.** The Gantt-style grid is the correct primary operational view for a hotel front desk. Being able to see at a glance which rooms are occupied, the guest name, and the status — all on one screen — matches how hotel staff actually think. The color coding, compact mode, collapsible floors, and hover tooltips show real thought about daily use.

**The Calendar/Management dual view is appropriate.** Having both a cell-by-cell calendar mode and a bulk/mass mode for price changes handles both the "I need to update next weekend" case and the "I need to set summer rates" case without requiring two separate screens.

**The dynamic pricing algorithm visualization is a good UX choice.** The 32-cell summary matrix with gauge charts makes an abstract algorithm tangible. A hotel operator can look at it and understand "at 30% occupancy with 5 days to arrival on a weekend, what price will the system suggest?" without reading code.

**Stats/Details date reference options (7 choices) are powerful.** Being able to filter reservations by booking date, arrival, overnight, check-in, check-out, invoice, or payment date addresses real operational questions that differ by context (revenue reporting vs. front desk vs. accounting).

**The promotions form is comprehensive.** The combination of booking window + stay window + excluded dates calendar + last-minute toggle + stackability flag + channel visibility + specific user targeting covers a very wide range of promotional scenarios in a single form.

**The housekeeping forecast grid is useful.** Showing future cleaning workload by room type and date lets the housekeeper manager staff days in advance rather than reacting on the day.

**The KPI cockpit with Yesterday/MTD/YTD and color-coded change indicators** is a functional revenue management dashboard that front desks and owners can read quickly.

---

### 2.2 What Is Clunky or Problematic

**Housekeeping status change is a `window.confirm()` dialog.** This is the browser's native alert box — it has no styling, cannot show a dropdown to select the new status (just yes/no), and on mobile is especially jarring. For a module that housekeeping staff use on phones while physically moving through the building, this is a critical UX failure.

**Content Manager rooms page has all fields disabled.** A hotel operator navigates to "Gestore di contenuti > Camere", sees the form, tries to update a room description or upload a photo, and cannot — every field is read-only. There is no explanation of how to actually edit content. This creates confusion and support overhead.

**The SPA router is aggressive.** Several routes (`/hotel_management/room-types`, `/hotel_management/rooms`, `/content_manager/custom_emails`) redirect within 1–2 seconds of loading. This suggests incomplete or broken navigation states in the Vue.js SPA. A user who clicks slowly or pauses gets navigated away from what they intended to open.

**The first form on every page is often the logout form.** Because the SPA builds the DOM progressively, any script attempting `document.forms[0].submit()` for automation or testing accidentally logs the user out. This indicates the page architecture does not enforce a sensible DOM ordering.

**Session expires in approximately 7 minutes.** For any hotel operator who steps away from the screen (to check in a guest, answer a phone call, handle a payment terminal), returning to find the session expired and being forced to log in again is a significant friction point. Standard hotel operations involve many interruptions.

**Adding new extra types requires contacting support.** If a hotel wants to offer a new service (airport transfer, bicycle rental, spa treatment) as a bookable extra, they cannot do it themselves. This is a multi-day delay and support overhead for what should be a self-service action.

**Changing OTA tourist tax settings requires contacting support.** This affects financial reporting and is regulation-sensitive. Locking it behind a support ticket is appropriate for preventing accidental changes, but a confirmation-step self-service option would be far better.

**Only 2 user roles: Standard and Business.** A real hotel has front desk staff (need reservations, check-in, no pricing), revenue managers (need all pricing, no hotel settings), housekeepers (need only housekeeping), accountants (need reports and orders, no operational pages), and owners (need everything). The lack of role-based access control means either everyone gets full access or nobody can delegate safely.

**The voucher list mixes Valido/Scaduto/Usato in tabs** but offers no search, no date filter, and no export. For a hotel running promotions at scale, finding a specific voucher code becomes manual scrolling.

**No inline confirmation or outcome feedback on many actions.** The save buttons ("Aggiorna", "Crea") do not display visible success messages with sufficient clarity, making it uncertain whether an action completed.

---

## 3. STRENGTHS

### 3.1 Comprehensive Pricing Architecture

CybHotel's pricing model handles real complexity correctly. The separation of Primary and Derived rate plans — where a Derived plan is a percentage or fixed delta on top of a Primary — means that when the base Standard price changes, all derived plans (Non rimborsabile, Colazione inclusa, All inclusive) update automatically without manual intervention. This is the correct architectural choice and many simpler PMS systems miss it.

The three-factor dynamic pricing algorithm (occupancy + lead time + weekend) is meaningful and configurable. The 32-cell visual summary makes it operationally transparent — not a black box.

Date-range supplement pricing (with multiple date bands per extra type) correctly handles seasonality. A breakfast that costs 15 CHF in low season and 20 CHF in peak season is a realistic scenario.

### 3.2 Strong Promotion System

The promotion form covers nearly every promotional scenario a hotel might encounter: last-minute rates, early bird (booking window), minimum-stay offers, channel-specific visibility (webapp only, kiosk only, business users only), stackable vs. exclusive promos, and room-type or rate-plan scoping. The excluded-dates calendar for stay periods is a particularly thoughtful addition.

The voucher system with 4 value types (percentage, fixed CHF, total price cap, per-night price) is flexible enough to cover gift cards, loyalty rewards, and corporate discounts.

### 3.3 Multilingual Content Management

Support for IT / DE / EN / FR throughout the system — room type names, room descriptions, email templates, showcase content, and terms — is essential for Switzerland and markets with multiple official languages. This is built in at the data model level, not bolted on.

### 3.4 Regulatory Compliance Integrations

The system covers:
- **HESTA**: Swiss hotel statistics reporting (auto-send option)
- **POLCA**: Swiss regulatory reporting
- **ISTAT**: Italian tourism statistics
- **BESR ID**: Swiss payment slip system
- **Tassa di soggiorno + Tassa di promozione turistica**: Both Swiss tourist taxes modeled separately with their own VAT rates

This is not trivial. Getting regulatory compliance right for Swiss hospitality requires deep local knowledge, and CybHotel has it.

### 3.5 Operational Housekeeping Module

The separation of housekeeping into:
1. Real-time status dashboard
2. Forward-looking forecast by room type and date
3. History log with state transitions and user attribution
4. Dedicated staff-facing URL (`housekeeping.eroomnetwork.com`)

...is the correct functional decomposition. A housekeeper on the floor, a housekeeper manager planning staffing, and an owner auditing what happened are three different users with three different needs, and the module serves all three.

### 3.6 IoT and QR Code Integration

Gate opener control and meeting room key generation (with QR codes) show integration with physical building systems. For a small to mid-size property this is a differentiator — most legacy PMS systems are purely software and require a separate system for physical access.

### 3.7 Revenue Statistics Depth

The KPI cockpit with 11 metrics, three time periods (Yesterday/MTD/YTD), and chart aggregation levels is a genuine revenue management tool. The marketing stats with channel comparison and the client stats with nationality and aggregate spend enable data-driven decisions.

The Stats Details module with 7 date reference options and ~20 sortable columns is flexible enough to answer most operational reporting questions without an external BI tool.

---

## 4. WEAKNESSES & IMPROVEMENT OPPORTUNITIES

### 4.1 User & Permission System is Dangerously Simple

**The problem:** Only two user types exist — Standard and Business. Business is a guest-facing type for direct booking portals. Standard is everything else.

**The impact:** A hotel cannot safely onboard front desk staff without giving them access to pricing, algorithm settings, VAT configuration, and hotel settings. Mistakes by untrained staff on pricing or restrictions have direct revenue impact.

**What's needed:** Role-based access control with at minimum: Front Desk, Revenue Manager, Housekeeper, Accountant, Owner. Ideally, fully customizable permission sets per user.

### 4.2 Housekeeping UX is Unsuitable for Mobile Staff

**The problem:** Changing a room's cleaning status uses a browser `confirm()` dialog. This gives only a yes/no answer — it cannot indicate the new target status, cannot include a note, and renders terribly on mobile browsers.

**The impact:** Housekeeping staff who rely on smartphones or tablets get a degraded experience. There is no way to record cleaning notes at time of status change, no photo attachment capability, no indication of which staff member cleaned which room in real-time.

**What's needed:** A purpose-built housekeeping interface with tap-friendly status selection cards, note input, optionally photo upload, and proper attribution to the cleaning staff member.

### 4.3 Content Manager Rooms Page is Non-Functional

**The problem:** All form fields on `/content_manager/rooms` are disabled. Room descriptions, amenity checkboxes, and photo uploads cannot be edited by the hotel operator.

**The impact:** Content updates require either a support ticket or use of a different, undocumented interface. Hotel operators who find this page expect to be able to edit it and are blocked.

**What's needed:** Either enable the fields with proper save functionality, or clearly redirect to wherever content is actually editable, with an explanatory message.

### 4.4 New Extras Require Support Contact

**The problem:** Extras/services are hardcoded to the 4 types in the system (Breakfast, Pool, No daily clean, Pets). A hotel wanting to offer bicycle rental, airport transfer, late checkout fees, or a spa treatment as a bookable add-on must submit a support request and wait.

**The impact:** Adds friction to upselling. Revenue opportunities are missed or delayed. The hotel cannot iterate on its service offering independently.

**What's needed:** Full self-service extra creation with: name (multilingual), icon selection, VAT category assignment, pricing by date range, inclusion in rate plans, and OTA visibility toggle.

### 4.5 Session Timeout is Too Aggressive

**The problem:** Sessions expire after approximately 7 minutes of inactivity.

**The impact:** Hotel front desk is a high-interruption environment. A staff member who opens a reservation, speaks to a guest for 8 minutes, and returns to the computer is forced to log in again. Given the reCAPTCHA on login, this is not a quick operation.

**What's needed:** Configurable session duration (minimum 30–60 minutes), or activity-based extension, or a "remember this device" persistent session option for trusted workstations.

### 4.6 SPA Routing Instability

**The problem:** Several routes redirect away within 1–2 seconds of loading. The DOM ordering means the logout form is often `document.forms[0]`, creating a risk of accidental logout in automated contexts.

**The impact:** Routes that redirect unpredictably (`/hotel_management/room-types`, `/hotel_management/rooms`, `/content_manager/custom_emails`) may be timing-dependent, failing on slow connections or slower devices.

**What's needed:** Stable routing, proper route guards in Vue.js, and ensuring critical forms are not the first form in the DOM.

### 4.7 OTA Configuration Requires Support for Tax Settings

**The problem:** Tassa di soggiorno is locked to "Escluso" for OTAs and changing it requires contacting support.

**The impact:** Tax handling is different per OTA contract (some OTAs collect and remit taxes themselves; others do not). A hotel that changes OTA agreements or is in a jurisdiction that requires OTA tax inclusion is blocked.

**What's needed:** Self-service with a confirmation step and clear explanation of implications.

### 4.8 No Granular Pricing Calendar Navigation

**The problem:** The pricing calendar requires setting a date range and clicking "Mostra." There is no quick-jump to next week, next month, or a named period. Mass mode requires manually selecting day-of-week checkboxes each time.

**What's needed:** Calendar navigation arrows, named preset periods (next 7 days, next 30 days, current month, next month), and saved mass-edit templates.

### 4.9 Voucher Management Lacks Search and Export

**The problem:** The voucher list is tab-filtered (Valid/Expired/Used) but has no search, no date filter, and no export to CSV.

**What's needed:** Search by code, bulk export, and ability to see which reservations used a specific voucher.

### 4.10 Reservation Search Has No Full-Text Search

**The problem:** Reservation list filters include reservation number, guest name, channel, and email — but no text search across notes, no search by room number, and no search by guest phone number.

**What's needed:** A unified search box that searches across all reservation fields, plus search by phone number (a common front-desk lookup scenario).

### 4.11 No Native Channel Manager Beyond Basic OTA Push

**The problem:** OTA configuration offers a price increment percentage and max availability, but there is no per-OTA price or availability differentiation, no two-way reservation import from OTAs (aside from what the channel manager backend handles), and no real-time OTA sync status visible.

**What's needed:** Visible channel sync status, per-OTA pricing rules, and a clear audit log of what was pushed to which OTA and when.

### 4.12 No Guest Communication History

**The problem:** There is no inbox, sent-mail log, or communication timeline per reservation. The system sends confirmation emails but there is no record visible in the UI of what was sent, when, and whether it was opened.

**What's needed:** Per-reservation communication log with send status, open tracking (optional), and ability to resend.

---

## 5. ARCHITECTURAL OBSERVATIONS

### 5.1 Technology Stack

- **Frontend:** Vue.js SPA with aggressive client-side routing
- **Session management:** Server-side sessions with ~7 minute timeout
- **Auth:** reCAPTCHA on login
- **Separate frontends per context:** `admin.eroomnetwork.com` (staff), `booking.eroomnetwork.com` (guests), `housekeeping.eroomnetwork.com` (cleaning staff), `kiosk.eroomnetwork.com` (implied by "Valido per Kiosk" in promotions)

### 5.2 Data Model Observations

**Core entities inferred from the UI:**

| Entity | Key Fields | Relationships |
|---|---|---|
| Hotel | Settings, IBAN, HESTA ID, color, WiFi | 1 per instance |
| RoomType | Name (4 languages), capacity, OTA max | has many Rooms |
| Room | Number, floor, type | belongs to RoomType |
| RatePlan | Name, type (Primary/Derived), supplementi, restrictions | has many PriceValues |
| PriceValue | Min, max, per-person discount, date range | belongs to RatePlan + RoomType |
| RestrictionPlan | Name | has many RestrictionRules |
| RestrictionRule | Type, value, date range, room type | belongs to RestrictionPlan |
| Extra | Name, VAT, type (included/optional) | has many ExtraPrices |
| ExtraPrice | Date from, date to, price | belongs to Extra |
| Reservation | Guest, dates, room, channel, status | has many Orders |
| Order | Amount, payment status, invoice ref | belongs to Reservation |
| Promotion | All promotion fields | many-to-many RoomType, RatePlan |
| Voucher | Code, date range, type, value | optional link to Promotion |
| HousekeepingEvent | Room, status from, status to, user, timestamp | belongs to Room |
| Staff | Email, level | housekeeping users |
| User | Username, email, type | Standard or Business |

### 5.3 Multi-Tenancy Model

The URL parameter `hotel_ext_id=512` on booking and housekeeping subdomains suggests a multi-tenant architecture where the admin UI supports multiple hotel instances (the "Test CH" selector in the header). Rate plans, rooms, extras, and all configuration are scoped per hotel.

### 5.4 Channel Manager Integration

The OTA section implies a backend channel manager (likely Antoptima's own or a third-party like SiteMinder/Cloudbeds). The admin UI is a configuration layer on top of this channel manager, with price increment and availability caps as the primary controls exposed to the hotel operator.

### 5.5 Regulatory Integrations as First-Class Features

HESTA, POLCA, and ISTAT are not afterthoughts — they have dedicated settings sections and report generation. This is a Swiss-market-first product that has been adapted for Italy. The tax model (3 different tax types with independent VAT rates and separate OTA handling) reflects Swiss regulatory complexity.

### 5.6 Known Technical Issues

- **Redirect bug** on `/hotel_management/room-types`, `/hotel_management/rooms`, `/content_manager/custom_emails` — routes navigate away within 1–2 seconds
- **Logout form first in DOM** — `document.forms[0].submit()` triggers logout
- **SPA navigation on snapshot/deep-link** — the SPA router intercepts URL changes aggressively, causing issues with external navigation
- **Content Manager rooms fields all disabled** — likely an unfinished migration from a separate admin interface

---

## 6. RECOMMENDATIONS FOR LIBERTYGEST

### 6.1 What to Replicate Directly

**The Piano Camere Gantt view is the right default homepage.** Keep this as the primary screen. The combination of floor organization, color status coding, guest names, compact/advanced mode toggle, and per-date occupancy summary row is a proven operational layout. Do not reinvent it — improve it.

**The Primary/Derived rate plan hierarchy is architecturally correct.** When a hotel has 5 rate plans and 8 room types, they cannot manage 40 independent price series. The derived plan model (Standard + delta) reduces management overhead to managing one series per room type. LibertyGest should implement this exactly, with the addition of supporting multiple derivation levels.

**The 7 date reference options in Stats Details are essential.** Different stakeholders need different date anchors. An accountant querying "what was invoiced in March" uses invoice date; the revenue manager uses arrival date; the front desk uses check-in date. Build all 7 from the start.

**The dynamic pricing algorithm concept is valuable but should be improved.** Retain the three-factor model (occupancy + lead time + day type), but add: minimum price floor, maximum price ceiling, blackout dates for algorithm (manual override dates), and a per-room-type enable/disable toggle.

**Promotions form completeness.** LibertyGest's promotion system should match or exceed CybHotel's field set: booking window, stay window, excluded dates, last-minute flag, min/max nights, stackability, channel visibility, user-type scoping, and specific user selection.

**Regulatory compliance sections.** For Italian hotels, ISTAT reporting is mandatory. For Swiss, HESTA and POLCA. Build these as proper first-class features with configuration sections and automated report generation, not as exports left to the operator.

**Multilingual content management.** IT / EN / DE / FR at minimum for the Swiss/Northern Italian market. Room names, descriptions, email templates, and showcase content should all support all four languages from the start — retrofitting multilingual support is extremely expensive.

**Separate housekeeping URL for staff.** The concept of a separate, simplified interface for cleaning staff accessible without full admin credentials is correct. LibertyGest should implement this as a proper PWA (Progressive Web App) optimized for mobile, with swipe gestures for status changes.

---

### 6.2 What to Improve Upon

**Replace `window.confirm()` housekeeping with a purpose-built status picker.** LibertyGest's housekeeping module should have:
- Tap-friendly room cards (large touch targets)
- A bottom sheet or modal with status options (visual icons + text)
- Optional note field at time of status change
- Photo attachment for maintenance issues
- Staff attribution (which housekeeper cleaned this room)
- Estimated time to completion

**Build full self-service extras management.** Any hotel operator should be able to create a new extra service without contacting support. The creation form should include: name in all supported languages, category, icon, VAT rate, pricing by date range, rate plan inclusion defaults, OTA visibility, and booking engine display order.

**Implement proper RBAC (Role-Based Access Control) from day one.** Define at minimum 5 built-in roles:

| Role | Access |
|---|---|
| Front Desk | Reservations, housekeeping status, check-in report, basic stats |
| Revenue Manager | All pricing, restrictions, OTA settings, all stats |
| Housekeeper | Housekeeping only (dedicated mobile interface) |
| Accountant | Orders, reports, income stats, KPI, VAT settings |
| Owner / Admin | Everything including user management and hotel settings |

Add a custom role builder for unusual configurations.

**Extend session timeout.** Default to 60 minutes of inactivity. Allow admins to configure between 15 minutes (shared/public computers) and 8 hours (dedicated back-office workstations). Offer "remember me on this device" for 30-day persistent login on trusted hardware.

**Make Content Manager rooms fully editable.** Room descriptions, amenity checkboxes, bed configurations, and photo management (with drag-to-reorder, crop/rotate, alt-text) should all be editable directly in the UI, with live preview of how it appears on the booking engine.

**Add unified search.** A global search bar (keyboard shortcut: `/`) that searches across reservations by number, guest name, email, phone, and notes. Returns results from reservations, guests, and rooms in a single dropdown. This is the single highest-frequency action at a hotel front desk.

**Add communication history per reservation.** Every automated and manual email sent should be logged in a timeline view on the reservation. Include: timestamp, email type, recipient, delivery status, and open status (if available from email provider). Add ability to manually send a message from the reservation.

**Add per-channel pricing rules beyond a flat OTA increment.** Allow different markup percentages per OTA (Booking.com +20%, Expedia +18%, direct booking +0%). Allow per-OTA availability caps. Show OTA sync status with last-push timestamp.

**Replace the calendar date range selector with proper navigation.** Add: previous/next period arrows, preset buttons (Today, This Week, Next 7 Days, This Month, Next Month), and a mini calendar picker. The current Dal/Al + "Mostra" pattern requires 4 interactions (click Dal, enter date, click Al, enter date, click Mostra) for every view change.

**Add voucher search and export.** Voucher management at scale requires: search by code prefix, filter by date range, filter by creation date, bulk export to CSV, and a drill-down to which reservation used a specific voucher.

**Add an audit log.** Every change to pricing, restrictions, rate plans, and hotel settings should be recorded with: timestamp, user, changed field, old value, new value. This is essential for debugging ("why did the price change on March 12?") and accountability.

**Build a proper mobile-responsive design throughout.** CybHotel's admin interface is desktop-first and barely usable on mobile. LibertyGest should be fully responsive, with the understanding that small hotel operators often check reservations and pricing on their phones.

**Add real-time notifications.** Front desk should receive in-app notifications for: new reservations (especially OTA), cancellations, payment failures, and approaching check-in/check-out thresholds. CybHotel has no visible notification system.

---

### 6.3 Features to Add That CybHotel Lacks

**Guest profiles / CRM.** CybHotel has a client stats page and a list, but no true guest profile: no preference tracking, no loyalty points, no allergy/accessibility notes, no "VIP" flag, no stay history accessible at check-in. LibertyGest should have a proper guest card that shows full stay history, total spend, preferences, and communication history.

**Automated pre-arrival and post-stay emails.** CybHotel has custom emails but they are not templated and scheduled around reservation dates in an obvious way. LibertyGest should have a visual email automation builder: "3 days before arrival → send email template X", "1 day after checkout → send review request."

**Rate parity checker.** A widget that shows the hotel's current price on major OTAs vs. the direct booking price, updated in near-real-time, so the revenue manager can spot and fix parity violations without logging into each OTA's extranet.

**Mobile check-in / digital key.** Build the infrastructure for guests to complete check-in on their phone (uploading document photos, signing terms) and receive a digital room key (QR or NFC), reducing front desk workload. CybHotel has QR codes for meeting rooms but not for guest rooms.

**Revenue calendar heatmap.** A month-view calendar where each cell is color-coded by ADR or occupancy with thresholds configurable by the operator, giving an instant visual overview of high and low periods without needing to query the stats module.

---

### 6.4 Data Migration Considerations

When migrating from CybHotel to LibertyGest, the following data will need to be exported and imported:

1. **Room types and rooms** — 8 types, 59 rooms, floor assignments, multilingual names
2. **Rate plans** — Primary/Derived structure, supplementi inclusi, restriction plan links
3. **Price calendars** — Default min/max/per-person discount per room type, calendar overrides
4. **Restriction plans** — Named plans with all restriction rules
5. **Extras and pricing** — Date-range pricing per extra type
6. **Promotions** — All active promotions with full field set
7. **Vouchers** — Active (unused, non-expired) vouchers only
8. **Reservation history** — All reservations with guest data, orders, and payment records
9. **Guest database** — Client records with nationality, stay history, email, phone
10. **Content** — Room descriptions, showcase text, email templates in all 4 languages
11. **Settings** — HESTA/POLCA credentials, IBAN, tax IDs, Wi-Fi credentials

CybHotel offers CSV export from Stats Details (with all 7 date reference options) — this should be used as the primary data extraction path for reservations and orders.

---

*Document compiled from direct UI analysis, parallel deep-dive agents covering Pricing & Tariffs, Reservation Lifecycle, and Hotel Management & Content. Analysis date: 2026-04-13.*

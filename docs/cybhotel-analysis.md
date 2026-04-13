# CybHotel (eRoomNetwork) - Complete Feature Analysis

**URL:** https://admin.eroomnetwork.com  
**Vendor:** Antoptima SA (cybhotel.com)  
**Analysis Date:** 2026-04-13  
**Hotel Instance:** "Test CH" (user: rocco_lettieri)  
**Property:** 59 rooms across 10 floors

---

## 1. NAVIGATION STRUCTURE

The application uses a fixed left sidebar with the following menu structure:

### Top-Level Pages (direct links)
- **Dashboard** (`/dashboard`)
- **Piano camere** (`/`) - Room floor plan (default homepage)
- **Calendario prezzi e disponibilita** (`/calendar`)
- **Nuova prenotazione** (`/reservation`)
- **Restrizioni** (`/restrictions`)
- **Gestisci gli utenti** (`/users/manage`)
- **Sale riunioni** (`/meeting_rooms`)
- **Apricancello** (`/gate_opener`)
- **Aiuto** (`/ticket`)

### Expandable Dropdown Sections

#### Prenotazioni (Reservations)
- Elenco delle prenotazioni (`/reservations/list`)
- Prenotazioni incomplete (`/reservations/incomplete`)
- Tutti gli ordini (`/reservations/orders`)
- Ordini non pagati (`/reservations/unpaid_orders`)
- Pagamenti da riscuotere da OTA (`/reservations/ota_collected`)
- Rimborsi (`/reservations/to_be_reimbursed`)
- Colazioni (`/reservations/breakfasts`)
- Supplementi a calendario (`/reservations/calendar_extras`)
- Importazione di massa (`/reservations/bulk`)
- Richieste di servizi convenzionati (`/partner_services_requests`)

#### Tariffe (Rates)
- Piani tariffari (`/pricing/rates`)
- Gestione dei prezzi (`/pricing/management`)
- Algoritmo dei prezzi (`/pricing/algo_points`)
- Supplementi (`/pricing/supplements`)
- Tasse locali (`/pricing/visitors_tax`)
- I.V.A. (`/pricing/manage_vat`)

#### Sconti (Discounts)
- Promozioni (`/promo/promotions`)
- Voucher (`/promo/vouchers`)

#### Indisponibilita (Unavailability)
- Camere (`/unavailability/rooms`)
- Supplementi (`/unavailability/extra`)

#### OTAs
- Impostazioni (`/otas`)
- Pagamenti da riscuotere da OTA (`/reservations/ota_collected`)

#### Statistiche (Statistics)
- Pernottamenti (`/stats/overnights`)
- Introito (`/stats/income`)
- Marketing (`/stats/marketing`)
- Sales (`/stats/sales`)
- Clienti (`/stats/clients`)
- Voti e commenti (`/stats/ratings`)
- Dettagli delle prenotazioni (`/stats/details`)
- KPI (`/economic_cockpit`)

#### Report
- Check-in (`/report/checkin`)
- Income (`/report/income`)
- Touristic (`/report/touristic`)

#### App per la pulizia (Housekeeping)
- Gestione stanze (`/housekeeping`)
- Previsioni (`/housekeeping/forecast`)
- Storico (`/housekeeping/history`)
- Gestisci staff (`/housekeeping/manage_staff`)

#### Gestore di contenuti (Content Manager)
- Camere (`/content_manager/rooms`)
- Termini generali e condizioni (`/content_manager/terms`)
- Privacy policy (`/content_manager/disclaimers`)
- Conferma della prenotazione (`/content_manager/confirmation`)
- Gestione email personalizzate (`/content_manager/custom_emails`)
- Vetrina (`/content_manager/showcase`)
- Servizi convenzionati (`/content_manager/partner_services`)
- News/Posts (`/content_manager/posts`)
- **Extras (inline links to edit specific extras):**
  - Colazione (`/pricing/edit_extra?extra_id=3`)
  - Piscina (`/pricing/edit_extra?extra_id=4`)
  - No daily clean (`/pricing/edit_extra?extra_id=6`)
  - Animali domestici (`/pricing/edit_extra?extra_id=7`)
  - Tassa di soggiorno (`/pricing/edit_extra?extra_id=1`)
  - Tassa di promozione turistica (`/pricing/edit_extra?extra_id=2`)

#### Gestione hotel (Hotel Management)
- Impostazioni (`/hotel_management/settings`)
- Tipologie di stanze (`/hotel_management/room-types`)
- Camere (`/hotel_management/rooms`)

---

## 2. DETAILED FEATURE ANALYSIS

### 2.1 Dashboard (`/dashboard`)

Summary view showing:
- **Situazione pulizie** (Cleaning Status): Counts for "Richiede check-out", "Da pulire e controllare", "Da controllare", "Libera e pulita"
- **Situazione pagamenti ordini** (Payment Status): "Pagato Oggi", "Pagamenti in scadenza", "Pagamenti scaduti" with CHF amounts
- **Check-in / Checkout counts**: Daily totals (e.g., 0/0)
- **Occupazione** (Occupancy): Room type breakdown showing occupied/total
- **Biancheria** (Linens): Linen requirements by type
- **Extra**: Additional services summary

### 2.2 Piano Camere (`/`) - Room Floor Plan

**Primary operational view** - a Gantt-style grid showing:
- **Date range selector**: "Dal" (from) / "Al" (to) with "Mostra" (Show) button
- **View modes**: Basic/Advanced toggle, Standard/Compact toggle
- **Sort options**: By "piano" (floor) or "tipologia" (room type)
- **Room grid**: 59 rooms x date columns
  - Organized by floor (Piano 1-10)
  - Each floor collapsible with "Nascondi" (Hide) button
  - Cells show reservation ID + guest name when occupied
  - Color-coded by status
  - Hover tooltip shows room type + status (e.g., "Doppia Superiore - Libera e pulita")
- **Occupancy summary by type**: Bottom section showing free rooms and occupancy % per date

**Room types identified:**
| Abbreviation | Full Name | Count |
|---|---|---|
| Si.Vi.Ci. | Singola Vista Citta | 6 |
| Do. | Doppia (Standard) | 18 |
| Do.Su. | Doppia Superiore | 16 |
| Tr.St. | Tripla Standard | 4 |
| Qu.St. | Quadrupla Standard | 5 |
| Su. | Suite | 2 |
| Ju.Su. | Junior Suite | 3 |
| Do.Le.si. | Twin (Doppia Letti singoli) | 5 |
| **Total** | | **59** |

**Room numbering convention:** First digit = floor number (e.g., room 25 = floor 2, room 5)

### 2.3 Calendario Prezzi e Disponibilita (`/calendar`)

Calendar grid showing per room type per date:
- **Availability count** (rooms available)
- **Price** per night
- Filterable by date range
- Editable inline (modify availability and calendar values)
- Shows all room types in rows with dates as columns

### 2.4 Nuova Prenotazione (`/reservation`)

New reservation creation form:
- **Booking link** (URL for direct booking)
- **Data d'arrivo** (Check-in date)
- **Data di partenza** (Check-out date)
- **Tipo di camera specifico** (Specific room type selector)
- **Bambini (< 14 Anni)** (Children under 14)
- **"Verifica la disponibilita"** button (Check availability)
- **"Aggiungi stanza"** button (Add room - for multi-room bookings)

### 2.5 Elenco Prenotazioni (`/reservations/list`)

Reservation list with filters:
- **Date range**: Dal/Al
- **Data di riferimento**: Check-in date / booking date toggle
- **Canale di provenienza** (Source channel - e.g., Direct, OTA)
- **Search fields**: Reservation number, guest name, confirmation status, email
- **Results table columns**: Numero di prenotazione, Vista d'arrivo, Data di partenza, Email, Nazionalita, Camere, Canale, Azioni
- Paginated results

### 2.6 Ordini / Orders (`/reservations/orders`)

Order management with filters:
- Date range, reference date / order date
- Advanced filters: payment type, order status
- **Table columns**: Prev., #, Tipo, Stato del pagamento, Tatt., Ammontare, Ospite, Riferimento fattura, Data emissione documento fiscale, Data di scadenza, Actions

### 2.7 Colazioni / Breakfasts (`/reservations/breakfasts`)

Breakfast tracking:
- Filter by date and reservation number
- Track breakfast consumption per room/reservation
- Table with: Colazione, Ospite, Modello, Colazione, Notte, Numero di prenotazione, Data dell'ordine

### 2.8 Piani Tariffari (`/pricing/rates`)

Rate plan management:
- Table of rate plans with columns: Tipologia di piano tariffario, Canale (percentuale), Tariffa minima, Piani delle restrizioni, Azioni
- Existing plans visible: Standard, OTA plans
- Each plan has associated rooms, restrictions, and channel percentages
- Button to create new rate plans

### 2.9 Gestione dei Prezzi (`/pricing/management`)

Price management with two sections:
- **Valori di default** (Default values): Per room type showing Prezzo minimo, Prezzo massimo, Sconto per persona
- **Valori a calendario** (Calendar values): Date-based price overrides in a calendar grid
- Toggle between "Modifica a calendario" and "Modifica di massa"
- Filter by date range

### 2.10 Algoritmo dei Prezzi (`/pricing/algo_points`)

**Dynamic pricing algorithm** with three factors:
- **Occupazione** (Occupancy): Score points for occupancy thresholds (e.g., 0-30%, 30-50%, etc.)
- **Intervalli di tempo** (Time intervals): Points based on days before arrival
- **Fine settimana** (Weekend): Points for weekend pricing

**Sommario** (Summary): Visual display using gauge/clock icons showing price adjustments from E1 (minimum) to E5+ (maximum) based on combined scoring. Configurable by room type (Singola, Doppia, etc.).

### 2.11 Supplementi (`/pricing/supplements`)

Extra services/supplements pricing calendar:
- Two tabs: "Tasse di soggiorno" (Tourist tax) and "Colazione" (Breakfast)
- Calendar grid with dates and prices
- Color-coded cells (green = active pricing)

### 2.12 Tasse Locali (`/pricing/visitors_tax`)

Same structure as supplements - calendar-based tax pricing for:
- Tassa di soggiorno (City/tourist tax)
- Tassa di promozione turistica (Tourism promotion tax)

### 2.13 I.V.A. (`/pricing/manage_vat`)

VAT rate configuration per category:
| Categoria | % IVA |
|---|---|
| Camera | 3.7 % |
| Tassa di soggiorno | 0 % |
| Tassa di promozione turistica | 0 % |
| Colazione | 8 % |
| Piscina | 8 % |
| No daily clean | 0 % |
| Animali domestici | 2.5 % |

### 2.14 Promozioni (`/promo/promotions`)

Promotions management:
- Filter: Nascosti/Tutti, Mostra filtri
- Button "Crea nuova promozione"
- Table: Modifica, Nome, Attivo, Data di promozione da/a, Data soggiorno da/a
- Existing promotions visible (e.g., "promo test", "sboronata 2X")

### 2.15 Voucher (`/promo/vouchers`)

Voucher system:
- Button "Crea un voucher"
- Table: Codice promozionale, Valido dal, Valido fino a, Tipo di voucher, Valore del voucher, Extra
- Existing vouchers with percentage and fixed-value types

### 2.16 Indisponibilita Camere (`/unavailability/rooms`)

Room unavailability management:
- Filter: Corrente e attivo / Visuale
- List of unavailable rooms with dates and notes
- Button "Crea nuova indisponibilita"
- Color-coded status indicators (green = active block)

### 2.17 Restrizioni (`/restrictions`)

Booking restrictions calendar:
- **Piano delle restrizioni** selector
- View modes: "Modifica a calendario" / "Modifica di massa"
- Date range filter
- Grid showing restriction types per room type per date
- **Legend with restriction types:**
  - Soggiorno: minimum/maximum stay
  - Prenotazione: booking window constraints
  - Arrivo/Partenza: check-in/check-out day restrictions
  - Color-coded cells (green, yellow, red, gray)

### 2.18 OTA Settings (`/otas`)

OTA connection parameters:
- **Valori di default**: Max availability per room type for OTA channels
- **Tassa di soggiorno**: Tourist tax handling for OTAs
- **Moneta del prezzo** (Currency): CHF selected
- **Valori a calendario**: Calendar-based OTA availability overrides
- Per-room-type configuration

### 2.19 Statistiche - Pernottamenti (`/stats/overnights`)

Overnight stay statistics:
- Monthly reference period
- Breakdown by: Nazione di residenza, Giorno, Totale
- Sub-categories: Svizzeri (Swiss), Stranieri (Foreign)
- Further split: Adulti (Adults), Minori (Minors)
- Exportable data

### 2.20 Statistiche - Introito (`/stats/income`)

Revenue statistics:
- Period selection (monthly/custom)
- Breakdown by: Periodo, Tipo, Camera, Tassa di soggiorno, Tassa di promozione turistica, Colazione, Piscina, No daily clean, Animali domestici
- Split by: additional refunds, VAT components
- CHF currency display

### 2.21 Statistiche - Marketing (`/stats/marketing`)

Marketing analytics with three sections:
- **Sommario** (Summary): Pie/donut charts showing booking sources breakdown (by reservation date vs. arrival date), CHF revenue, room count
- **Riepilogo mensile** (Monthly recap): Bar chart comparing channels over months
- **Confronti** (Comparisons): Table comparing channels (Direct, Booking.com, etc.) with metrics

### 2.22 Statistiche - Sales (`/stats/sales`)

Sales analytics:
- **Periodo selezionato**: Date range with weekly breakdown
- **Occupazione delle stanze**: Room occupancy by type
- Table: Disp. (available), Occ. (occupied), % occupancy
- Breakdown: Camere Totali, 1&B, Other, Notte media (avg. night rate)
- Year-over-year comparison possible

### 2.23 Statistiche - Clienti (`/stats/clients`)

Client statistics:
- **Aggrega per**: Multiple grouping options (Cognome, Citta, Regione, Nazione, Continente, Lingua, Canale, Azienda, E-mail)
- Export functionality
- Table: Nome, Cognome, Ammontare (amount), Notti (nights), Prenotazioni (reservations)
- Individual client action buttons (search icons)

### 2.24 Statistiche - Voti e Commenti (`/stats/ratings`)

Guest review tracking:
- Filter by date range and "Riferimento Valutaz." (review reference)
- **Voto medio per mese** (Average rating by month): Line chart
- Table: Floor #, Data d'arrivo, Data di partenza, Cognome, Riferimento Valutaz., actions

### 2.25 Statistiche - KPI (`/economic_cockpit`)

Key Performance Indicators dashboard:
- **ADR** (Prezzo medio): Average daily rate with formula explanation
- **ARI** (Prezzo medio per notte con extra): Average rate including extras
- **RevPAR**: Revenue per available room
- **GOPPAR**: Gross operating profit per available room
- KPI cards with:
  - Current period value
  - Percentage change (color-coded: green positive, red negative)
  - Year-over-year comparison
- Metrics: Occ % (occupancy), ADR, ARI, RevPAR percentages

### 2.26 Report - Check-in (`/report/checkin`)

Check-in report generation:
- Date selector per check-in date
- Button "Genera il rapporto di ieri" (Generate yesterday's report)
- Button "Scarica rapporto" (Download report)
- List of dates with generation status icons

### 2.27 Report - Income (`/report/income`)

Income report:
- Monthly date selector
- Export buttons for report generation
- Historical report list

### 2.28 Report - Touristic (`/report/touristic`)

Tourism statistics report (likely ISTAT compliance):
- Monthly date selector
- "Scarica rapporto" functionality
- Historical report list

### 2.29 Housekeeping (`/housekeeping`)

Room cleaning management:
- **Status overview**: Richiede check-out (needs checkout), Da rassettare (needs tidying), Da pulire (needs cleaning), Libera e pulita (free and clean)
- **Room cards** showing:
  - Room number (large)
  - Room type (e.g., "Doppia Superiore")
  - Status with color coding (red = needs attention)
  - Action: "Pulisci adesso ogni 1 giorno" (Clean now every 1 day)
- Tabs: Camere / Nota (Rooms / Notes)

### 2.30 Previsioni Pulizie (`/housekeeping/forecast`)

Cleaning forecast calendar:
- Week view showing room types
- Icons indicating cleaning needs per day per room type
- Legend: "Uscita e linde" (Checkout clean), "In ricambio" (Turnover), "Prevista" (Forecast)
- Room types listed: Singola, Doppia Standard, Doppia Superiore, Junior Suite, Quadrupla Standard, Suite, Tripla Standard, Twin

### 2.31 Gestisci Staff Pulizie (`/housekeeping/manage_staff`)

Cleaning staff management:
- Button "Crea nuovo membro" (Create new member)
- Table: E-mail, Livello (Level), Gestisci (Manage), Modifica (Edit), Cambia la password

### 2.32 Content Manager - Camere (`/content_manager/rooms`)

Room content editing:
- **Multilingual support**: IT, DE, EN, FR flags for language selection
- **Room type tabs**: Singola, Doppia Standard, Doppia Superiore, Tripla Standard, Quadrupla Standard, Junior Suite, Suite, Twin
- Per room type:
  - Nome visualizzato (Display name)
  - Caratteristiche della camera (Room features): Checkboxes for amenities (Divano, TV, Connessione Wi-Fi, Champagne o prosecco gratis, etc.)
  - Custom amenity input
  - Immagini (Images): Photo upload/management with preview

### 2.33 Content Manager - Vetrina/Showcase (`/content_manager/showcase`)

Website showcase content:
- Tabs: Benvenuto principale home, Benvenuto secondario home, Posizione, Servizi, Footer
- Rich text editor for each section
- Multilingual (IT, DE, EN, FR flags)
- CMS-style content management for the booking website

### 2.34 Content Manager - Terms & Conditions (`/content_manager/terms`)

Legal text management:
- Rich text editor
- Multilingual support
- Full terms and conditions in Italian visible (cancellation policies, payment terms, etc.)

### 2.35 Content Manager - Custom Emails (`/content_manager/custom_emails`)

Automated email management:
- Button "Crea email personalizzata"
- Table: Titolo, Pianificazione, Oggetto, Allegati, Attivo
- Scheduled emails with activation status

### 2.36 Content Manager - Partner Services (`/content_manager/partner_services`)

Partner/affiliated services:
- Button "Aggiungi un nuovo servizio convenzionato"
- Table: Servizio, Email, Attivo, Richiesta inviata, Richiesta ricevuta

### 2.37 Content Manager - Posts (`/content_manager/posts`)

News/blog posts:
- Button "Aggiungi un nuovo post"
- Table: Titolo, Commento, Pubblicato il
- Existing posts visible

### 2.38 Hotel Management - Settings (`/hotel_management/settings`)

General settings with sections:
- **Design**: Colore principale del sito web (Website primary color)
- **Registro alberghiero** (Hotel register): Partita IVA, CAP, etc.
- **Registro della proprieta dell'hotel**: Hotel property details (nome, citta, indirizzo, etc.)
- **Registro HESTA**: HESTA system integration (email, telephone, BUR ID, HESTA ID)
- **POLCA**: POLCA system integration

### 2.39 Hotel Management - Room Types (`/hotel_management/room-types`)

Room type configuration:
- **Add room type form**: Nome, Capacita, Max disponibilita di stanze per le OTA
- Button: "Salva" / "Rimuovi"
- **Elenco tipologie di stanza**: List of all room types
  - Multilingual names (IT, DE, EN, FR columns with flags)
  - Edit/modify icons per room type

### 2.40 Hotel Management - Rooms (`/hotel_management/rooms`)

Physical room management:
- **Add room form**: Numero stanza, Tipologia di stanza, Piano stanza
- **Elenco stanze**: Room list with columns
  - Room number, room type, floor
  - Edit and delete actions (red delete buttons)
  - Shows all 59 rooms

### 2.41 Meeting Rooms (`/meeting_rooms`)

Meeting room bookings:
- Filter: Camera (room), date
- Button "Genera chiave" (Generate key)
- Table: Camera, Data (date/time), Azioni, Ore di prenotazione
- QR codes generated per booking (visible in screenshot)
- Shows "Meeting Room 1" entries with timestamps

### 2.42 Apricancello / Gate Opener (`/gate_opener`)

IoT gate control:
- Description: "Cybhotel apricancello e utilizzato per sbloccare l'ingresso principale dell'edificio"
- Button "Apri Ingresso" (Open entrance)
- Simple one-action interface

### 2.43 Aiuto / Help (`/ticket`)

Support ticket submission:
- Form to submit support requests
- Instructions for providing detailed information

---

## 3. HEADER BAR

- **Hotel selector**: "Test CH" button - switches between hotel properties
- **Language selector**: "IT" button - changes interface language
- **User display**: "rocco_lettieri" with profile/logout button

---

## 4. TECHNICAL OBSERVATIONS

### Architecture
- Web-based SPA (Single Page Application feel with server-side rendering)
- Uses reCAPTCHA on login
- Console errors observed on some pages (minor)
- Currency: CHF (Swiss Francs) - configurable per hotel

### Integrations
- **OTA Channel Manager**: Connects to OTAs (Booking.com visible in marketing stats)
- **HESTA**: Swiss hotel statistics reporting system
- **POLCA**: Additional Swiss regulatory system
- **ISTAT**: Italian tourism statistics (Report > Touristic)
- **IoT**: Gate opener hardware integration
- **QR Codes**: Meeting room access
- **Email system**: Custom automated emails

### Key Data Entities
1. **Reservations** (prenotazioni) - Core booking records
2. **Orders** (ordini) - Financial/payment records linked to reservations
3. **Rooms** (camere) - Physical rooms with floor/type assignment
4. **Room Types** (tipologie) - 8 room categories
5. **Rate Plans** (piani tariffari) - Pricing structures per channel
6. **Supplements/Extras** - Additional services (breakfast, pool, pets, etc.)
7. **Taxes** - Tourist tax, tourism promotion tax
8. **Promotions** - Discount campaigns
9. **Vouchers** - Discount codes
10. **Restrictions** - Booking rules (min stay, check-in days, etc.)
11. **Guests/Clients** - Guest database with nationality, stays, spending
12. **Staff** - Housekeeping staff members
13. **Users** - Admin system users with roles

### Multi-language Support
- Interface: IT (Italian) default, switchable
- Content: IT, DE, EN, FR for guest-facing content
- Room type names maintained in 4 languages

### Currency
- CHF (Swiss Francs) observed in this instance
- Likely configurable per hotel

---

## 5. SCREENSHOTS INDEX

All screenshots saved in `screenshots/` directory:
- 01-02: Dashboard and sidebar overview
- 03-10: Sidebar menu expansions (all submenus)
- 11-12: Dashboard and calendar views
- 13-15: Reservation forms and lists
- 16-21: Pricing (rates, management, algorithm, supplements, taxes, VAT)
- 22-23: Promotions and vouchers
- 24: OTA settings
- 25-26: Housekeeping and forecast
- 27-29: Statistics (overnights, income, KPI)
- 30-31: Reports (check-in, touristic)
- 32-35: Content manager and hotel management
- 36-39: Restrictions, users, meeting rooms, gate opener
- 40-42: Showcase, terms, custom emails
- 43-46: Marketing, sales, clients, ratings stats
- 47-48: Partner services, breakfasts
- 49-54: Remaining pages (income report, unavailability, posts, help, staff, details)

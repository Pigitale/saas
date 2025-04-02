# Documentazione dell'Applicazione SaaS

## Panoramica
Questa è un'applicazione SaaS (Software as a Service) che fornisce una piattaforma per la gestione di team e progetti. L'applicazione è costruita con Next.js, utilizza Supabase come database e Stripe per i pagamenti.

## Architettura
- **Frontend**: Next.js con App Router
- **Database**: Supabase (PostgreSQL)
- **Autenticazione**: Sistema di autenticazione personalizzato
- **Pagamenti**: Stripe
- **ORM**: Drizzle ORM

## Funzionalità Principali

### 1. Autenticazione e Gestione Utenti
- Registrazione utente
- Login/Logout
- Gestione password
- Inviti ai team

### 2. Gestione Team
- Creazione team
- Invito membri
- Gestione ruoli (owner, admin, member)
- Log attività del team

### 3. Dashboard
- Panoramica generale
- Gestione sicurezza
- Monitoraggio attività
- Terminale integrato

### 4. Sistema di Pagamento
- Integrazione con Stripe
- Gestione abbonamenti
- Checkout personalizzato

## Flusso di Autenticazione
1. **Registrazione**:
   - L'utente inserisce email e password
   - Viene creato un nuovo utente
   - Viene creato un nuovo team (se non c'è un invito)
   - L'utente viene aggiunto al team
   - Viene creato un log di attività

2. **Login**:
   - Verifica credenziali
   - Creazione sessione
   - Log attività
   - Reindirizzamento alla dashboard

3. **Inviti**:
   - Un membro del team invita un nuovo utente
   - L'utente riceve un invito via email
   - L'utente si registra accettando l'invito
   - Viene aggiunto al team con il ruolo specificato

## Struttura del Database
- **users**: Informazioni utente
- **teams**: Team e loro configurazioni
- **team_members**: Relazione tra utenti e team
- **activity_logs**: Log delle attività
- **invitations**: Inviti ai team

## Sicurezza
- Hashing delle password
- Validazione input con Zod
- Middleware di autenticazione
- Protezione delle rotte
- Log delle attività

## Integrazione Stripe
- Checkout session
- Gestione abbonamenti
- Webhook per gli eventi di pagamento

## Configurazione
L'applicazione richiede le seguenti variabili d'ambiente:
- `POSTGRES_URL`: URL del database Supabase
- `SUPABASE_URL`: URL del progetto Supabase
- `SUPABASE_ANON_KEY`: Chiave anonima Supabase
- `STRIPE_SECRET_KEY`: Chiave segreta Stripe
- `STRIPE_WEBHOOK_SECRET`: Chiave segreta per i webhook Stripe
- `BASE_URL`: URL base dell'applicazione
- `AUTH_SECRET`: Chiave segreta per l'autenticazione 
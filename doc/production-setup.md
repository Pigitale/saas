# Configurazione Produzione

## 1. Configurazione Stripe

### 1.1 Creazione Prodotti e Prezzi
1. Accedi al [Dashboard di Stripe](https://dashboard.stripe.com/products) in modalità produzione
2. Crea i prodotti necessari:
   - Base
   - Plus
   - (Aggiungi altri piani se necessario)
3. Per ogni prodotto, configura:
   - Nome e descrizione
   - Prezzo mensile
   - Periodo di prova gratuito (se applicabile)
   - Caratteristiche del piano

### 1.2 Configurazione Webhook
1. Vai in Developers > Webhooks
2. Crea un nuovo endpoint webhook:
   ```
   https://tuo-dominio.com/api/stripe/webhook
   ```
3. Seleziona gli eventi da ascoltare:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `checkout.session.completed`
   - `setup_intent.succeeded`
   - `setup_intent.created`
   - `payment_method.attached`
   - `customer.updated`
   - `invoice.created`
   - `invoice.finalized`
   - `invoice.payment_succeeded`
   - `billing_portal.configuration.created`
   - `billing_portal.session.created`

## 2. Configurazione Ambiente

### 2.1 Variabili d'Ambiente
Aggiorna il file `.env` con le seguenti variabili di produzione:

```env
# Stripe
STRIPE_SECRET_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
BASE_URL=https://tuo-dominio.com

# Supabase
POSTGRES_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# Auth
AUTH_SECRET=...
```

### 2.2 URL di Callback
Assicurati che tutti gli URL di callback puntino al dominio di produzione:
- `success_url` e `cancel_url` nel checkout
- `return_url` nel Customer Portal
- URL dei webhook

## 3. Test in Produzione

### 3.1 Carte di Test
Utilizza le seguenti carte di test per verificare i pagamenti:
- Carta di successo: 4242 4242 4242 4242
- Carta di errore: 4000 0000 0000 0002
- Carta che richiede autenticazione: 4000 0025 0000 3155

### 3.2 Verifica Webhook
1. Monitora i log dei webhook per assicurarti che:
   - Gli eventi vengano ricevuti correttamente
   - Le risposte siano 200 OK
   - I dati vengano aggiornati nel database

### 3.3 Test Funzionalità
Verifica che funzionino correttamente:
- Creazione nuovo abbonamento
- Aggiornamento piano
- Gestione metodo di pagamento
- Customer Portal
- Fatturazione automatica

## 4. Monitoraggio e Manutenzione

### 4.1 Monitoraggio
- Configura alert per errori di pagamento
- Monitora i webhook falliti
- Tieni traccia delle conversioni e dei churn

### 4.2 Manutenzione
- Aggiorna regolarmente le dipendenze
- Verifica la sicurezza delle API
- Backup regolari del database
- Monitora le performance del sistema

## 5. Troubleshooting

### 5.1 Problemi Comuni
1. **Webhook non ricevuti**
   - Verifica l'URL del webhook
   - Controlla i log del server
   - Verifica la firma del webhook

2. **Pagamenti falliti**
   - Controlla i log di Stripe
   - Verifica le carte di test
   - Controlla le impostazioni del prodotto

3. **Customer Portal non accessibile**
   - Verifica le configurazioni del portal
   - Controlla i permessi del cliente
   - Verifica gli URL di callback

### 5.2 Supporto
- [Documentazione Stripe](https://stripe.com/docs)
- [Documentazione Supabase](https://supabase.com/docs)
- [Documentazione Next.js](https://nextjs.org/docs) 
# AeroZip-Capstone

AeroZip-Capstone è un'applicazione web full-stack per la prenotazione di biglietti aerei, sviluppata come progetto finale. È dotata di un'interfaccia moderna e user-friendly e di un backend robusto per gestire la ricerca di voli, le prenotazioni e i pagamenti.

## Funzionalità

- **Autenticazione Utente**: Registrazione e login sicuri degli utenti tramite JWT.
- **Ricerca Voli**: Cerca voli per aeroporto di partenza e di arrivo, data e numero di passeggeri.
- **Selezione Voli**: Visualizza e seleziona da una lista di voli disponibili, incluse opzioni di sola andata e andata e ritorno.
- **Gestione Prenotazioni**: Un processo di prenotazione a più passaggi che permette agli utenti di inserire le informazioni dei passeggeri e selezionare i posti.
- **Selezione Posti**: Una mappa visuale dei posti per ogni volo, che permette agli utenti di scegliere i loro posti preferiti.
- **Elaborazione Pagamenti**: Integrazione sicura dei pagamenti con Stripe.
- **Gestione Profilo Utente**: Gli utenti possono visualizzare e modificare le informazioni del loro profilo, cambiare la password ed eliminare il loro account.
- **Notifiche Email**: Conferme email automatiche per prenotazioni e pagamenti.
- **Generazione Biglietti PDF**: Genera e invia biglietti in formato PDF agli utenti dopo una prenotazione andata a buon fine.

## Tecnologie Utilizzate

### Backend

- **Java 21**
- **Spring Boot 3**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **Stripe**
- **iText**
- **Mailgun**
- **OpenCSV**

### Frontend

- **Vite**
- **React**
- **TypeScript**
- **React Router**
- **Bootstrap**
- **Sass**

## Struttura del Progetto

Il progetto è diviso in due parti principali:

- **`Capstone-BE`**: Il backend, costruito con Spring Boot.
- **`Capstone-FE`**: Il frontend, costruito con React.

Originariamente il progetto era suddiviso in due repositories:

- [Front-End](https://github.com/Thomas-Galbignani/AeroZip-FE).
- [Back-End](https://github.com/Thomas-Galbignani/AeroZip-BE).

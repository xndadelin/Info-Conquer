---
description: >-
  Proiectul este organizat în două părți principale: Client și Server. Fiecare
  parte are roluri și responsabilități distincte, asigurând o arhitectură clară
  și modulară.
---

# 📁 Structura proiectului

### Client

Clientul reprezintă partea de frontend a aplicației, cu care utilizatorii interacționează direct. Este responsabil pentru crearea interfeței de utilizator și comunicarea cu serverul backend. Structura directorului client este organizată pentru a susține dezvoltarea, testarea și stilizarea aplicației.

* **`client/`**: Directorul principal pentru frontend, conținând toate resursele necesare pentru construirea interfeței utilizatorului.
  * **`cypress/`**: Configurații și teste E2E utilizând Cypress.
    * **`e2e/`**: Teste end-to-end pentru diferite funcționalități ale aplicației, asigurându-se că toate fluxurile de utilizatori sunt funcționale.
    * **`fixtures/`**: Date simulate utilizate în testele E2E pentru a replica scenarii reale.
    * **`support/`**: Configurări și comenzi personalizate pentru testele Cypress, facilitând reutilizarea codului și gestionarea configurărilor globale.
  * **`public/`**: Fișiere statice servite direct de serverul web, inclusiv `index.html`, imagini și fișiere de configurare (ex. manifest.json).
  * **`src/`**: Codul sursă al aplicației, structurat pentru a permite dezvoltarea modulară și reutilizarea componentelor.
    * **`assets/`**: Resurse grafice, inclusiv fonturi și imagini SVG, utilizate în interfața cu utilizatorul.
    * **`components/`**: Componente React reutilizabile, organizate pe funcționalități specifice (ex. autentificare, editare cod, etc.).
    * **`context/`**: Contextul global pentru gestionarea stării aplicației, utilizând React Context API.
    * **`hooks/`**: Hook-uri personalizate React care oferă funcționalități reutilizabile și logica specifică aplicației.
    * **`languages/`**: Fișiere de traducere și configurare pentru internaționalizare, suportând multiple limbi.
    * **`pages/`**: Componente de pagină pentru diferite secțiuni ale aplicației, structurate în funcție de rute și pagini specifice.
    * **`styles/`**: Fișiere CSS pentru stilizarea aplicației, inclusiv stiluri globale și specifice componentelor.
    * **`utils/`**: Funcții utilitare și module ajutătoare, utilizate în diverse părți ale aplicației pentru a reduce redundanța codului.

### Server

Serverul reprezintă partea de backend a aplicației, responsabilă pentru gestionarea cererilor de la client, procesarea acestora și interacțiunea cu baza de date. Structura serverului este organizată pentru a permite extensibilitatea și întreținerea ușoară a aplicației.

* **`server/`**: Directorul principal pentru backend, conținând toate resursele necesare pentru funcționarea serverului.
  * **`graphql/`**: Configurarea și implementarea API-ului GraphQL, care include:
    * **`mutations/`**: Mutări GraphQL pentru manipularea datelor, cum ar fi crearea, actualizarea și ștergerea entităților.
    * **`queries/`**: Interogări GraphQL pentru accesarea și recuperarea datelor, structurându-se pe tipuri de date și funcționalități.
    * **`typeDefs/`**: Definiții de tipuri GraphQL, specificând structura și tipologia datelor disponibile prin API.
  * **`isolate/`**: Sandbox pentru rularea codului nesigur, asigurând izolația față de sistemul gazdă și prevenind potențiale probleme de securitate.
  * **`models/`**: Modele pentru MongoDB utilizând Mongoose, organizate pe entități precum utilizatori, probleme, și articole. Modelele definesc structura și validarea documentelor în baza de date.
  * **`utils/`**: Funcții utilitare și module de suport pentru diferite funcționalități ale serverului, cum ar fi validarea cererilor, trimiterea emailurilor și gestionarea token-urilor.
  * **`index.js`**: Fișierul principal care configurează și pornește serverul, incluzând setările pentru middleware, rutele și conexiunea cu baza de date.
  * **`jest.setup.js`**: Configurare pentru testele unitare cu Jest, asigurându-se că toate dependențele și configurările necesare pentru testare sunt incluse.

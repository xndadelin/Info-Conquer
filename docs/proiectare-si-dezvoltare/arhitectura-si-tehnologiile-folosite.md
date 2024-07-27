# 👨‍💼 Arhitectura și tehnologiile folosite

### Arhitectura Generală

Proiectul utilizează o arhitectură de tip client-server, cu Apollo Client gestionând cererile de date pe partea clientului și Apollo Server expunând API-ul GraphQL pe partea serverului.&#x20;

Această arhitectură modulară permite dezvoltarea eficientă și o separare clară a responsabilităților, facilitând scalabilitatea și întreținerea sistemului.

* **Client**:
  * **Frontend-ul** aplicației este construit cu React și include componente pentru interfața utilizatorului, gestionarea stării și comunicarea cu backend-ul prin GraphQL. Utilizatorii interacționează direct cu frontend-ul pentru a vizualiza și manipula date.
  * **Testarea** este realizată utilizând Cypress pentru a verifica funcționalitatea end-to-end a aplicației și a asigura că toate fluxurile de utilizatori sunt corect implementate.
* **Server**:
  * **Backend-ul** este construit pe Node.js cu Express și GraphQL, gestionând cererile de la client și comunicând cu baza de date MongoDB.
  * **Sandboxing** cu Isolate asigură că codul nesigur este executat într-un mediu izolat, protejând sistemul gazdă de potențiale atacuri.
  * **Funcționalitățile backend** includ manipularea datelor prin mutări și interogări GraphQL, gestionarea utilizatorilor și trimiterea de notificări prin email.

<figure><img src="broken-reference" alt=""><figcaption><p>Arhitectura client - server</p></figcaption></figure>

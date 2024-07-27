---
description: În cadrul proiectului, am construit un server utilizând Node.js și Express.
---

# 🖥️ Backend

* 🔗 **Comunicare Client-Server**: Pentru interacțiunea dintre client și server, am implementat [GraphQL](https://graphql.org/). GraphQL este un limbaj de interogare pentru API-uri bazat pe grafuri de date, care permite clientului să solicite exact datele de care are nevoie. Acesta expune un singur endpoint: `/graphql`, prin care sunt trimise toate mutațiile și interogările. Acest lucru simplifică și eficientizează gestionarea cererilor de date.
* 🚀 **API GraphQL**: **Apollo Server** este utilizat ca un add-on pentru framework-ul Express, facilitând crearea și gestionarea unui API GraphQL. Apollo Server se integrează cu Express pentru a permite manipularea și livrarea datelor într-un mod organizat și flexibil.
* 🗄️ **Bază de Date**: Am ales [MongoDB](https://www.mongodb.com/) ca sistem de gestionare a bazei de date, datorită modelului său orientat pe documente care oferă o flexibilitate mare în stocarea și manipularea datelor. **MongoDB Atlas** este utilizat pentru găzduirea bazei de date în cloud, oferind un serviciu complet de administrare, scalabilitate și securitate pentru datele noastre.
* 🛡️ **Sandboxing**: Pentru a crea un mediu izolat și sigur față de sistemul gazdă, am implementat [Isolate](https://github.com/ioi/isolate). Isolate este un sandbox destinat rulării de programe nesigure, asigurând un mediu cu acces limitat pentru a preveni orice potențială afectare a sistemului gazdă. Aceasta protejează sistemul gazdă de cod malițios trimis de utilizatori.
* 🧼 **Curățarea HTML-ului**: Am utilizat **DOMPurify** pentru a curăța HTML-ul generat de utilizatori, prevenind astfel atacurile de tip XSS (Cross-Site Scripting). DOMPurify asigură că datele afișate în aplicație sunt sigure și nu conțin cod malițios.
* 🔑 **Variabile de Mediu**: **dotenv** este utilizat pentru a încărca variabilele de mediu dintr-un fișier `.env`. Acest lucru permite gestionarea configurărilor sensibile, cum ar fi cheile API și informațiile de autentificare, într-un mod securizat și accesibil.
* 🔐 **Criptare și Autentificare**: **bcrypt** este folosit pentru criptarea parolelor, asigurând securitatea acestora în baza de date. De asemenea, **jsonwebtoken** este utilizat pentru generarea și validarea token-urilor JWT (JSON Web Tokens), facilitând autentificarea și autorizarea utilizatorilor.
* 📧 **Trimitere Emailuri**: **nodemailer** este folosit pentru trimiterea de emailuri din aplicație. Aceasta librărie simplifică procesul de trimitere a emailurilor prin diverse servicii SMTP.
* 🛠️ **Monitorizare și Testare**: **nodemon** este folosit pentru a monitoriza modificările din codul sursă și a reporni automat serverul, îmbunătățind eficiența dezvoltării. J**est** este folosit pentru testarea unității și a integrării, asigurându-se că toate componentele backend-ului funcționează corect și că modificările nu introduc erori.

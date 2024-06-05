# InfoConquer

#### InfoConquer este o platformă educațională online dedicată algoritmicii, axată pe furnizarea unei experiențe de învățare interactivă și eficientă pentru utilizatori de toate nivelele de competență în programare. Principala sa caracteristică este un instrument numit code judger, care evaluează codul scris de utilizatori prin rularea acestuia împotriva unor seturi de cazuri de test predefinite și oferă feedback imediat și detaliat.

# Cum sa instalezi si sa rulezi?

Pentru a instala și rula proiectul, urmați acești pași:

1. Clonează acest repository pe mașina ta locală:

   ```bash
   git clone https://github.com/xndadelin/Info-Conquer
   ```

2. Asigură-te că ai instalată cea mai nouă versiune de Node.js și Docker.

3. Intră în directorul proiectului:

   ```bash
   cd Info-Conquer
   ```

4. Instalează dependențele proiectului folosind un manager de pachete, npm, in ambele directoare ale proiectului:

   ```bash
   >client: npm install
   ```

   ```bash
   >server: npm install
   ```

5. Pentru a configura variabilele de mediu, creează un fișier `.env` în directorul `server` si `client` și adaugă următoarele variabile:

   `/server/.env`

   ```
   MONGO_DB_CONN=
   SECRET=
   SECRET_REFRESH=
   EMAIL_HOST=
   EMAIL_PORT=
   EMAIL_USER=
   EMAIL_PASS=
   CLIENT_URL=
   TURNSTILE_SECRET_KEY
   OPENAI_API_KEY=
   MODE=dev || prod
   ```

   `/client/.env`

   ```
   REACT_APP_SERVER=http://localhost:8080
   REACT_APP_SITE_KEY= (for turnstile cloudflare)
   ```

6. Rulează aplicațiile (BE & FE):

   ```bash
   >client: npm run start:dev
   ```

   ```bash
   >server: npm run start
   ```

   Aceasta va porni serverul de dezvoltare și veți putea accesa aplicația în browser la adresa `http://localhost:3000`.

7. Pentru a opri serverul de dezvoltare, apăsați `Ctrl + C` în terminal.

8. [Docs](https://drive.google.com/file/d/1_Lo7s8pUpVfLTK9L65YzGYa6KdQ9cj11/view)

9. Menționez că svg-urile nu sunt realizate de mine, ci sunt furnizate de FontAwesome.

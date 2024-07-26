---
description: >-
  Pe InfoConquer, autentificarea și autorizarea utilizatorilor sunt gestionate
  eficient folosind JSON Web Tokens (JWT).
---

# 🔐 JWT

JWT este un standard deschis care permite transmiterea sigură a informațiilor între părți sub formă de token-uri criptate.

După autentificare, serverul generează un JWT care conține informații despre utilizator, precum ID-ul și rolul. Token-ul este semnat cu o cheie secretă pentru a asigura autenticitatea.

La fiecare cerere ulterioară, clientul trimite JWT-ul în antetul cererii. Serverul verifică token-ul pentru a confirma că este valid și că utilizatorul are accesul necesar.

Sistemul utilizează două tipuri de token-uri:

1. **Token Primar (Access Token)**: Utilizat pentru autentificarea utilizatorilor în cererile către server. Acest token are o durată de viață scurtă și expiră după un timp scurt pentru a spori securitatea.
2. **Token de Reîmprospătare (Refresh Token)**: Utilizat pentru a obține un nou access token atunci când acesta expiră. Refresh token-urile au o durată de viață mai lungă și permit reautentificarea fără a necesita introducerea din nou a credentialelor.

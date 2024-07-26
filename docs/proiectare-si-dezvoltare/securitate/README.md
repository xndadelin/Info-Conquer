---
description: >-
  Pentru a asigura un mediu sigur și protejat pentru utilizatori, proiectul
  integrează mai multe straturi de securitate.
---

# 🛡️ Securitate

* **Protecție CSRF (Cross-Site Request Forgery)**: Ai implementat protecția împotriva atacurilor CSRF pentru a preveni scenarii în care utilizatorii pot fi forțați să efectueze acțiuni neautorizate pe site-ul tău. Acest lucru se poate face prin utilizarea token-urilor CSRF care sunt validate pe server pentru a confirma că cererea provine de la utilizatorul legitim.
* **Limitare de Rată (Rate Limiting)**: Aplici limitări de rată pentru a preveni abuzurile și atacurile de tip DoS (Denial of Service). Aceasta ajută la menținerea unui echilibru echitabil în accesarea resurselor serverului și protejează sistemul împotriva solicitărilor excesive care ar putea duce la supraîncărcare.
* **Caching**: Utilizezi tehnici de caching pentru a îmbunătăți performanța aplicației tale și a reduce încărcarea serverului. Prin stocarea și reutilizarea datelor frecvent accesate, îmbunătățești timpii de răspuns și eficiența generală a aplicației.
* **Sanitizare DOM (DOMPurify)**: Aplici biblioteca DOMPurify pentru a curăța și sanitiza datele introduse de utilizatori, prevenind atacurile de tip Cross-Site Scripting (XSS). Această practică garantează integritatea paginilor tale web prin eliminarea codului malițios.
* **Token-uri JWT (JSON Web Tokens)**: Folosești JSON Web Tokens pentru autentificare și autorizare. Aceste token-uri asigură că doar utilizatorii autorizați pot accesa resursele protejate și permit verificarea sigură a identității utilizatorilor prin includerea informațiilor de autentificare în token.
* **Hashing Parole**: Protejezi parolele utilizatorilor prin utilizarea algoritmilor de hashing siguri, precum bcrypt. Aceasta garantează că parolele sunt stocate în mod securizat, astfel încât nu pot fi recuperate sau expuse în formatul lor original. Bcrypt, cu funcția sa de saltare și complexitate adaptivă, este o alegere robustă pentru securizarea parolelor.

---
description: >-
  Infoconquer utilizează bcrypt pentru a proteja parolele utilizatorilor,
  asigurându-se că datele sunt securizate în mod eficient și că riscurile de
  compromitere sunt minimizate.
---

# 🔑 Hashing parole

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

Când un utilizator își creează sau actualizează parola, aceasta este procesată de funcția bcrypt. bcrypt generează un hash complex al parolei, care include un "salt" unic pentru fiecare parolă.

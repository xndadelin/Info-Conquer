# 🗝️ Protectie CSRF

Cross-Site Request Forgery (CSRF) este un tip de atac în care un utilizator rău intenționat induce un utilizator autenticat să execute acțiuni nedorite pe un site web pe care este deja autentificat. Aceste acțiuni pot include trimiterea de formulare, modificarea setărilor sau alte interacțiuni care afectează datele utilizatorului sau starea aplicației. Protecția împotriva CSRF este esențială pentru prevenirea acestor atacuri și asigurarea integrității și securității aplicației web.

Pentru a preveni atacurile CSRF, utilizez un token, un cod unic generat de server și asociat cu fiecare sesiune a utilizatorului. Acest token este inclus în fiecare cerere trimisă de utilizator și este verificat de server pentru a se asigura că cererea provine de la utilizatorul autenticat.&#x20;

```javascript
const { getUser } = require('./getUser');
const cookie = require('cookie');

module.exports = async (req, res, next) => {
    const context = { req, res };
    const user = await getUser(context);

    if (user) {
        const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
        const tokenFromCookie = cookies.csrfToken;
        const tokenFromHeader = req.headers['x-csrf-token'];

        if (tokenFromCookie && tokenFromHeader && tokenFromCookie === tokenFromHeader) {
            next();
        } else {
            res.status(403).json({ message: 'CSRF token is missing or invalid' });
        }
    } else {
        next();
    }
};
```

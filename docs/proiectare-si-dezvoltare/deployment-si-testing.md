---
description: Pentru deploymentul aplicației InfoConquer, se utilizează Linode și Nginx.
---

# ☁️ Deployment si testing

*   **Linode**: Este folosit pentru găzduirea aplicației, oferind un VPS configurat cu următoarele resurse:

    * **RAM**: 4GB
    * **CPU Cores**: 2
    * **Stocare**: 80GB

    Linode asigură performanța necesară pentru a rula aplicația InfoConquer, oferind resurse suficiente pentru gestionarea cererilor și procesarea datelor.
* **Nginx**: Este utilizat ca server web și server de proxy invers pentru a gestiona cererile HTTP. Configurarea Nginx include:
  * **Servirea Clientului**: Nginx este configurat pentru a livra fișierele statice ale aplicației client (frontend), cum ar fi HTML, CSS, și JavaScript.
  * **Servirea Serverului Node.js**: Nginx redirecționează cererile către aplicația Node.js care rulează serverul backend. Acesta asigură o comunicare eficientă între client și server și gestionează încărcarea aplicației.

### Testing

Pentru a asigura calitatea și funcționalitatea aplicației InfoConquer, sunt utilizate diferite tipuri de teste:

* Testare End-to-End cu Cypress:
  * Cypress este utilizat pentru a verifica funcționalitatea completă a aplicației, asigurându-ne că toate componentele lucrează împreună conform așteptărilor.
* Testare Unități cu Jest:
  * Jest este utilizat pentru a testa funcțiile individuale și modulele aplicației pentru a asigura că logica aplicației funcționează corect.

Prin combinarea testelor end-to-end cu Cypress și testelor unități cu Jest, se asigură o acoperire completă a testării aplicației, identificând și corectând problemele înainte de lansarea în producție.

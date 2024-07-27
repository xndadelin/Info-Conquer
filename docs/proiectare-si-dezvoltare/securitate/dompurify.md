# 🌊 DomPurify

DOMPurify este o bibliotecă JavaScript folosită pentru a curăța conținutul HTML de cod malițios sau nevalid. Este utilizată pentru a preveni atacuri de tip Cross-Site Scripting (XSS) prin eliminarea scripturilor sau a altor elemente potențial periculoase din documentele web. DOMPurify asigură că datele care sunt prezentate utilizatorilor sunt sigure și nu conțin cod rău intenționat.

```javascript
<script>alert('xss is working, ooooooops');</script>
<p>hello world</p>
```

Acesta un script JavaScript malițios care va afișa o alertă atunci când HTML-ul este executat. Scopul este de a arăta cum un atacator ar putea insera cod malițios într-o aplicație web. DOMPurify va elimina tag-ul și orice conținut din el, lăsând doar conținutul permis. În acest caz, rezultatul curățat va fi:

<pre class="language-javascript"><code class="lang-javascript"><strong>// no script anymore
</strong>&#x3C;p>hello world&#x3C;/p>
</code></pre>

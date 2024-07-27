# 📥 Caching

Caching-ul este o tehnică utilizată pentru a stoca temporar date sau resurse într-un loc rapid accesibil, astfel încât cererile ulterioare pentru aceleași date sau resurse să poată fi satisfăcute mai repede. În contextul web-ului, caching-ul reduce timpul de răspuns al serverului și încărcarea acestuia, îmbunătățind performanța generală a aplicației și reducând consumul de resurse.

```nginx
proxy_cache_path /var/cache/nginx/proxy_cache levels=1:2 keys_zone=my_cache:100m max_size=10g inactive=60m use_temp_path=off;
```

* **`/var/cache/nginx/proxy_cache`**: Directorul unde sunt stocate fișierele cache.
* **`levels=1:2`**: Structura directoarelor de cache pe disc (niveluri 1 și 2).
* **`keys_zone=my_cache:100m`**: Spațiu de memorie de 100 MB pentru metadatele cache-ului.
* **`max_size=10g`**: Dimensiunea maximă a cache-ului pe disc (10 GB).
* **`inactive=60m`**: Fișierele neaccesate timp de 60 de minute sunt șterse.
* **`use_temp_path=off`**: Scrie fișierele direct în directorul de cache, fără director temporar.

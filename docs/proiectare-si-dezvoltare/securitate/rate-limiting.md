# 📈 Rate limiting

Limitarea ratei este o tehnică esențială de securitate și performanță utilizată pentru a controla numărul de cereri pe care un client le poate trimite către server într-un interval de timp specificat. Aceasta ajută la prevenirea abuzurilor și a atacurilor de tip Denial of Service (DoS) care pot suprasolicita resursele serverului și degradează experiența utilizatorului.

```nginx
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
```

* **`$binary_remote_addr`**: Identifică cererile după IP-ul clientului.
* **`zone=mylimit:10m`**: Zona de memorie de 10 MB pentru stocarea limitelor.
* **`rate=10r/s`**: Limitează la 10 cereri pe secundă per IP.

```nginx
limit_req_zone $server_name zone=global:10m rate=1000r/s;
```

* **`$server_name`**: Identifică cererile după numele serverului.
* **`zone=global:10m`**: Zona de memorie de 10 MB pentru stocarea limitelor globale.
* **`rate=1000r/s`**: Limitează la 1000 cereri pe secundă pentru toate cererile către server.

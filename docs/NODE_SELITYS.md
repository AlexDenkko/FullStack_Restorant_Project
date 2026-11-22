# Node.js-koodin selitys opettajalle

1. `script.js` käyttää `fetch('/api?action=restaurants')`-kutsua; selain ei tunne tietokantatunnuksia.
2. `server.js` vastaanottaa HTTP-pyynnön Expressillä ja hakee ravintolat ulkoisesta REST API:sta.
3. Rekisteröinnissä palvelin tarkistaa syötteet, hajauttaa salasanan `scrypt`-algoritmilla ja tallentaa käyttäjän MariaDB:hen parametrisoidulla SQL-kyselyllä.
4. Kirjautumisessa tarkistetaan salasana ja tallennetaan käyttäjätunniste istuntoon; selaimelle lähetetään vain istuntoeväste.
5. Suosikit tallennetaan `favorites`-tauluun käyttäjätunnisteen ja ravintolatunnisteen perusteella.
6. `X-CSRF-Token` tarkistetaan muutoksia tekevissä pyynnöissä, jotta ulkopuolinen sivu ei voisi helposti suorittaa toimintoja käyttäjän istunnolla.
7. `.env` pitää tietokantasalasanan pois GitHubista ja selainkoodista.
8. `database/schema.sql` sisältää `users`- ja `favorites`-taulut sekä niiden välisen viiteavaimen.

**Kehitettävää ennen julkaisua:** pysyvä istuntovarasto, API:n oikean muodon varmistus, tarkemmat tiedostotarkistukset ja toiminnalliset testit.

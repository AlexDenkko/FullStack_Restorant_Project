# Opiskelijalounas — Node.js + MariaDB

Tämä on **kehityspohja**, ei vielä julkaistu tai oikeaa REST API:a / MariaDB:tä vasten testattu valmis työ. Selainpuolella on vain HTML, CSS ja vanilla JavaScript; Node.js-palvelimella käytetään Express-, express-session-, mariadb- ja multer-paketteja. Tarkista opettajalta backend-pakettien hyväksyttävyys.

## Käynnistys Windowsissa

1. Avaa kansio VS Codessa ja terminaali projektin juuressa.
2. Tarkista `node -v` (Node 22 tai uudempi). Suorita `npm install`.
3. Avaa MariaDB-komentorivi: `mariadb -u root -p` (tai `mysql -u root -p`).
4. Suorita SQL: `SOURCE C:/POLKU/Opiskelijalounas_Node/database/schema.sql;` (vaihda polku).
5. Luo rajattu käyttäjä MariaDB:ssä (vaihda salasana):
   ```sql
   CREATE USER 'lounas_app'@'127.0.0.1' IDENTIFIED BY 'OMA_VAHVA_SALASANA';
   GRANT SELECT, INSERT, UPDATE, DELETE ON opiskelijalounas.* TO 'lounas_app'@'127.0.0.1';
   ```
   Jos tunnus on jo olemassa, tarkista sen salasana ja oikeudet.
6. Kopioi `.env.example` nimellä `.env`. Aseta `DB_PASSWORD` ja `SESSION_SECRET` (vähintään 32 satunnaista merkkiä). Älä julkaise `.env`-tiedostoa.
7. Käynnistä `npm start`. Avaa `http://localhost:8000/?demo=1` testataksesi käyttöliittymää kuvitteellisilla ravintoloilla.
8. Avaa `http://localhost:8000/` ja kokeile oikeaa REST API:a. Rajapinnan osoite ja JSON-rakenne on **vahvistettava** opettajan materiaalista.
9. Rekisteröidy, kirjaudu, tallenna suosikki ja kokeile profiilia. Varmista tiedot MariaDB:stä.

## Rakenne

- `index.html` – sivun rakenne
- `style.css` – tyylit ja responsiivisuus
- `script.js` – selaimen vanilla JavaScript, `fetch('/api?...')`
- `server.js` – Node.js REST-välipalvelin, kirjautuminen, profiili, suosikit
- `database/schema.sql` – MariaDB-taulut
- `.env.example` – palvelimen asetusten malli
- `docs/TESTAUS.md` – alkuperäinen testauslista (PHP-viittaukset korvattava Node.js-vastineilla)
- `docs/KOODIN_SELISTYS.md` – alkuperäinen selitys (PHP-osuus vanhentunut)

## Tärkeät rajoitukset

- REST API:n oletuspolut `restaurants`, `menus/daily/{id}/{lang}`, `menus/weekly/{id}/{lang}` ovat **vahvistamatta**.
- MariaDB-integraatiota ei ole vielä testattu käyttäjän koneella.
- Express-sessionin oletusmuistivarasto on vain paikalliseen kehitykseen. Julkiseen julkaisuun tarvitaan pysyvä sessiovarasto, HTTPS, palvelinympäristön suojaus ja tarkempi kuvatiedostojen validointi.
- Nykyinen profiilikuvan tiedostotarkistus tarkistaa tiedoston tunnisteen sisällöstä, mutta ei vielä dekoodaa kuvaa kokonaan.
- Rekisteröitymisen salasanat ovat scrypt-hajautettuja; MariaDB:hen ei tallenneta selväkielisiä salasanoja.
- GitHub Pages ei suorita Node.js-palvelinta. Julkaisu vaatii Node.js:ää ja MariaDB:tä tukevan palvelimen.
- Ennen palautusta validoi HTML ja CSS, testaa näppäimistöllä ja mobiilissa sekä dokumentoi API:n todelliset vastaukset.

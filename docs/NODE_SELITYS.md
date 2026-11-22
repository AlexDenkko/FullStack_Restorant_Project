# Node.js-palvelimen selitys opettajalle

## Palvelimen rooli

`server.js` käynnistää Express-palvelimen. Selain kutsuu osoitetta `/api`, eikä selaimelle koskaan lähetetä MariaDB:n kirjautumistunnuksia. Palvelin käyttää `mariadb`-paketin yhteyspoolia ja hakee ulkoiset ravintolatiedot `fetch`-kutsuilla.

## Keskeiset toiminnot

1. **Ravintolat:** `GET /api?action=restaurants` välittää tiedot ulkoisesta API:sta.
2. **Ruokalistat:** `GET /api?action=menu&id=...&period=day|week&lang=fi|en` käyttää polkua `restaurants/daily/{id}/{lang}` tai `restaurants/weekly/{id}/{lang}`.
3. **Rekisteröinti:** palvelin tarkistaa käyttäjänimen, sähköpostin ja salasanan sekä tallentaa salasanan `scrypt`-tiivisteenä.
4. **Kirjautuminen:** palvelin tarkistaa sähköpostin ja salasanan ja uusii istunnon onnistuneen kirjautumisen jälkeen.
5. **Suosikit:** käyttäjän omat suosikit tallennetaan `favorites`-tauluun parametrisoiduilla SQL-kyselyillä.
6. **Profiili:** kirjautunut käyttäjä voi muuttaa nimeään ja sähköpostiaan sekä tallentaa rajatun kokoisen profiilikuvan.
7. **Uloskirjautuminen:** istunto tuhotaan ja eväste poistetaan.

## Turvallisuusratkaisut

- SQL-kyselyissä käytetään `?`-parametreja.
- Salasanat tallennetaan `scrypt`-tiivisteinä satunnaisen suolan kanssa.
- `express-session` käyttää `httpOnly`- ja `sameSite=lax`-evästeasetuksia; tuotantotilassa `secure` on käytössä.
- Muuttavat pyynnöt tarkistavat `X-CSRF-Token`-otsakkeen.
- Istunto uusitaan kirjautumisen ja rekisteröinnin yhteydessä.
- API-pyynnöillä on aikakatkaisu, ja ulkoisen vastauksen kokoa rajoitetaan.
- Profiilikuvalla on 2 Mt:n kokoraja ja tiedoston alkutunnisteeseen perustuva tyyppitarkistus.
- `.env` ei kuulu GitHubiin; `.env.example` sisältää vain esimerkkiarvot.

## Kehityskohteet ennen tuotantojulkaisua

- **Istuntovarasto:** Expressin oletus-MemoryStore sopii vain paikalliseen kehitykseen. Tuotannossa tarvitaan pysyvä, jaettu istuntovarasto.
- **Kirjautumisyritysten rajoitus:** nykyinen istuntokohtainen rajoitus ei riitä yksinään. Tarvitaan palvelinpuolinen rajoitus, jota uuden istunnon luonti ei kierrä.
- **Profiilikuvat:** nykyinen tarkistus ei dekoodaa kuvaa kokonaan; kuvatiedostojen käsittelyä voidaan vahvistaa.
- **Julkaisu:** tuotantoympäristöön tarvitaan HTTPS, turvalliset salaisuudet ja toimiva MariaDB-yhteys.
- **Testit:** automatisoidut palvelin- ja integraatiotestit puuttuvat dokumentoidusta testausnäytöstä.

## Miksi Node.js eikä PHP?

Tämä projektiversio käyttää Node.js:ää ja Expressiä. Aiemman PHP-toteutuksen kuvaukset eivät koske nykyistä palvelinta. JavaScriptiä käytetään sekä selaimessa että palvelinpuolella, mutta MariaDB-yhteys tehdään vain palvelimelta.

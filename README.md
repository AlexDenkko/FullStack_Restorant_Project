# Opiskelijalounas

Opiskelijalounas on opiskelijaravintoloiden hakupalvelu. Sovelluksella voi hakea ravintoloita, tarkastella päivän ja viikon ruokalistoja sekä tallentaa suosikkiravintoloita omalle käyttäjätilille.

## Teknologiat

- Selain: HTML, CSS ja tavallinen JavaScript (ei frontend-kehystä)
- Palvelin: Node.js, Express
- Tietokanta: MariaDB
- Kirjautumisistunnot: express-session
- Profiilikuvat: multer
- Ravintolatiedot ja ruokalistat: Metropolian ravintola-REST-rajapinta

## Ominaisuudet

- Ravintoloiden haku nimellä tai osoitteella sekä suodatus kaupungin ja palveluntarjoajan mukaan
- Päivän ja viikon ruokalistat; hinnat näytetään, jos API palauttaa ne
- Ravintolan sijainti kartalla, jos koordinaatit ovat saatavilla
- Käyttäjätilin rekisteröinti, kirjautuminen ja uloskirjautuminen
- Suosikkien lisääminen ja poistaminen sekä ruokalistan avaaminen suosikeista
- Profiilin tietojen muokkaus ja profiilikuvan lähetys
- Suomi ja englanti sekä tumma ja vaalea teema
- Responsiivinen näkymä; ravintolalista ja ruokalista/kartta ovat erikseen vieritettäviä myös mobiilissa
- Lyhyillä sivuilla footer pysyy ikkunan alareunassa

## Paikallinen käyttöönotto (Windows)

1. Asenna Node.js (projektissa käytetty Node 22 tai uudempi) ja MariaDB.
2. Avaa projektin juurikansio VS Codessa.
3. Suorita `npm install`.
4. Luo MariaDB:n tietokantarakenne tiedoston `database/schema.sql` avulla, esimerkiksi MariaDB-komentoriviltä komennolla `SOURCE C:/oma/polku/database/schema.sql;`.
5. Luo tietokantakäyttäjä ja anna sille vain tarvittavat oikeudet (SELECT, INSERT, UPDATE, DELETE projektin tietokantaan). Esimerkki käyttäjätunnuksesta on `lounas_app`.
6. Kopioi `.env.example` tiedostoksi `.env` ja täytä oma `DB_PASSWORD` sekä vähintään 32 satunnaisen merkin `SESSION_SECRET`. Älä lisää `.env`-tiedostoa GitHubiin.
7. Käynnistä palvelin komennolla `npm start`.
8. Avaa `http://localhost:8000/`.

Testikäyttöliittymän kuvitteelliset ravintolat saa näkyviin osoitteessa `http://localhost:8000/?demo=1`. Tämä ei korvaa oikean API:n ja tietokannan testausta.

## Sovelluksen toiminta

Selain lähettää pyynnöt osoitteeseen `/api` esimerkiksi `?action=restaurants` ja `?action=menu&id=...&period=day&lang=fi`. `server.js` hakee ravintolatiedot ulkoisesta API:sta ja käsittelee käyttäjätoiminnot MariaDB:ssä. Tietokannan tunnukset pysyvät palvelimella.

Ruokalista-API:n käytössä oleva polku on `restaurants/daily/{id}/{lang}` tai `restaurants/weekly/{id}/{lang}`. Ruokalistan hinta näytetään vain, kun se sisältyy API:n vastaukseen.

## Projektin tiedostot

- `index.html` – sivun rakenne ja lomakkeet
- `style.css` – ulkoasu, teemat ja responsiivisuus
- `script.js` – käyttöliittymän logiikka, tapahtumat ja API-pyynnöt
- `server.js` – Express-palvelin, kirjautuminen, profiili, suosikit ja ravintola-API:n välitys
- `database/schema.sql` – tietokantataulujen määrittely
- `.env.example` – ympäristömuuttujien esimerkki
- `docs/KOODIN_SELISTYS.md` – toiminnan selitys opettajalle
- `docs/NODE_SELITYS.md` – palvelinpuolen tarkempi selitys
- `docs/TESTAUS.md` – testitulokset ja jatkotestit

## Testauksen tilanne

Käyttäjä on testannut toimiviksi ravintoloiden latauksen ja haun, päivän ja viikon ruokalistat, saatavilla olevat hinnat, rekisteröinnin ja kirjautumisen, suosikit, profiilin muokkauksen, kielivalinnan ja teemat. Käyttöliittymän vieritystä, footerin sijoittelua ja suosikeista ruokalistaan siirtymistä on myös korjattu ja tarkasteltu. Katso yksityiskohdat ja avoimet testit tiedostosta `docs/TESTAUS.md`.

## Tietoturva ja julkaisu

Salasanat tiivistetään `scrypt`-algoritmilla; SQL-kyselyt käyttävät parametreja; muuttavat pyynnöt tarkistavat CSRF-tunnisteen. `.env` ja `node_modules` jätetään Gitin ulkopuolelle. `npm audit` palautti käyttäjän paikallisessa tarkistuksessa **0 tunnettua haavoittuvuutta** (22.11.2026).

**Sovellusta ei ole dokumentoidusti julkaistu tuotantopalvelimelle.** Ennen julkaisua tarvitaan mm. pysyvä istuntovarasto (Expressin oletus-MemoryStore ei sovi tuotantoon), HTTPS, kirjautumisyritysten rajoituksen vahvistaminen ja kattavammat toiminnalliset sekä saavutettavuustestit. GitHub Pages ei yksin suorita Node.js-palvelinta tai MariaDB:tä.

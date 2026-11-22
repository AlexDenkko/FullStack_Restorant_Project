# Näin selität sovelluksen opettajalle

## 1. Yhden lauseen yhteenveto

"Rakensin opiskelijaravintoloiden hakupalvelun: selain hakee ravintolat ja ruokalistat PHP:n REST-rajapinnan kautta, ja MariaDB tallentaa käyttäjät, profiilit ja suosikit. Selainpuolella on vain HTML, CSS ja tavallinen JavaScript."

## 2. Mitä tiedostot tekevät?

- `index.html`: määrittelee sivun sisällön ja lomakkeet. Esimerkiksi `id="restaurant-list"` on tyhjä lista, johon JavaScript lisää ravintolakortit.
- `style.css`: määrittelee ulkoasun. `:root` sisältää vaalean teeman värit ja `[data-theme="dark"]` korvaavat ne tumman teeman väreillä. `@media`-säännöillä sivu mukautuu puhelimiin.
- `script.js`: hakee DOM-elementtejä (`document.getElementById`), reagoi tapahtumiin (`addEventListener`), lähettää verkkopyyntöjä (`fetch`), suodattaa taulukoita (`filter`) ja piirtää tulokset DOM:iin (`createElement`, `textContent`).
- `api/index.php`: palvelimella ajettava ohjelma. Se välittää ravintola-API-pyynnöt ja käsittelee käyttäjätietoja MariaDB:ssä.
- `database/schema.sql`: luo kaksi taulua: `users` käyttäjille ja `favorites` käyttäjien tallentamille ravintoloille.

## 3. Tiedon kulku

```text
1. Käyttäjä painaa "Näytä lista".
2. script.js kutsuu fetch("api/index.php?action=menu&...").
3. PHP tekee GET-pyynnön opettajan ravintola-API:in.
4. Ravintola-API palauttaa JSON-tiedot PHP:lle.
5. PHP palauttaa JSON:n selaimelle.
6. script.js muuntaa vastauksen päiviksi ja ruokalajeiksi.
7. DOM-käsittely näyttää listan HTML-sivulla.
```

Suosikeissa tiedon kulku on eri: JavaScript lähettää POST-pyynnön PHP:lle, joka tallentaa käyttäjän tunnisteen ja ravintolan tunnisteen MariaDB:n `favorites`-tauluun.

## 4. Tärkeitä käsitteitä yksinkertaisesti

- **REST API**: palvelu, jolta voi pyytää tietoja HTTP-pyyntöjen avulla.
- **JSON**: tekstimuotoinen tiedonsiirtotapa, esim. `{ "name": "Ravintola" }`.
- **`fetch`**: JavaScript-funktio, jolla selain lähettää HTTP-pyyntöjä.
- **`async/await`**: tapa odottaa verkkopyynnön vastausta pysäyttämättä koko verkkosivua.
- **DOM**: selaimen HTML-sivusta muodostama olioiden puu, jota JavaScript voi muuttaa.
- **`filter()`**: palauttaa alkuperäisestä taulukosta ne alkiot, jotka täyttävät ehdon.
- **`Set`**: joukko, jolla voidaan nopeasti tarkistaa, onko ravintola jo suosikeissa.
- **`localStorage`**: selaimen tallennustila harmittomille asetuksille, esim. kieli ja teema. Salasanoja ei tallenneta sinne.
- **PHP-istunto**: palvelimen tapa muistaa kirjautunut käyttäjä evästeen avulla.
- **PDO**: PHP:n sisäänrakennettu tietokantarajapinta. `prepare()` erottelee SQL-lauseen ja käyttäjän tiedon.
- **Foreign key**: viiteavain; `favorites.user_id` viittaa `users.id`-sarakkeeseen.

## 5. Kysymyksiä, joita opettaja saattaa esittää

**Miksi JavaScript ei ota yhteyttä suoraan MariaDB:hen?**
Koska muuten tietokantatunnukset pitäisi lähettää selaimeen ja kuka tahansa voisi nähdä ne. PHP toimii turvallisena välikerroksena.

**Miten verkkosivusi on responsiivinen?**
CSS:n grid- ja flex-asettelut mukautuvat. `@media(max-width:820px)` ja `@media(max-width:560px)` vaihtavat korttien määrää, asettelua ja navigaatiota pienissä näytöissä.

**Miten vaihdat teeman?**
JavaScript muuttaa HTML-elementin `data-theme`-attribuuttia. CSS:n muuttujat vaihtavat väripalettia, ja valinta säilytetään `localStorage`-muistissa.

**Miksi on kaksi tietokantataulua?**
Yhdellä käyttäjällä voi olla monta suosikkia ja sama ravintola voi olla monen käyttäjän suosikki. Erillinen `favorites`-taulu sopii tähän suhteeseen ja välttää tiedon turhan toistamisen.

**Miksi salasanan arvo näyttää tietokannassa erilaiselta?**
Tallennan hashin `password_hash()`-funktiolla ja tarkistan kirjautumisessa `password_verify()`-funktiolla, enkä tallenna salasanaa selkokielisenä.

**Miten sijaintitoiminto toimii?**
Käyttäjä painaa itse lähin-painiketta. Selain pyytää luvan sijaintiin. JavaScript laskee Haversinen kaavalla etäisyydet ravintoloiden koordinaateista ja järjestää listan. Jos sijainti estetään, muut toiminnot säilyvät käytössä.

**Miten huomioit saavutettavuuden?**
Käytän HTML:n semanttisia elementtejä, tekstikenttien `label`-nimiöitä, selviä kontrastivärejä, näppäimistön focus-tiloja, aria-attribuutteja ja `aria-live`-tilailmoituksia. Lopuksi ne on vielä varmistettava selaimessa ja validaattorilla.

**Mikä olisi syy siihen, ettei ruokalistaa näy?**
Ulkoisen REST-rajapinnan palvelin voi olla pois päältä, polku voi olla väärin tai JSON-rakenne voi poiketa oletuksesta. Katson silloin ensin Developer Tools → Network ja Console sekä PHP:n virhelokit.

## 6. Harjoitus, jolla varmistat osaamisen

Kokeile itse muuttaa yhtä suodattimen toimintoa, yhtä CSS-muuttujaa ja yhtä käännöstekstiä. Selitä sitten ääneen, missä järjestyksessä koodi toimii, kun käyttäjä valitsee ravintolan. Tämä auttaa osoittamaan, että ymmärrät myös muokkaamasi koodin.

# Testauslista ennen palautusta

Merkitse kohta valmiiksi vasta, kun olet itse testannut sen. Näin voit osoittaa opettajalle mitä testasit.

## A. UI ja saavutettavuus

- [ ] Käyttöliittymä näkyy Windowsin Chromessa ja Firefoxissa.
- [ ] Näytön leveydet 320 px, 390 px, 768 px, 1024 px ja 1440 px: ei vaakavieritystä.
- [ ] Hampurilaisvalikko avautuu / sulkeutuu ja sen `aria-expanded` vaihtuu oikein.
- [ ] Näppäimistön Tab-käytössä focus näkyy selvästi. Enter ja Space toimivat painikkeissa.
- [ ] Kaikilla tekstikentillä on näkyvät labelit ja virheistä ilmoitetaan tekstinä.
- [ ] Päivä- ja viikkopainikkeiden `aria-pressed` ilmaisee oikean valinnan.
- [ ] Vaalea ja tumma teema toimivat; myös pienikokoinen teksti on luettavaa.
- [ ] Suomi ja englanti vaihtuvat. Tarkista myös virhe- ja latausviestit.
- [ ] Selaimen 200 % ja 400 % zoomauksessa tärkeät toiminnot ovat käytettävissä.
- [ ] W3C Nu HTML Checker ja CSS Validator: korjaa ilmoitetut virheet.
- [ ] Lighthouse Accessibility ja Performance: käy huomiot läpi, älä luota vain pistesummaan.

## B. Ravintolat ja REST API

- [ ] Ilman `?demo=1` ravintolat tulevat oikeasta rajapinnasta ja niiden määrä on järkevä.
- [ ] Yhden ravintolan päivän ruokalista näyttää oikeat ruoat ja päivämäärän.
- [ ] Viikon ruokalista näyttää eri päivien oikeat ruoat.
- [ ] Kaupunki-, palveluntarjoaja- ja tekstihaku toimivat myös samanaikaisesti.
- [ ] Nollan tuloksen tilanteessa näkyy selkeä viesti.
- [ ] Kun API ei vastaa, sovellus ei kaadu eikä näytä esimerkkiruokalistaa oikeana.
- [ ] Jos API:ssa ei ole koordinaatteja, kartta ei näytä väärää paikkaa.
- [ ] Sijainnin myöntämisen jälkeen lähin ravintola korostuu; sijainnin estäminen ei riko sovellusta.
- [ ] HTTP-rajapintakutsut näkyvät DevTools → Network -välilehdessä.

## C. MariaDB ja käyttäjätilit

- [ ] `SHOW TABLES;` näyttää `users` ja `favorites`.
- [ ] Rekisteröityminen lisää rivin `users`-tauluun.
- [ ] Sama sähköpostiosoite ei saa luoda toista käyttäjää.
- [ ] Väärällä salasanalla kirjautuminen epäonnistuu.
- [ ] Oikealla salasanalla sisäänkirjautuminen onnistuu myös sivun päivityksen jälkeen.
- [ ] Salasanaa ei löydy selkokielisenä MariaDB:stä eikä verkkovastauksesta.
- [ ] Suosikin lisääminen lisää rivin `favorites`-tauluun.
- [ ] Suosikin poisto poistaa rivin ja se pysyy poistettuna kirjautumisen jälkeen.
- [ ] Käyttäjä ei voi muokata muiden suosikkeja tai profiilitietoja.
- [ ] Profiilin nimen/sähköpostin muutos tallentuu.
- [ ] Alle 2 Mt PNG/JPG/WebP -profiilikuva tallentuu ja näkyy uudelleen kirjautumisen jälkeen.
- [ ] Muuntyyppinen ja yli 2 Mt tiedosto hylätään myös palvelimella.
- [ ] Uloskirjautuminen mitätöi pääsyn profiiliin ja suosikkeihin.
- [ ] `api/config.local.php` puuttuu GitHub-repositorion tiedostolistasta.

## D. Julkaisu

- [ ] Julkinen osoite käyttää HTTPS:ää ja PHP + MariaDB toimivat siellä.
- [ ] Demo-merkintää ei näy julkisella oikean datan sivulla.
- [ ] GitHubissa on README ja looginen commit-historia.
- [ ] Opettaja pystyy avamaan julkisen sovelluksen ilman paikallista koneesi tietokantaa.
- [ ] Osaat itse selittää kaikki tiedostot ja pyydettäessä tarkastella Network-välilehteä.

## Kehittäjän tekemät tarkistukset tämän paketin luontivaiheessa

- `node --check script.js` = JavaScript-syntaksi läpäisi.
- `php -l api/index.php` = PHP-syntaksi läpäisi.
- `php -l api/config.example.php` = PHP-syntaksi läpäisi.
- `GET api/index.php?action=me` = palautti JSON-muotoisen vierailijaistunnon ja CSRF-tunnisteen.
- Oikean MariaDB:n ja ravintola-API:n integraatiot sekä selaimen visuaalitestit ovat **vielä tekemättä**, koska niitä ei voitu tehdä tässä ajoympäristössä.

# Opiskelijalounas – testausraportti ja tarkistuslista

Päivitetty: 22.11.2026. Merkinnät perustuvat käyttäjän ilmoittamiin testeihin ja projektin aikana tehtyihin käyttöliittymätarkistuksiin. Merkintä **testaamatta** ei tarkoita, että toiminto olisi rikki.

## A. Toiminnalliset testit – ilmoitettu toimiviksi

- [x] Ravintolat latautuvat oikeasta rajapinnasta.
- [x] Ravintoloiden hakutoiminto toimii.
- [x] Päivän ruokalista avautuu.
- [x] Viikon ruokalista avautuu.
- [x] Hinnat näkyvät, kun API palauttaa ne.
- [x] Rekisteröityminen toimii.
- [x] Kirjautuminen toimii.
- [x] Suosikkien lisääminen ja poistaminen toimii.
- [x] Profiilin muokkaaminen toimii.
- [x] Suomen ja englannin vaihtaminen toimii.
- [x] Vaalea ja tumma teema toimivat.
- [x] Suosikit-sivun "Näytä lista" siirtyy valitun ravintolan ruokalistaan (korjattu ja käyttäjän hyväksymä).
- [x] Ruokalistan ja kartan yhteinen vieritys toimii (käyttäjän hyväksymä).
- [x] Ravintolalistan erillinen vieritys tietokoneella ja mobiilissa toimii (käyttäjän hyväksymä).
- [x] Footerin sijoittelu lyhyillä sivuilla on korjattu (käyttäjän hyväksymä).

## B. Tekniset tarkistukset – ilmoitettu suoritetuiksi

- [x] `git ls-files .env` ei tulostanut seurattua `.env`-tiedostoa.
- [x] `.gitignore` sisältää `.env`-, `node_modules`- ja lokitiedostojen poissulut.
- [x] `npm audit`: **found 0 vulnerabilities** tarkistushetkellä.

## C. UI ja saavutettavuus – vielä varmistettava

- [ ] Chrome- ja Firefox-testit Windowsissa.
- [ ] Näytön leveydet 320, 390, 768, 1024 ja 1440 px: ei tahatonta vaakavieritystä.
- [ ] Mobiilivalikon avautuminen/sulkeutuminen ja `aria-expanded`.
- [ ] Näppäimistökäyttö: Tab, Enter, Space ja näkyvä kohdistus.
- [ ] Lomakkeiden virheviestit sekä labelit.
- [ ] Päivä/Viikko-painikkeiden `aria-pressed`.
- [ ] Kielenvaihdon vaikutus myös virhe- ja latausviesteihin.
- [ ] 200 % ja 400 % zoomaus.
- [ ] HTML- ja CSS-validointi.
- [ ] Lighthouse Accessibility ja Performance -tarkistus.

## D. Rajapinta ja virhetilanteet – vielä varmistettava

- [ ] Tekstihaku, kaupunki- ja palveluntarjoajasuodatin samanaikaisesti.
- [ ] Ei hakutuloksia -tilanteen viesti.
- [ ] API ei vastaa: sovellus näyttää virheen eikä kaadu.
- [ ] Puuttuvat koordinaatit: kartta ei näytä väärää sijaintia.
- [ ] Sijaintilupa sallittu/estetty: kumpikaan ei riko sovellusta.
- [ ] API-kutsujen tarkistus selaimen Network-välilehdellä.

## E. MariaDB ja käyttäjätilit – vielä varmistettava erikseen

- [ ] `SHOW TABLES;` näyttää `users` ja `favorites`.
- [ ] Rekisteröityminen lisää käyttäjän tietokantaan.
- [ ] Sama sähköpostiosoite ei voi rekisteröityä kahdesti.
- [ ] Väärä salasana hylätään.
- [ ] Istunto säilyy sivun päivityksen yli.
- [ ] Salasanaa ei tallenneta selkokielisenä eikä palauteta API-vastauksessa.
- [ ] Suosikkien lisäys ja poisto näkyvät tietokannassa ja säilyvät kirjautumisten välillä.
- [ ] Käyttäjä ei voi muokata toisen käyttäjän profiilia tai suosikkeja.
- [ ] Profiilikuvan sallittu tiedostotyyppi ja koko toimivat.
- [ ] Virheellinen tai yli 2 Mt:n profiilikuva hylätään palvelimella.
- [ ] Uloskirjautuminen estää pääsyn kirjautumista vaativiin tietoihin.

## F. Julkaisu – vielä tekemättä / vahvistamatta

- [ ] Julkinen HTTPS-osoite ja Node.js/MariaDB-palvelin toimivat.
- [ ] Tuotannon istuntovarasto on vaihdettu pysyvään ratkaisuun.
- [ ] Kirjautumisyritysten rajoitus on vahvistettu.
- [ ] GitHubissa on ajantasaiset dokumentit ja commit-historia.
- [ ] Opettaja voi avata julkisen sovelluksen, jos tehtävänanto sitä edellyttää.

## Testitulosten kirjaus jatkossa

Kun suoritat uuden testin, merkitse `[x]` vain, jos olet todella varmistanut tuloksen. Kirjaa mahdollisista ongelmista testin päivämäärä, ympäristö, toistovaiheet ja havaittu virhe. Älä merkitse automaattisesti läpäistyiksi testejä, jotka on vain päätelty koodista.

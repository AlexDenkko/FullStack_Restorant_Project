# Näin selität Opiskelijalounas-sovelluksen opettajalle

## 1. Yhden lauseen yhteenveto

"Rakensin opiskelijaravintoloiden hakupalvelun, jossa selain näyttää ravintolat ja ruokalistat, Node.js/Express välittää API-pyynnöt ja MariaDB tallentaa käyttäjätilit, profiilit ja suosikit. Selainpuolella käytän HTML:ää, CSS:ää ja tavallista JavaScriptiä."

## 2. Mitä tiedostot tekevät?

- `index.html` sisältää sivut, lomakkeet ja paikat, joihin JavaScript lisää sisältöä.
- `style.css` määrittelee värit, asettelun, teemat ja responsiiviset näkymät. Ravintolalista sekä ruokalista ja kartta voidaan vierittää erikseen.
- `script.js` hallitsee käyttöliittymän tilaa, käsittelee painalluksia, suodattaa ravintoloita, lähettää `fetch`-pyyntöjä ja päivittää DOM:ia.
- `server.js` on Node.js/Express-palvelin. Se käsittelee `/api`-pyynnöt, hakee ravintolatiedot ja käyttää MariaDB:tä käyttäjätoiminnoissa.
- `database/schema.sql` määrittelee `users`- ja `favorites`-taulut.

## 3. Tiedon kulku: Näytä lista

```text
1. Käyttäjä painaa ravintolan "Näytä lista" -painiketta.
2. script.js tallentaa valitun ravintolan tunnisteen.
3. Selain kutsuu /api?action=menu&id=...&period=day&lang=fi.
4. server.js pyytää tiedot Metropolian ravintola-API:sta.
5. Palvelin palauttaa JSON-vastauksen selaimelle.
6. script.js muuntaa vastauksen päiviksi ja ruokalajeiksi.
7. Ruokalista ja API:n mahdollisesti palauttamat hinnat näkyvät sivulla.
```

Jos käyttäjä painaa "Näytä lista" Suosikit-sivulla, sovellus siirtyy ensin ravintolanäkymään ja näyttää valitun ravintolan ruokalistan.

## 4. Tiedon kulku: suosikki

Kirjautunut käyttäjä painaa sydänpainiketta. Selain lähettää POST- tai DELETE-pyynnön palvelimelle CSRF-tunnisteen kanssa. `server.js` tarkistaa istunnon ja päivittää MariaDB:n `favorites`-taulun käyttäjän tunnisteen ja ravintolatunnisteen perusteella.

## 5. Tärkeitä käsitteitä

- **REST API:** HTTP-pyyntöihin vastaava palvelu.
- **JSON:** tiedon siirtomuoto selaimen ja palvelimen välillä.
- **fetch:** selaimen JavaScriptin verkkopyyntöfunktio.
- **async/await:** tapa käsitellä asynkronisia pyyntöjä.
- **DOM:** HTML-sivun rakenne, jota JavaScript voi muuttaa.
- **filter():** suodattaa taulukosta ehdon täyttävät alkiot.
- **Set:** kokoelma, jolla tarkistetaan tehokkaasti suosikkien jäsenyys.
- **localStorage:** tallentaa selaimessa kieli- ja teema-asetukset, ei salasanoja.
- **Istunto:** palvelin tunnistaa kirjautuneen käyttäjän istuntoevästeen avulla.
- **Parametrisoitu SQL:** kyselyn arvot annetaan erillisinä parametreina, esimerkiksi `WHERE id = ?`.
- **Viiteavain:** `favorites.user_id` yhdistää suosikin käyttäjään.

## 6. Mahdollisia opettajan kysymyksiä

**Miksi JavaScript ei yhdistä suoraan MariaDB:hen?** Tietokannan tunnuksia ei saa paljastaa selaimelle. Palvelin tarkistaa oikeudet ja tekee tietokantakyselyt.

**Miten salasana tallennetaan?** Palvelin käyttää satunnaista suolaa ja Node.js:n `crypto.scryptSync`-funktiota. Salasanaa ei tallenneta selkokielisenä.

**Miten käyttöliittymä mukautuu mobiiliin?** CSS:n Grid-, Flexbox- ja media query -säännöt muuttavat asettelua. Ravintolalista sekä ruokalista/kartta ovat erikseen vieritettäviä myös pienillä näytöillä.

**Miten teema ja kieli toimivat?** JavaScript vaihtaa CSS-teemaa ja käyttöliittymän tekstejä. Valinnat tallennetaan `localStorage`-muistiin.

**Miksi suosikeille on oma taulu?** Yksi käyttäjä voi tallentaa monta ravintolaa, ja sama ravintola voi olla usean käyttäjän suosikki.

**Miten lähimmät ravintolat löydetään?** Käyttäjä antaa selaimelle sijaintiluvan, ja JavaScript laskee etäisyydet koordinaateista Haversinen kaavalla. Ilman lupaa tavallinen haku toimii edelleen.

**Mitä tapahtuu, jos ravintola-API ei vastaa?** Palvelin palauttaa virheen, ja selain näyttää käyttäjälle virheilmoituksen. Ongelmaa voi tutkia selaimen Developer Toolsin Network- ja Console-välilehdillä sekä palvelimen lokista.

**Miten saavutettavuus on huomioitu?** Koodissa on esimerkiksi lomakkeiden labelit, näppäimistön kohdistustyylit ja ARIA-attribuutteja. Saavutettavuutta ei ole vielä dokumentoidusti auditoitu kokonaan.

## 7. Osaamisen varmistus

Harjoittele selittämään itse yksi tapahtumaketju: ravintolan valinta → API-pyyntö → JSON-vastaus → ruokalistan näyttäminen. Kokeile myös muuttaa yhtä CSS-muuttujaa ja yhtä käännöstekstiä ja selitä, miksi muutos näkyy sivulla.

'use strict';

/* =========================================================
   1. KÄÄNNÖKSET
   Jokaisella HTML-elementillä, jolla on data-i18n="avain",
   teksti haetaan tästä oliosta valitun kielen mukaan.
   ========================================================= */
const translations = {
  fi: {
    navRestaurants: 'Ravintolat',
    loading: 'Ladataan...',
    loadError: 'Ravintoloiden lataus epäonnistui. Yritä myöhemmin uudelleen.',
    menuError: 'Ruokalistan lataus epäonnistui.',
    noMenu: 'Ruokalistaa ei ole saatavilla.',
    closeLabel: 'Sulje',
    navLogin: 'Kirjaudu',
    navRegister: 'Rekisteröidy',
    loginTitle: 'Kirjaudu sisään',
    registerTitle: 'Luo tili',
    labelEmail: 'Sähköposti',
    labelPassword: 'Salasana',
    labelUsername: 'Käyttäjänimi',
    loginButton: 'Kirjaudu',
    registerButton: 'Luo tili',
    noAccount: 'Ei vielä tiliä?',
    haveAccount: 'Onko sinulla jo tili?',
    heroTitle: 'Mitä lounaaksi tänään?',
    heroText: 'Suomen opiskelijaravintolat ja niiden ruokalistat yhdessä paikassa.',
    heroButton: 'Katso ravintolat',
    restaurantsTitle: 'Ravintolat',
    viewDay: 'Päivän lista',
    viewWeek: 'Viikon lista',
    showMenu: 'Näytä ruokalista',
    footerText: 'Web-sovelluskehitys, yksilötehtävä',
    langLabel: 'Vaihda kieli',
    themeLabel: 'Vaihda teema',
    menuLabel: 'Avaa valikko'
  },
  en: {
    navRestaurants: 'Restaurants',
    loading: 'Loading...',
    loadError: 'Could not load restaurants. Please try again later.',
    menuError: 'Could not load the menu.',
    noMenu: 'No menu available.',
    closeLabel: 'Close',
    navLogin: 'Log in',
    navRegister: 'Sign up',
    loginTitle: 'Log in',
    registerTitle: 'Create an account',
    labelEmail: 'Email',
    labelPassword: 'Password',
    labelUsername: 'Username',
    loginButton: 'Log in',
    registerButton: 'Create account',
    noAccount: 'No account yet?',
    haveAccount: 'Already have an account?',
    heroTitle: 'What\'s for lunch today?',
    heroText: 'Finnish student restaurants and their menus in one place.',
    heroButton: 'See restaurants',
    restaurantsTitle: 'Restaurants',
    viewDay: 'Daily menu',
    viewWeek: 'Weekly menu',
    showMenu: 'Show menu',
    footerText: 'Web application development, individual assignment',
    langLabel: 'Change language',
    themeLabel: 'Change theme',
    menuLabel: 'Open menu'
  }
};

/* =========================================================
   2. HTML-ELEMENTIT (haetaan kerran, käytetään monta kertaa)
   ========================================================= */
const langToggle = document.getElementById('lang-toggle');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

/* =========================================================
   3. KIELI
   ========================================================= */
// Haetaan tallennettu kieli selaimen muistista. Jos ei ole, käytetään suomea.
let currentLang = localStorage.getItem('lang') || 'fi';

const applyLanguage = (lang) => {
  currentLang = lang;
  document.documentElement.lang = lang; // päivittää <html lang="...">

  // Vaihdetaan kaikkien data-i18n-elementtien teksti
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translations[lang][element.dataset.i18n];
  });

  // Vaihdetaan nappien aria-label (ruudunlukijoille)
  document.querySelectorAll('[data-i18n-label]').forEach((element) => {
    element.setAttribute('aria-label', translations[lang][element.dataset.i18nLabel]);
  });

  // Nappi näyttää kielen, johon voi vaihtaa
  langToggle.textContent = lang === 'fi' ? 'EN' : 'FI';
  localStorage.setItem('lang', lang);
};

langToggle.addEventListener('click', () => {
  applyLanguage(currentLang === 'fi' ? 'en' : 'fi');
});

/* =========================================================
   4. TEEMA (vaalea / tumma)
   ========================================================= */
// Jos käyttäjä ei ole valinnut, seurataan laitteen omaa asetusta
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

const applyTheme = (theme) => {
  currentTheme = theme;
  // CSS reagoi tähän: [data-theme="dark"] { ... }
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
};

themeToggle.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

/* =========================================================
   5. HAMPURILAISVALIKKO
   ========================================================= */
const setMenu = (isOpen) => {
  mainNav.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
};

menuToggle.addEventListener('click', () => {
  setMenu(!mainNav.classList.contains('open'));
});

// Suljetaan valikko, kun jotain linkkiä on painettu
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

/* =========================================================
   6. PÄIVÄ / VIIKKO -VALINTA
   Vaihtaa korostuksen ja muistaa, kumpi lista näytetään.
   ========================================================= */
const viewButtons = document.querySelectorAll('.view-switch .btn-toggle');
let currentView = 'day'; // 'day' = päivän lista, 'week' = viikon lista

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    viewButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    currentView = button.dataset.view; // muistetaan valinta ruokalistan avaamista varten
  });
});

/* =========================================================
   7. NÄKYMIEN VAIHTO (etusivu / kirjautuminen / rekisteröityminen)
   Kaikilla näkymillä on HTML:ssä class="view" ja id muodossa "nimi-view".
   Elementit, joilla on data-show-view="nimi", vaihtavat näkymää.
   ========================================================= */
const views = document.querySelectorAll('.view');

const showView = (name) => {
  // Piilotetaan kaikki näkymät paitsi valittu
  views.forEach((view) => {
    view.hidden = view.id !== `${name}-view`;
  });
  setMenu(false); // suljetaan hampurilaisvalikko
  if (name !== 'home') {
    window.scrollTo(0, 0); // lomake näkyy heti sivun alussa
  }
};

document.querySelectorAll('[data-show-view]').forEach((element) => {
  element.addEventListener('click', () => showView(element.dataset.showView));
});

/* =========================================================
   8. LOMAKKEET (väliaikainen)
   preventDefault estää sivun uudelleenlatautumisen lähetettäessä.
   Oikea kirjautuminen API:n kanssa tehdään myöhemmin.
   ========================================================= */
document.querySelectorAll('.auth-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

/* =========================================================
   9. RAVINTOLAT API:STA
   ========================================================= */
const API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

const restaurantList = document.getElementById('restaurant-list');
const statusText = document.getElementById('status');
const menuDialog = document.getElementById('menu-dialog');
const menuTitle = document.getElementById('menu-title');
const menuContent = document.getElementById('menu-content');

// Apufunktio: hakee tekstin valitulla kielellä
const t = (key) => translations[currentLang][key];

// Apufunktio: luo HTML-elementin yhdellä rivillä
const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

// Näyttää tilaviestin (avain käännöksistä) tai tyhjentää sen (null)
const setStatus = (key) => {
  if (key) {
    statusText.dataset.i18n = key; // kielen vaihto päivittää viestin
    statusText.textContent = t(key);
  } else {
    delete statusText.dataset.i18n;
    statusText.textContent = '';
  }
};

// Hakee JSON-datan osoitteesta. Heittää virheen, jos haku epäonnistuu
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Haku epäonnistui: ${response.status}`);
  }
  return response.json();
};

// Luo yhden kortin jokaiselle ravintolalle
const renderRestaurants = (list) => {
  restaurantList.replaceChildren(); // tyhjentää vanhat kortit

  list.forEach((restaurant) => {
    const card = createElement('article', 'card');
    const button = createElement('button', 'btn btn-secondary', t('showMenu'));
    button.type = 'button';
    button.dataset.i18n = 'showMenu';
    button.addEventListener('click', () => openMenu(restaurant));

    card.append(
      createElement('h3', '', restaurant.name),
      createElement('p', 'card-city', restaurant.city),
      createElement('p', 'card-provider', restaurant.company),
      button
    );
    restaurantList.append(card);
  });
};

const loadRestaurants = async () => {
  setStatus('loading');
  try {
    const restaurants = await fetchJson(`${API_URL}/restaurants`);
    // Aakkosjärjestykseen nimen mukaan
    restaurants.sort((a, b) => a.name.localeCompare(b.name, 'fi'));
    renderRestaurants(restaurants);
    setStatus(null);
  } catch (error) {
    console.error(error);
    setStatus('loadError');
  }
};

/* ---------- Ruokalista ---------- */
// Muuttaa päivämäärän luettavaksi, esim. "maanantai 5.1."
const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value; // jos muoto on outo, näytetään sellaisenaan
  return date.toLocaleDateString(currentLang === 'fi' ? 'fi-FI' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric'
  });
};

const renderCourses = (courses) => {
  const list = createElement('ul', 'course-list');
  courses.forEach((course) => {
    const item = createElement('li', 'course');
    const diets = Array.isArray(course.diets) ? course.diets.join(', ') : course.diets;
    item.append(createElement('span', 'course-name', course.name));
    if (course.price) item.append(createElement('span', 'course-price', course.price));
    if (diets) item.append(createElement('span', 'course-diets', diets));
    list.append(item);
  });
  return list;
};

const renderMenu = (menu, isWeek) => {
  menuContent.replaceChildren();
  // Päivälistassa on yksi päivä, viikkolistassa monta
  const days = isWeek ? menu.days : [{ courses: menu.courses }];
  const daysWithCourses = days.filter((day) => day.courses && day.courses.length > 0);

  if (daysWithCourses.length === 0) {
    menuContent.append(createElement('p', 'status', t('noMenu')));
    return;
  }

  daysWithCourses.forEach((day) => {
    if (isWeek) menuContent.append(createElement('h4', 'day-title', formatDate(day.date)));
    menuContent.append(renderCourses(day.courses));
  });
};

const openMenu = async (restaurant) => {
  const isWeek = currentView === 'week';
  menuTitle.textContent = `${restaurant.name}: ${t(isWeek ? 'viewWeek' : 'viewDay')}`;
  menuContent.replaceChildren(createElement('p', 'status', t('loading')));
  menuDialog.showModal();

  try {
    const type = isWeek ? 'weekly' : 'daily';
    const menu = await fetchJson(`${API_URL}/restaurants/${type}/${restaurant._id}/${currentLang}`);
    renderMenu(menu, isWeek);
  } catch (error) {
    console.error(error);
    menuContent.replaceChildren(createElement('p', 'status', t('menuError')));
  }
};

// Ikkunan sulkeminen: ✕-napilla tai painamalla ikkunan ulkopuolelle
document.getElementById('menu-close').addEventListener('click', () => menuDialog.close());
menuDialog.addEventListener('click', (event) => {
  if (event.target === menuDialog) menuDialog.close();
});

/* =========================================================
   10. KÄYNNISTYS: ajetaan kerran, kun sivu latautuu
   ========================================================= */
applyTheme(currentTheme);
applyLanguage(currentLang);
loadRestaurants();

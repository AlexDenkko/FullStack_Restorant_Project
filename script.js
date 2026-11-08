"use strict";

/* =========================================================
   1. KÄÄNNÖKSET
   Jokaisella HTML-elementillä, jolla on data-i18n="avain",
   teksti haetaan tästä oliosta valitun kielen mukaan.
   ========================================================= */
const translations = {
  fi: {
    navRestaurants: "Ravintolat",
    navLogin: "Kirjaudu",
    navRegister: "Rekisteröidy",
    loginTitle: "Kirjaudu sisään",
    registerTitle: "Luo tili",
    labelEmail: "Sähköposti",
    labelPassword: "Salasana",
    labelUsername: "Käyttäjänimi",
    loginButton: "Kirjaudu",
    registerButton: "Luo tili",
    noAccount: "Ei vielä tiliä?",
    haveAccount: "Onko sinulla jo tili?",
    heroTitle: "Mitä lounaaksi tänään?",
    heroText:
      "Suomen opiskelijaravintolat ja niiden ruokalistat yhdessä paikassa.",
    heroButton: "Katso ravintolat",
    restaurantsTitle: "Ravintolat",
    viewDay: "Päivän lista",
    viewWeek: "Viikon lista",
    showMenu: "Näytä ruokalista",
    footerText: "Yksilötehtävä Alex Sviridenko TVT25-O",
    langLabel: "Vaihda kieli",
    themeLabel: "Vaihda teema",
    menuLabel: "Avaa valikko",
  },
  en: {
    navRestaurants: "Restaurants",
    navLogin: "Log in",
    navRegister: "Sign up",
    loginTitle: "Log in",
    registerTitle: "Create an account",
    labelEmail: "Email",
    labelPassword: "Password",
    labelUsername: "Username",
    loginButton: "Log in",
    registerButton: "Create account",
    noAccount: "No account yet?",
    haveAccount: "Already have an account?",
    heroTitle: "What's for lunch today?",
    heroText: "Finnish student restaurants and their menus in one place.",
    heroButton: "See restaurants",
    restaurantsTitle: "Restaurants",
    viewDay: "Daily menu",
    viewWeek: "Weekly menu",
    showMenu: "Show menu",
    footerText: "Individual assignment Alex Sviridenko TVT25-O",
    langLabel: "Change language",
    themeLabel: "Change theme",
    menuLabel: "Open menu",
  },
};

/* =========================================================
   2. HTML-ELEMENTIT (haetaan kerran, käytetään monta kertaa)
   ========================================================= */
const langToggle = document.getElementById("lang-toggle");
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

/* =========================================================
   3. KIELI
   ========================================================= */
// Haetaan tallennettu kieli selaimen muistista. Jos ei ole, käytetään suomea.
let currentLang = localStorage.getItem("lang") || "fi";

const applyLanguage = (lang) => {
  currentLang = lang;
  document.documentElement.lang = lang; // päivittää <html lang="...">

  // Vaihdetaan kaikkien data-i18n-elementtien teksti
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translations[lang][element.dataset.i18n];
  });

  // Vaihdetaan nappien aria-label (ruudunlukijoille)
  document.querySelectorAll("[data-i18n-label]").forEach((element) => {
    element.setAttribute(
      "aria-label",
      translations[lang][element.dataset.i18nLabel],
    );
  });

  // Nappi näyttää kielen, johon voi vaihtaa
  langToggle.textContent = lang === "fi" ? "EN" : "FI";
  localStorage.setItem("lang", lang);
};

langToggle.addEventListener("click", () => {
  applyLanguage(currentLang === "fi" ? "en" : "fi");
});

/* =========================================================
   4. TEEMA (vaalea / tumma)
   ========================================================= */
// Jos käyttäjä ei ole valinnut, seurataan laitteen omaa asetusta
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let currentTheme =
  localStorage.getItem("theme") || (prefersDark ? "dark" : "light");

const applyTheme = (theme) => {
  currentTheme = theme;
  // CSS reagoi tähän: [data-theme="dark"] { ... }
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
};

themeToggle.addEventListener("click", () => {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

/* =========================================================
   5. HAMPURILAISVALIKKO
   ========================================================= */
const setMenu = (isOpen) => {
  mainNav.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
};

menuToggle.addEventListener("click", () => {
  setMenu(!mainNav.classList.contains("open"));
});

// Suljetaan valikko, kun jotain linkkiä on painettu
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

/* =========================================================
   6. PÄIVÄ / VIIKKO -VALINTA
   Nyt vaihtaa vain korostuksen. API-haku lisätään myöhemmin.
   ========================================================= */
const viewButtons = document.querySelectorAll(".view-switch .btn-toggle");

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

/* =========================================================
   7. NÄKYMIEN VAIHTO (etusivu / kirjautuminen / rekisteröityminen)
   Kaikilla näkymillä on HTML:ssä class="view" ja id muodossa "nimi-view".
   Elementit, joilla on data-show-view="nimi", vaihtavat näkymää.
   ========================================================= */
const views = document.querySelectorAll(".view");

const showView = (name) => {
  // Piilotetaan kaikki näkymät paitsi valittu
  views.forEach((view) => {
    view.hidden = view.id !== `${name}-view`;
  });
  setMenu(false); // suljetaan hampurilaisvalikko
  if (name !== "home") {
    window.scrollTo(0, 0); // lomake näkyy heti sivun alussa
  }
};

document.querySelectorAll("[data-show-view]").forEach((element) => {
  element.addEventListener("click", () => showView(element.dataset.showView));
});

/* =========================================================
   8. LOMAKKEET (väliaikainen)
   preventDefault estää sivun uudelleenlatautumisen lähetettäessä.
   Oikea kirjautuminen API:n kanssa tehdään myöhemmin.
   ========================================================= */
document.querySelectorAll(".auth-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

/* =========================================================
   9. KÄYNNISTYS: ajetaan kerran, kun sivu latautuu
   ========================================================= */
applyTheme(currentTheme);
applyLanguage(currentLang);

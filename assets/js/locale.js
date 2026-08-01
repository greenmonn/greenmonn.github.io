(function () {
  var supportedLocales = ["ko", "en"];
  var fallbackLocale = "en";
  var sessionLocale = null;

  function getSavedLocale() {
    try {
      return window.localStorage.getItem("locale");
    } catch (error) {
      return null;
    }
  }

  function getLocale() {
    var queryLocale = new URLSearchParams(window.location.search).get("lang");
    var requestedLocale = sessionLocale || getSavedLocale() || queryLocale || navigator.language;
    var locale = (requestedLocale || "").toLowerCase().split("-")[0];

    return supportedLocales.indexOf(locale) !== -1 ? locale : fallbackLocale;
  }

  function applyLocale() {
    var locale = getLocale();

    document.documentElement.lang = locale;

    document.querySelectorAll("[data-set-locale]").forEach(function (button) {
      var isCurrentLocale = button.dataset.setLocale === locale;
      button.classList.toggle("is-active", isCurrentLocale);
      button.setAttribute("aria-pressed", isCurrentLocale.toString());
    });

    document.querySelectorAll(".localized-content").forEach(function (container) {
      var localizedElements = container.querySelectorAll("[data-locale]");
      var hasTranslation = container.querySelector('[data-locale="' + locale + '"]');
      var selectedLocale = hasTranslation ? locale : fallbackLocale;

      localizedElements.forEach(function (element) {
        element.hidden = element.dataset.locale !== selectedLocale;
      });
    });
  }

  window.setLocale = function (locale) {
    if (supportedLocales.indexOf(locale) === -1) return;

    sessionLocale = locale;

    try {
      window.localStorage.setItem("locale", locale);
    } catch (error) {
      // The selected locale still applies for this page when storage is unavailable.
    }

    applyLocale();
  };

  document.querySelectorAll("[data-set-locale]").forEach(function (button) {
    button.addEventListener("click", function () {
      window.setLocale(button.dataset.setLocale);
    });
  });

  applyLocale();
})();

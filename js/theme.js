(function themeController() {
  var storageKey = "theme-mode";
  var systemMode = "system";
  var darkTheme = "dark";
  var lightTheme = "light";
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  var iconByMode = {
    system: "<svg class='ui-icon theme-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><circle cx='12' cy='12' r='7.5'></circle><path class='ui-icon-fill' d='M12 4.5a7.5 7.5 0 0 0 0 15Z'></path></svg>",
    dark: "<svg class='ui-icon theme-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><path d='M20 15.2A8 8 0 0 1 8.8 4 8 8 0 1 0 20 15.2Z'></path></svg>",
    light: "<svg class='ui-icon theme-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'><circle cx='12' cy='12' r='3.5'></circle><path d='M12 2.25v2M12 19.75v2M4.25 12h-2M21.75 12h-2M5.1 5.1 6.5 6.5M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4'></path></svg>"
  };

  var nextModeByMode = {
    system: darkTheme,
    dark: lightTheme,
    light: systemMode
  };

  function getSavedMode() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveMode(mode) {
    try {
      window.localStorage.setItem(storageKey, mode);
    } catch (error) {
      // Ignore storage errors and keep runtime-only theme.
    }
  }

  function getSystemTheme() {
    return mediaQuery.matches
      ? darkTheme
      : lightTheme;
  }

  function resolveMode() {
    var savedMode = getSavedMode();
    if (savedMode === systemMode || savedMode === darkTheme || savedMode === lightTheme) {
      return savedMode;
    }
    return systemMode;
  }

  function getThemeFromMode(mode) {
    if (mode === darkTheme || mode === lightTheme) {
      return mode;
    }
    return getSystemTheme();
  }

  function updateThemeImages(theme) {
    var images = document.querySelectorAll("[data-src-light][data-src-dark]");

    images.forEach(function (image) {
      var sourceAttribute = theme === darkTheme ? "data-src-dark" : "data-src-light";
      var nextSource = image.getAttribute(sourceAttribute);

      if (nextSource && image.getAttribute("src") !== nextSource) {
        image.setAttribute("src", nextSource);
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeImages(theme);
  }

  function translate(key, replacements) {
    if (window.I18N) {
      return window.I18N.t(key, replacements);
    }

    return key;
  }

  function translateMode(mode) {
    return window.I18N
      ? translate("theme.mode." + mode)
      : mode;
  }

  function updateToggle(mode, appliedTheme) {
    var nextMode = nextModeByMode[mode];
    var pressedValue = mode === systemMode ? "mixed" : String(mode === darkTheme);
    var buttons = document.querySelectorAll("[data-theme-toggle]");

    buttons.forEach(function (button) {
      button.innerHTML = iconByMode[mode] || iconByMode[systemMode];
      button.setAttribute("aria-pressed", pressedValue);
      button.setAttribute("data-theme-mode", mode);
      button.setAttribute(
        "aria-label",
        window.I18N
          ? translate("theme.aria", {
            mode: translateMode(mode),
            theme: translateMode(appliedTheme),
            next: translateMode(nextMode)
          })
          : "Theme mode: " + mode + ". Current theme: " + appliedTheme +
            ". Click to switch to " + nextMode + " mode."
      );
      button.title = window.I18N
        ? translate("theme.title", {
          mode: translateMode(mode),
          next: translateMode(nextMode)
        })
        : "Theme: " + mode + " (next: " + nextMode + ")";
    });
  }

  var currentMode = resolveMode();
  applyTheme(getThemeFromMode(currentMode));

  document.addEventListener("DOMContentLoaded", function () {
    updateToggle(currentMode, getThemeFromMode(currentMode));

    var buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!buttons.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentMode = nextModeByMode[currentMode] || systemMode;
        var nextTheme = getThemeFromMode(currentMode);

        applyTheme(nextTheme);
        saveMode(currentMode);
        updateToggle(currentMode, nextTheme);
      });
    });
  });

  document.addEventListener("languagechange", function () {
    updateToggle(currentMode, getThemeFromMode(currentMode));
  });

  function handleSystemThemeChange() {
    if (currentMode !== systemMode) {
      return;
    }

    var systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    updateToggle(currentMode, systemTheme);
  }

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleSystemThemeChange);
  }
})();

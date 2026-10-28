(function themeController() {
  var storageKey = "theme-mode";
  var systemMode = "system";
  var darkTheme = "dark";
  var lightTheme = "light";
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  var iconByMode = {
    system: "◐",
    dark: "☾",
    light: "☀"
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
      button.textContent = iconByMode[mode] || iconByMode[systemMode];
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

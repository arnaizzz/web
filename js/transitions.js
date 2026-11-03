(function pageTransitions() {
  var forceCleanupTimer = null;
  var navigationDelay = 80;
  var preloaderMinimumVisibleTime = 900;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function finishSessionPreloader() {
    var root = document.documentElement;
    var preloader = document.querySelector("[data-session-preloader]");

    if (window.__portfolioPreloaderSafetyTimer) {
      window.clearTimeout(window.__portfolioPreloaderSafetyTimer);
      window.__portfolioPreloaderSafetyTimer = null;
    }

    root.classList.remove("has-session-preloader");
    if (preloader) {
      preloader.remove();
    }
  }

  function dismissSessionPreloader() {
    var root = document.documentElement;
    var preloader = document.querySelector("[data-session-preloader]");
    var startedAt = window.__portfolioPreloaderStartedAt || Date.now();
    var remainingVisibleTime = Math.max(0, preloaderMinimumVisibleTime - (Date.now() - startedAt));

    if (!root.classList.contains("has-session-preloader") || !preloader) {
      finishSessionPreloader();
      return;
    }

    if (reducedMotion.matches) {
      finishSessionPreloader();
      return;
    }

    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        preloader.classList.add("is-dismissing");
        preloader.addEventListener("transitionend", finishSessionPreloader, { once: true });
        window.setTimeout(finishSessionPreloader, 450);
      });
    }, remainingVisibleTime);
  }

  function clearTransitionState() {
    var body = document.body;

    if (!body) {
      return;
    }

    body.classList.remove("is-entering");
    body.classList.remove("is-leaving");
  }

  function scheduleForceCleanup() {
    if (forceCleanupTimer) {
      window.clearTimeout(forceCleanupTimer);
    }

    // If navigation is interrupted, recover from a stuck hidden page state.
    forceCleanupTimer = window.setTimeout(function () {
      clearTransitionState();
      forceCleanupTimer = null;
    }, 600);
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.requestAnimationFrame(function () {
      clearTransitionState();
    });
    dismissSessionPreloader();
  });

  window.addEventListener("pageshow", function () {
    // pageshow also fires when coming from bfcache via Back/Forward.
    clearTransitionState();
  });

  window.addEventListener("popstate", function () {
    clearTransitionState();
  });

  window.addEventListener("load", function () {
    clearTransitionState();
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      clearTransitionState();
    }
  });

  document.addEventListener("click", function (event) {
    var target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    var link = target.closest("a[data-transition]");

    if (!link) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (link.target && link.target.toLowerCase() !== "_self") {
      return;
    }

    var destination = new URL(link.href, window.location.href);

    if (destination.origin !== window.location.origin) {
      return;
    }

    if (destination.href === window.location.href) {
      return;
    }

    event.preventDefault();

    if (reducedMotion.matches) {
      window.location.assign(destination.href);
      return;
    }

    document.body.classList.add("is-leaving");
    scheduleForceCleanup();

    window.setTimeout(function () {
      window.location.assign(destination.href);
    }, navigationDelay);
  });
})();

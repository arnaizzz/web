(function scrollReveal() {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var observer = null;

  if (!reduceMotion && typeof IntersectionObserver === "function") {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
  }

  window.revealElements = function revealElements(root) {
    var scope = root || document;
    var targets = scope.matches && scope.matches("[data-reveal]")
      ? [scope]
      : Array.prototype.slice.call(scope.querySelectorAll("[data-reveal]"));

    targets.forEach(function (element) {
      // Project pages own their above-the-fold reveal. Observing the entire
      // long article with a ratio threshold can leave it permanently hidden.
      if (element.matches(".project-detail")) {
        return;
      }

      if (reduceMotion || !observer) {
        element.classList.add("is-visible");
        return;
      }

      observer.observe(element);
    });
  };

  window.revealElements(document);
})();

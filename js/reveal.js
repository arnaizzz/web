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
      if (reduceMotion || !observer) {
        element.classList.add("is-visible");
        return;
      }

      observer.observe(element);
    });
  };

  window.revealElements(document);
})();

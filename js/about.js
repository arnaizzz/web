(function bindAboutPage() {
  var links = document.querySelectorAll(".about-links a:not([download])");

  links.forEach(function (link) {
    link.setAttribute("data-transition", "");
  });
})();

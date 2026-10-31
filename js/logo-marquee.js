(function prepareLogoMarquees() {
  document.querySelectorAll("[data-logo-marquee]").forEach(function (marquee) {
    var track = marquee.querySelector("[data-logo-marquee-track]");
    var list = marquee.querySelector("[data-logo-marquee-list]");

    if (!track || !list || track.querySelector(".logo-marquee-copy")) {
      return;
    }

    var copy = list.cloneNode(true);
    copy.classList.add("logo-marquee-copy");
    copy.removeAttribute("data-logo-marquee-list");
    copy.setAttribute("aria-hidden", "true");

    copy.querySelectorAll("img").forEach(function (image) {
      image.setAttribute("alt", "");
    });

    track.appendChild(copy);
    marquee.classList.add("is-ready");
  });
})();

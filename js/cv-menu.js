(function bindCvMenus() {
  var menus = Array.prototype.slice.call(document.querySelectorAll(".cv-menu"));

  if (!menus.length) {
    return;
  }

  function closeMenu(menu) {
    if (menu && menu.open) {
      menu.open = false;
    }
  }

  menus.forEach(function (menu) {
    menu.addEventListener("toggle", function () {
      if (!menu.open) {
        return;
      }

      menus.forEach(function (otherMenu) {
        if (otherMenu !== menu) {
          closeMenu(otherMenu);
        }
      });
    });

    menu.querySelectorAll("a[download]").forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(function () {
          closeMenu(menu);
        }, 0);
      });
    });
  });

  document.addEventListener("click", function (event) {
    menus.forEach(function (menu) {
      if (!menu.contains(event.target)) {
        closeMenu(menu);
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    menus.forEach(function (menu) {
      if (menu.open) {
        closeMenu(menu);
        menu.querySelector("summary").focus();
      }
    });
  });
})();

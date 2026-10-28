(function renderHomeProjects() {
  var projects = (window.PROJECTS || []).slice().sort(function (a, b) {
    return a.order - b.order;
  });
  var list = document.querySelector("[data-project-list]");
  var sortSelect = document.querySelector("[data-project-sort]");

  if (!list || !projects.length) {
    return;
  }

  function getLanguage() {
    return window.I18N ? window.I18N.getLanguage() : "en";
  }

  function localize(value, language) {
    if (window.I18N) {
      return window.I18N.localize(value, language);
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[language] != null ? value[language] : value.en;
    }

    return value;
  }

  function translate(key, replacements) {
    return window.I18N ? window.I18N.t(key, replacements) : key;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderCover(project) {
    if (project.coverImage && project.coverImage.src) {
      return (
        "<img src='" +
        escapeHtml(project.coverImage.src) +
        "' alt='" +
        escapeHtml(localize(project.coverImage.alt || "", getLanguage())) +
        "' loading='lazy' decoding='async'>"
      );
    }

    return (
      "<div class='project-cover-placeholder' aria-hidden='true'>" +
      "<span class='project-cover-label'>" +
      escapeHtml(translate("home.visualArchive")) +
      "</span>" +
      "</div>"
    );
  }

  function getCareerStages(project) {
    var sections = Array.isArray(project.sections) ? project.sections : [];
    var containsSubprojects = sections.some(function (section) {
      return section.type === "subproject";
    });

    if (sections.length < 2 || containsSubprojects) {
      return [];
    }

    return sections.slice();
  }

  function isCurrentExperience(project) {
    var englishDate = localize(project.date, "en");
    return typeof englishDate === "string" && /\bpresent\b/i.test(englishDate);
  }

  function getCurrentStage(project) {
    var sections = Array.isArray(project.sections) ? project.sections : [];
    return sections.find(function (section) {
      return section.current === true;
    });
  }

  function renderCurrentStatus(project) {
    var currentStage = getCurrentStage(project);

    if (!currentStage) {
      return "";
    }

    return (
      "<span class='project-current-status'>" +
      "<span class='project-current-status-dot' aria-hidden='true'></span>" +
      "<span>" +
      escapeHtml(translate("status.current")) +
      "</span>" +
      "</span>"
    );
  }

  function renderCareerProgression(project, language, title) {
    var stages = getCareerStages(project);
    var currentStage = getCurrentStage(project);

    if (!stages.length) {
      return "";
    }

    return (
      "<div class='career-progression' role='group' aria-label='" +
      escapeHtml(translate("home.careerProgressionAria", { title: title })) +
      "'>" +
      "<p class='career-progression-title'>" +
      escapeHtml(translate("home.careerProgression")) +
      "</p>" +
      "<ol class='career-progression-list'>" +
      stages.map(function (stage, index) {
        var isHighlighted = currentStage ? stage === currentStage : index === 0;
        var currentAttribute = (stage.current || (isHighlighted && isCurrentExperience(project)))
          ? " aria-current='step'"
          : "";

        return (
          "<li class='career-stage" + (isHighlighted ? " is-highlighted" : "") + "'" +
          currentAttribute + ">" +
          "<span class='career-stage-marker' aria-hidden='true'></span>" +
          "<span class='career-stage-content'>" +
          "<span class='career-stage-role'>" +
          escapeHtml(localize(stage.title, language)) +
          "</span>" +
          "</span>" +
          "</li>"
        );
      }).join("") +
      "</ol>" +
      "</div>"
    );
  }

  function renderProjectList(sortOrder) {
    var language = getLanguage();
    var visibleProjects = projects.slice().sort(function (a, b) {
      return sortOrder === "oldest" ? b.order - a.order : a.order - b.order;
    });

    if (!visibleProjects.length) {
      list.innerHTML =
        "<p class='project-empty-state'>" +
        escapeHtml(translate("home.noProjects")) +
        "</p>";
      return;
    }

    list.innerHTML = visibleProjects
      .map(function (project) {
        var title = localize(project.title, language);
        var category = localize(project.category, language);
        var specialty = localize(project.specialty, language);
        var date = localize(project.date, language);
        var summary = localize(project.summary, language);
        var detailHref = project.detailUrl ||
          "project.html?slug=" + encodeURIComponent(project.slug);
        var dateMarkup = date
          ? "<p class='project-date'>" + escapeHtml(date) + "</p>"
          : "";
        var summaryMarkup = summary
          ? "<p class='project-summary'>" + escapeHtml(summary) + "</p>"
          : "<p class='project-summary project-summary-empty'>" +
            escapeHtml(translate("home.pendingDetails")) +
            "</p>";
        var currentStatusMarkup = renderCurrentStatus(project);
        var careerProgressionMarkup = renderCareerProgression(project, language, title);
        var featuredClass = project.order === 1 ? " project-row-featured" : "";
        var progressionClass = careerProgressionMarkup ? " project-row-has-progression" : "";

        return (
          "<article class='project-row" +
          featuredClass +
          progressionClass +
          "' data-project-id='" +
          escapeHtml(project.id) +
          "' data-reveal>" +
          "<a class='project-card-link' href='" +
          escapeHtml(detailHref) +
          "' data-transition aria-label='" +
          escapeHtml(translate("home.openProject", { title: title })) +
          "'>" +
          "<div class='project-content'>" +
          "<p class='project-category'>" +
          escapeHtml(category) +
          "</p>" +
          "<div class='project-title-row'>" +
          "<h3 class='project-title'>" +
          escapeHtml(title) +
          "</h3>" +
          currentStatusMarkup +
          "</div>" +
          "<p class='project-specialty'>" +
          escapeHtml(specialty) +
          "</p>" +
          dateMarkup +
          summaryMarkup +
          careerProgressionMarkup +
          "<span class='project-link'><span>" +
          escapeHtml(translate("home.exploreProject")) +
          "</span><span class='project-link-arrow' aria-hidden='true'>↗</span></span>" +
          "</div>" +
          "<div class='project-image'>" +
          renderCover(project) +
          "</div>" +
          "</a>" +
          "</article>"
        );
      })
      .join("");

    if (typeof window.revealElements === "function") {
      window.revealElements(list);
    }
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function (event) {
      renderProjectList(event.target.value);
    });
  }

  document.addEventListener("languagechange", function () {
    renderProjectList(sortSelect ? sortSelect.value : "newest");
  });

  renderProjectList(sortSelect ? sortSelect.value : "newest");
})();

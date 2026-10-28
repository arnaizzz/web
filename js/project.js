(function renderProjectPage() {
  var projects = (window.PROJECTS || []).slice().sort(function (a, b) {
    return a.order - b.order;
  });
  var container = document.querySelector("[data-project-detail]");

  if (!container || !projects.length) {
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

  function renderInlineText(value) {
    return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function renderTextList(items, className) {
    if (!Array.isArray(items) || !items.length) {
      return "";
    }

    return (
      "<ul class='" +
      className +
      "'>" +
      items.map(function (item) {
        return "<li>" + escapeHtml(localize(item, getLanguage())) + "</li>";
      }).join("") +
      "</ul>"
    );
  }

  function renderMediaItem(item) {
    if (!item || !item.type || !item.src) {
      return "";
    }

    if (item.type === "image") {
      var caption = localize(item.caption, getLanguage());
      var imageAlt = localize(item.alt || "", getLanguage());
      var openLabel = getLanguage() === "es" ? "Ampliar" : "Enlarge";
      var imageClass = item.layout === "featured" ? " project-media-item--featured" : "";
      imageClass += item.paired ? " project-media-item--paired" : "";
      imageClass += item.centered ? " project-media-item--centered" : "";
      return (
        "<figure class='project-media-item" + imageClass + "'><button class='project-media-image-trigger' type='button' data-gallery-item" +
        " data-gallery-src='" + escapeHtml(item.src) + "'" +
        " data-gallery-alt='" + escapeHtml(imageAlt) + "'" +
        " aria-label='" + escapeHtml(openLabel + " " + imageAlt) + "'><img src='" +
        escapeHtml(item.src) +
        "' alt='" +
        escapeHtml(imageAlt) +
        "' loading='lazy'></button>" +
        (caption
          ? "<figcaption>" + escapeHtml(caption) + "</figcaption>"
          : "") +
        "</figure>"
      );
    }

    if (item.type === "video") {
      var videoCaption = localize(item.caption, getLanguage());
      var videoClass = item.layout === "portrait" ? " project-media-item--portrait" : "";
      videoClass += item.paired ? " project-media-item--paired" : "";
      return (
        "<figure class='project-media-item" + videoClass + "'><video controls playsinline preload='metadata'" +
        (item.poster ? " poster='" + escapeHtml(item.poster) + "'" : "") +
        "><source src='" +
        escapeHtml(item.src) +
        "'" +
        (item.mimeType ? " type='" + escapeHtml(item.mimeType) + "'" : "") +
        ">" +
        escapeHtml(translate("project.videoUnsupported")) +
        "</video>" +
        (videoCaption
          ? "<figcaption>" + escapeHtml(videoCaption) + "</figcaption>"
          : "") +
        "</figure>"
      );
    }

    if (item.type === "embed") {
      return (
        "<div class='project-media-item project-media-embed'><iframe src='" +
        escapeHtml(item.src) +
        "' title='" +
        escapeHtml(localize(item.title, getLanguage()) || translate("project.embeddedMedia")) +
        "' loading='lazy' allowfullscreen></iframe></div>"
      );
    }

    return "";
  }

  function renderMediaLightbox(language) {
    var viewerLabel = language === "es" ? "Visor de imágenes" : "Image viewer";
    var closeLabel = language === "es" ? "Cerrar visor" : "Close viewer";

    return (
      "<dialog class='project-lightbox' data-project-lightbox aria-label='" +
      escapeHtml(viewerLabel) +
      "'>" +
      "<button class='project-lightbox-close' type='button' data-lightbox-close aria-label='" +
      escapeHtml(closeLabel) +
      "'>×</button>" +
      "<figure><img data-lightbox-image src='' alt=''></figure>" +
      "</dialog>"
    );
  }

  function renderMedia(media, label) {
    var mediaItems = Array.isArray(media) ? media : [];
    var items = mediaItems.map(renderMediaItem).join("");
    var hasImages = mediaItems.some(function (item) {
      return item && item.type === "image" && item.src;
    });
    var isPortraitGrid = mediaItems.length > 1 && mediaItems.every(function (item) {
      return item && item.type === "video" && item.layout === "portrait";
    });
    var isShowcaseGrid = mediaItems.length > 2 &&
      mediaItems[0] &&
      mediaItems[0].type === "image" &&
      mediaItems[0].layout === "featured" &&
      mediaItems.slice(1).every(function (item) {
        return item && item.type === "video" && item.layout === "portrait";
      });
    var hasPairedItems = mediaItems.some(function (item) {
      return item && item.paired;
    });

    if (items) {
      return "<div class='project-media-grid" +
        (isPortraitGrid ? " project-media-grid--portrait" : "") +
        (isShowcaseGrid ? " project-media-grid--showcase" : "") +
        (hasPairedItems ? " project-media-grid--paired" : "") +
        "'" +
        (hasImages ? " data-project-gallery" : "") +
        ">" + items +
        (hasImages ? renderMediaLightbox(getLanguage()) : "") +
        "</div>";
    }

    return (
      "<div class='project-media-placeholder' role='img' aria-label='" +
      escapeHtml(translate("project.mediaPlaceholder", { title: label })) +
      "'>" +
      "<span class='project-media-placeholder-mark' aria-hidden='true'></span>" +
      "<p>" +
      escapeHtml(translate("project.mediaArchive")) +
      "</p>" +
      "<span>" +
      escapeHtml(translate("project.toBeAdded")) +
      "</span>" +
      "</div>"
    );
  }

  function renderMetrics(metrics, language) {
    var items = metrics && Array.isArray(metrics.items) ? metrics.items : [];

    if (!items.length) {
      return "";
    }

    return (
      "<section class='project-metrics' aria-label='" +
      escapeHtml(localize(metrics.label, language)) +
      "'>" +
      items.map(function (item) {
        return (
          "<div class='project-metric'>" +
          "<p class='project-metric-value'>" +
          escapeHtml(localize(item.value, language)) +
          "</p>" +
          "<p class='project-metric-label'>" +
          escapeHtml(localize(item.label, language)) +
          "</p>" +
          "</div>"
        );
      }).join("") +
      "</section>"
    );
  }

  function renderProjectLinks(links, language) {
    var items = Array.isArray(links) ? links : [];

    if (!items.length) {
      return "";
    }

    return (
      "<nav class='project-detail-links' aria-label='" +
      escapeHtml(language === "es" ? "Enlaces del proyecto" : "Project links") +
      "'>" +
      items.map(function (item) {
        var externalAttributes = item.external
          ? " target='_blank' rel='noopener noreferrer'"
          : "";

        return (
          "<a class='project-detail-external-link' href='" +
          escapeHtml(item.href) +
          "'" + externalAttributes + ">" +
          escapeHtml(localize(item.label, language)) +
          "<span aria-hidden='true'>↗</span></a>"
        );
      }).join("") +
      "</nav>"
    );
  }

  function renderGallery(gallery, language) {
    var items = gallery && Array.isArray(gallery.items) ? gallery.items : [];

    if (!items.length) {
      return "";
    }

    var galleryLabel = language === "es" ? "Galería de imágenes" : "Image gallery";
    var viewerLabel = language === "es" ? "Visor de imágenes" : "Image viewer";
    var closeLabel = language === "es" ? "Cerrar visor" : "Close viewer";
    var openLabel = language === "es" ? "Ampliar" : "Enlarge";

    return (
      "<section class='project-gallery' aria-label='" + escapeHtml(galleryLabel) + "' data-project-gallery>" +
      "<div class='project-gallery-grid'>" +
      items.map(function (item) {
        var alt = localize(item.alt, language) || "";
        var featuredClass = item.featured ? " is-featured" : "";
        var wideClass = item.wide ? " is-wide" : "";
        var landscapeClass = item.landscape ? " is-landscape" : "";

        return (
          "<button class='project-gallery-item" + featuredClass + wideClass + landscapeClass + "' type='button' data-gallery-item" +
          " data-gallery-src='" + escapeHtml(item.src) + "'" +
          " data-gallery-alt='" + escapeHtml(alt) + "'" +
          " aria-label='" + escapeHtml(openLabel + " " + alt) + "'>" +
          "<img src='" + escapeHtml(item.src) + "' alt='" + escapeHtml(alt) + "' loading='lazy'>" +
          "</button>"
        );
      }).join("") +
      "</div>" +
      "<dialog class='project-lightbox' data-project-lightbox aria-label='" +
      escapeHtml(viewerLabel) +
      "'>" +
      "<button class='project-lightbox-close' type='button' data-lightbox-close aria-label='" +
      escapeHtml(closeLabel) +
      "'>×</button>" +
      "<figure>" +
      "<img data-lightbox-image src='' alt=''>" +
      "</figure>" +
      "</dialog>" +
      "</section>"
    );
  }

  function renderSectionDescription(description, language, pendingClass) {
    var localizedDescription = localize(description, language);

    if (Array.isArray(localizedDescription) && localizedDescription.length) {
      return localizedDescription.map(function (paragraph) {
        return "<p>" + escapeHtml(paragraph) + "</p>";
      }).join("");
    }

    if (localizedDescription) {
      return "<p>" + escapeHtml(localizedDescription) + "</p>";
    }

    return "<p class='" + pendingClass + "'>" +
      escapeHtml(translate("project.pendingDetails")) +
      "</p>";
  }

  function renderSections(sections, language, layout) {
    if (!Array.isArray(sections) || !sections.length) {
      return "";
    }

    var isTimeline = layout === "timeline";
    var sectionLabel = sections.some(function (section) { return section.type === "subproject"; })
      ? translate("project.subproject")
      : translate("project.roles");

    if (isTimeline) {
      return (
        "<section class='project-subsections project-timeline' aria-labelledby='project-sections-title' data-project-timeline>" +
        "<p class='project-section-eyebrow' id='project-sections-title'>" +
        escapeHtml(sectionLabel) +
        "</p>" +
        "<ol class='project-timeline-list'>" +
        sections.map(function (section) {
          var sectionTitle = localize(section.title, language);
          var sectionDate = localize(section.date, language);

          return (
            "<li class='project-timeline-stage" + (section.current ? " is-current" : "") + "' id='" +
            escapeHtml(section.id) +
            "' data-timeline-stage" + (section.current ? " aria-current='step'" : "") + ">" +
            "<span class='project-timeline-marker' aria-hidden='true'></span>" +
            "<article class='project-timeline-content'>" +
            "<header class='project-timeline-header'>" +
            "<div class='project-timeline-title-group'>" +
            "<h2>" + escapeHtml(sectionTitle) + "</h2>" +
            (section.current
              ? "<span class='project-timeline-current'>" + escapeHtml(translate("status.currentRole")) + "</span>"
              : "") +
            "</div>" +
            (sectionDate
              ? "<p class='project-timeline-date'>" + escapeHtml(sectionDate) + "</p>"
              : "") +
            "</header>" +
            "<div class='project-timeline-description'>" +
            renderSectionDescription(section.description, language, "project-content-pending") +
            "</div>" +
            renderTextList(localize(section.responsibilities, language), "project-responsibilities") +
            renderTextList(localize(section.results, language), "project-results") +
            (section.media && section.media.length
              ? "<div class='project-subsection-media'>" + renderMedia(section.media, sectionTitle) + "</div>"
              : "") +
            "</article>" +
            "</li>"
          );
        }).join("") +
        "</ol>" +
        "</section>"
      );
    }

    return (
      "<section class='project-subsections' aria-labelledby='project-sections-title'>" +
      "<p class='project-section-eyebrow' id='project-sections-title'>" +
      escapeHtml(sectionLabel) +
      "</p>" +
      sections.map(function (section, index) {
        var sectionTitle = localize(section.title, language);

        return (
          "<article class='project-subsection' id='" +
          escapeHtml(section.id) +
          "'>" +
          "<span class='project-subsection-index' aria-hidden='true'>" +
          String(index + 1).padStart(2, "0") +
          "</span>" +
          "<h2>" +
          escapeHtml(sectionTitle) +
          "</h2>" +
          renderSectionDescription(section.description, language, "project-content-pending") +
          renderTextList(localize(section.responsibilities, language), "project-responsibilities") +
          renderTextList(localize(section.results, language), "project-results") +
          (section.media && section.media.length
            ? "<div class='project-subsection-media'>" + renderMedia(section.media, sectionTitle) + "</div>"
            : "") +
          "</article>"
        );
      }).join("") +
      "</section>"
    );
  }

  var timelineCleanup = function () {};
  var galleryCleanup = function () {};

  function initializeTimeline() {
    timelineCleanup();

    var timeline = container.querySelector("[data-project-timeline]");
    var list = timeline && timeline.querySelector(".project-timeline-list");
    var stages = list
      ? Array.prototype.slice.call(list.querySelectorAll("[data-timeline-stage]"))
      : [];
    var markers = list
      ? Array.prototype.slice.call(list.querySelectorAll(".project-timeline-marker"))
      : [];

    if (!list || markers.length < 2 || markers.length !== stages.length) {
      timelineCleanup = function () {};
      return;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var centers = [];
    var frame = null;
    var resizeObserver = null;

    function updateTimeline() {
      frame = null;

      if (!centers.length) {
        return;
      }

      var listRect = list.getBoundingClientRect();
      var readingPosition = Math.min(window.innerHeight * 0.46, 520) - listRect.top;
      var start = centers[0];
      var end = centers[centers.length - 1];
      var distance = Math.max(end - start, 1);
      var progress = Math.max(0, Math.min(1, (readingPosition - start) / distance));
      var timelineIsApproaching = listRect.top <= window.innerHeight * 0.72;
      var activeIndex = -1;
      var smallestDistance = Infinity;

      if (reduceMotion) {
        progress = 1;
      }

      if (timelineIsApproaching) {
        centers.forEach(function (center, index) {
          var markerDistance = Math.abs(readingPosition - center);
          if (markerDistance < smallestDistance) {
            smallestDistance = markerDistance;
            activeIndex = index;
          }
        });
      }

      list.style.setProperty("--timeline-progress", String(progress));

      stages.forEach(function (stage, index) {
        var stageProgress = (centers[index] - start) / distance;
        stage.classList.toggle("is-reached", reduceMotion || progress + 0.001 >= stageProgress);
        stage.classList.toggle("is-active", index === activeIndex);
      });
    }

    function measureTimeline() {
      var listRect = list.getBoundingClientRect();

      centers = markers.map(function (marker) {
        var markerRect = marker.getBoundingClientRect();
        return markerRect.top - listRect.top + markerRect.height / 2;
      });

      var start = centers[0];
      var length = Math.max(centers[centers.length - 1] - start, 0);
      list.style.setProperty("--timeline-start", start + "px");
      list.style.setProperty("--timeline-length", length + "px");
      updateTimeline();
    }

    function requestTimelineUpdate() {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(updateTimeline);
    }

    window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
    window.addEventListener("resize", measureTimeline);

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(measureTimeline);
      resizeObserver.observe(list);
    }

    window.requestAnimationFrame(measureTimeline);

    timelineCleanup = function () {
      window.removeEventListener("scroll", requestTimelineUpdate);
      window.removeEventListener("resize", measureTimeline);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }

  function initializeGallery() {
    galleryCleanup();

    var gallery = container.querySelector("[data-project-gallery]");
    var lightbox = gallery && gallery.querySelector("[data-project-lightbox]");
    var lightboxImage = lightbox && lightbox.querySelector("[data-lightbox-image]");
    var closeButton = lightbox && lightbox.querySelector("[data-lightbox-close]");
    var lastTrigger = null;

    if (!gallery || !lightbox || !lightboxImage || !closeButton) {
      galleryCleanup = function () {};
      return;
    }

    function closeLightbox() {
      if (lightbox.open) {
        lightbox.close();
      }
    }

    function handleGalleryClick(event) {
      var trigger = event.target.closest("[data-gallery-item]");

      if (!trigger || !gallery.contains(trigger)) {
        return;
      }

      lastTrigger = trigger;
      lightboxImage.src = trigger.getAttribute("data-gallery-src") || "";
      lightboxImage.alt = trigger.getAttribute("data-gallery-alt") || "";
      document.body.classList.add("is-lightbox-open");

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }

      closeButton.focus();
    }

    function handleBackdropClick(event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    }

    function handleClose() {
      document.body.classList.remove("is-lightbox-open");
      lightboxImage.src = "";
      if (lastTrigger) {
        lastTrigger.focus();
      }
    }

    gallery.addEventListener("click", handleGalleryClick);
    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", handleBackdropClick);
    lightbox.addEventListener("close", handleClose);

    galleryCleanup = function () {
      gallery.removeEventListener("click", handleGalleryClick);
      closeButton.removeEventListener("click", closeLightbox);
      lightbox.removeEventListener("click", handleBackdropClick);
      lightbox.removeEventListener("close", handleClose);
      document.body.classList.remove("is-lightbox-open");
    };
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  var selected = projects.find(function (project) {
    return project.slug === slug;
  });
  var isFallback = false;

  if (!selected) {
    selected = projects[0];
    isFallback = Boolean(slug);
  }

  function renderSelectedProject() {
    var language = getLanguage();
    var title = localize(selected.title, language);
    var category = localize(selected.category, language);
    var specialty = localize(selected.specialty, language);
    var date = localize(selected.date, language);
    var summary = localize(selected.summary, language);
    var introduction = selected.content && localize(selected.content.introduction, language)
      ? localize(selected.content.introduction, language)
      : summary;
    var bodyItems = selected.content
      ? localize(selected.content.body, language)
      : [];
    var dateMarkup = date
      ? "<p class='project-detail-date'>" + escapeHtml(date) + "</p>"
      : "";
    var summaryMarkup = introduction
      ? "<p class='project-detail-intro'>" + renderInlineText(introduction) + "</p>"
      : "<p class='project-detail-intro project-content-pending'>" +
        escapeHtml(translate("home.pendingDetails")) +
        "</p>";
    var body = Array.isArray(bodyItems)
      ? bodyItems.map(function (paragraph) {
        return "<p>" + renderInlineText(localize(paragraph, language)) + "</p>";
      }).join("")
      : "";
    var isTimelineProject = selected.sectionLayout === "timeline";
    var hasProjectMedia = Array.isArray(selected.media) && selected.media.length > 0;
    var hasProjectGallery = Boolean(
      selected.gallery &&
      Array.isArray(selected.gallery.items) &&
      selected.gallery.items.length
    );
    var showProjectMedia = hasProjectGallery || hasProjectMedia || (!isTimelineProject && !selected.hideEmptyMedia);
    var projectMediaMarkup =
      (hasProjectMedia ? renderMedia(selected.media, title) : "") +
      (hasProjectGallery ? renderGallery(selected.gallery, language) : "") +
      (!hasProjectMedia && !hasProjectGallery ? renderMedia([], title) : "");
    var descriptionMeta = document.querySelector("[data-project-description]");

    document.title = title + " — Miguel Arnáiz";
    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        "content",
        introduction || translate("project.metaDescription", { title: title })
      );
    }

    container.innerHTML =
      (isFallback
        ? "<p class='project-fallback' role='status'>" +
          escapeHtml(translate("project.notFound")) +
          "</p>"
        : "") +
      "<article class='project-detail' data-project-id='" +
      escapeHtml(selected.id) +
      "' data-reveal>" +
      "<div class='project-detail-layout" +
      (!showProjectMedia ? " project-detail-layout-text-only" : "") +
      "'>" +
      "<div class='project-detail-copy'>" +
      "<a class='project-top-back-link' href='./#projects' data-transition aria-label='" +
      escapeHtml(translate("project.back")) +
      "' title='" +
      escapeHtml(translate("project.back")) +
      "'><span aria-hidden='true'>←</span></a>" +
      "<p class='project-category'>" +
      escapeHtml(category) +
      "</p>" +
      "<h1 class='project-detail-title'>" +
      escapeHtml(title) +
      "</h1>" +
      "<p class='project-detail-specialty'>" +
      escapeHtml(specialty) +
      "</p>" +
      dateMarkup +
      "<div class='project-detail-narrative'>" +
      summaryMarkup +
      body +
      "</div>" +
      renderProjectLinks(selected.links, language) +
      renderMetrics(selected.metrics, language) +
      renderTextList(selected.content && localize(selected.content.results, language), "project-results") +
      renderTextList(selected.content && localize(selected.content.learnings, language), "project-learnings") +
      renderSections(selected.sections, language, selected.sectionLayout) +
      "<a class='project-back-link' href='./#projects' data-transition><span aria-hidden='true'>←</span> " +
      escapeHtml(translate("project.back")) +
      "</a>" +
      "</div>" +
      (showProjectMedia
        ? "<aside class='project-detail-media' aria-label='" +
          escapeHtml(translate("project.mediaAria")) +
          "'>" +
          projectMediaMarkup +
          "</aside>"
        : "") +
      "</div>" +
      "</article>";

    if (typeof window.revealElements === "function") {
      window.revealElements(container);
    }

    initializeTimeline();
    initializeGallery();
  }

  document.addEventListener("languagechange", renderSelectedProject);
  renderSelectedProject();
})();

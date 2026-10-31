(function languageController() {
  var storageKey = "portfolio-language";
  var defaultLanguage = "en";
  var supportedLanguages = ["es", "en"];

  var translations = {
    "meta.home.title": {
      es: "Miguel Arnáiz",
      en: "Miguel Arnáiz"
    },
    "meta.home.description": {
      es: "Miguel Arnáiz's professional portfolio.",
      en: "Miguel Arnáiz's professional portfolio."
    },
    "meta.about.title": {
      es: "Miguel Arnáiz - Sobre mí",
      en: "Miguel Arnáiz - About"
    },
    "meta.about.description": {
      es: "Perfil profesional de Miguel Arnáiz, emprendedor y graduado en Administración de Empresas en Madrid.",
      en: "Professional profile of Miguel Arnáiz, an entrepreneur and Business Administration graduate based in Madrid."
    },
    "meta.project.title": {
      es: "Miguel Arnáiz — Proyecto",
      en: "Miguel Arnáiz — Project"
    },
    "nav.main": { es: "Navegación principal", en: "Main navigation" },
    "nav.home": { es: "Inicio", en: "Home" },
    "nav.about": { es: "Sobre mí", en: "About" },
    "nav.location": { es: "Madrid, España", en: "Madrid, Spain" },
    "language.selector": { es: "Seleccionar idioma", en: "Select language" },
    "hero.introduction": { es: "Introducción", en: "Introduction" },
    "hero.positioning": {
      es: "Growth · Business · Technology",
      en: "Growth · Business · Technology"
    },
    "hero.tagline": {
      es: "Curioso por naturaleza. Impulsado por crear, mejorar y crecer.",
      en: "Curious by nature. Driven to build, improve and grow."
    },
    "hero.explore": { es: "Explora mi trabajo", en: "Explore my work" },
    "hero.about": { es: "Sobre mí", en: "About me" },
    "hero.currentFocus": { es: "Enfoque actual", en: "Current focus" },
    "home.heading": {
      es: "Experiencia.",
      en: "Experience."
    },
    "home.intro": {
      es: "Una selección de proyectos y experiencias que reflejan mi recorrido profesional.",
      en: "A selection of projects and experiences that reflect my professional journey."
    },
    "home.logoMarqueeLabel": {
      es: "Marcas y proyectos seleccionados",
      en: "Selected brands and ventures"
    },
    "home.sortAria": { es: "Orden de proyectos por fecha", en: "Project order by date" },
    "home.sortBy": { es: "Ordenar", en: "Sort" },
    "home.newestFirst": { es: "Fecha: más reciente", en: "Date: newest first" },
    "home.oldestFirst": { es: "Fecha: más antigua", en: "Date: oldest first" },
    "home.projectList": { es: "Lista de proyectos", en: "Project list" },
    "home.visualArchive": { es: "Archivo visual", en: "Visual archive" },
    "home.pendingDetails": {
      es: "Los detalles del proyecto se añadirán aquí.",
      en: "Project details will be added here."
    },
    "home.exploreProject": { es: "Explorar proyecto", en: "Explore project" },
    "home.openProject": {
      es: "Abrir la ficha de {title}",
      en: "Open {title} project details"
    },
    "home.noProjects": {
      es: "Todavía no hay proyectos en esta categoría.",
      en: "No projects found in this category yet."
    },
    "home.careerProgression": {
      es: "Evolución profesional",
      en: "Career Progression"
    },
    "home.careerProgressionAria": {
      es: "Evolución profesional en {title}",
      en: "Career progression at {title}"
    },
    "status.current": { es: "Actualmente", en: "Currently" },
    "status.currentRole": { es: "Puesto actual", en: "Current role" },
    "category.professional-experience": {
      es: "Experiencia profesional",
      en: "Professional Experience"
    },
    "category.entrepreneurship": { es: "Emprendimiento", en: "Entrepreneurship" },
    "category.leadership": { es: "Liderazgo", en: "Leadership" },
    "category.content-creation": { es: "Creación de contenido", en: "Content Creation" },
    "category.public-speaking": { es: "Oratoria", en: "Public Speaking" },
    "category.graphic-design": { es: "Diseño gráfico", en: "Graphic Design" },
    "project.profileBanner": { es: "Cabecera del proyecto", en: "Project header" },
    "project.selectedWork": { es: "Trabajo seleccionado", en: "Selected work" },
    "project.archive": { es: "Archivo de proyectos", en: "Project archive" },
    "project.notFound": {
      es: "Proyecto no encontrado. Se muestra el primer proyecto.",
      en: "Project not found. Showing the first project."
    },
    "project.subproject": { es: "Subproyecto", en: "Subproject" },
    "project.roles": { es: "Puestos", en: "Roles" },
    "project.pendingDetails": {
      es: "Los detalles se añadirán aquí.",
      en: "Details will be added here."
    },
    "project.videoUnsupported": {
      es: "Tu navegador no admite vídeo integrado.",
      en: "Your browser does not support embedded video."
    },
    "project.embeddedMedia": {
      es: "Contenido multimedia integrado del proyecto",
      en: "Embedded project media"
    },
    "project.mediaPlaceholder": {
      es: "Espacio multimedia para {title}",
      en: "Media placeholder for {title}"
    },
    "project.mediaArchive": {
      es: "Archivo de fotografía y vídeo",
      en: "Photography and video archive"
    },
    "project.toBeAdded": { es: "Pendiente de incorporar", en: "To be added" },
    "project.mediaAria": { es: "Multimedia del proyecto", en: "Project media" },
    "project.metaDescription": {
      es: "Ficha de {title} en el portfolio profesional de Miguel Arnáiz.",
      en: "{title} project page in Miguel Arnáiz's professional portfolio."
    },
    "project.back": { es: "Volver a todos los proyectos", en: "Back to all projects" },
    "about.profileBanner": { es: "Cabecera de perfil", en: "Profile banner" },
    "about.kicker": { es: "Sobre mí", en: "About me" },
    "about.greeting": { es: "Hola, soy Miguel", en: "Hi, I'm Miguel" },
    "about.sectionAria": { es: "Sobre Miguel", en: "About Miguel" },
    "about.title": {
      es: "La inquietud ha sido una constante en todo lo que he hecho hasta ahora.",
      en: "Curiosity has been a constant in everything I've done so far."
    },
    "about.paragraph1": {
      es: "Siempre he tenido curiosidad por aprender algo nuevo, entender cómo funcionan las cosas y descubrir si existe una forma mejor de hacerlas. Y, sobre todo, me gusta llevar esa curiosidad a la práctica.",
      en: "I've always been curious to learn something new, understand how things work, and find out whether there is a better way to do them. Above all, I like putting that curiosity into practice."
    },
    "about.paragraph2": {
      es: "Profesionalmente, me atrae especialmente el mundo de la empresa porque combina muchas de las cosas que despiertan esa curiosidad: entender por qué crece un negocio, qué mueve a un cliente, cómo mejorar un proceso o cómo posicionar una marca.",
      en: "Professionally, I am especially drawn to business because it brings together many of the questions that spark that curiosity: why a company grows, what drives a customer, how to improve a process, or how to position a brand."
    },
    "about.paragraph3": {
      es: "Esa inquietud me ha llevado a explorar ámbitos muy distintos, ya sea de negocio, operaciones, growth, marketing, automatización, tecnología o incluso de diseño gráfico; y con el tiempo he descubierto que precisamente ahí está una de mis mayores fortalezas. Me gusta entender los problemas y buscar soluciones teniendo en cuenta el negocio al completo.",
      en: "That curiosity has led me to explore very different areas, from business, operations, growth, marketing, automation, and technology to graphic design. Over time, I have realized that this breadth is one of my greatest strengths. I like understanding problems and finding solutions with the whole business in mind."
    },
    "about.paragraph4": {
      es: "Disfruto especialmente de los entornos con ritmo, autonomía y cosas todavía por construir. Lugares donde pueda asumir responsabilidad, estar cerca de las decisiones, proponer ideas, ejecutarlas y aprender.",
      en: "I especially enjoy fast-moving environments with autonomy and plenty still to build. Places where I can take ownership, stay close to decisions, propose ideas, execute them, and learn."
    },
    "about.paragraph5": {
      es: "Soy exigente conmigo mismo y tengo una ambición profesional clara: seguir creciendo, afrontar problemas cada vez más complejos y convertirme en alguien capaz de generar cada vez más valor allí donde esté.",
      en: "I hold myself to high standards and have a clear professional ambition: to keep growing, tackle increasingly complex problems, and become someone capable of creating more and more value wherever I am."
    },
    "about.paragraph6": {
      es: "Todavía me queda muchísimo por aprender. Y precisamente eso es una de las cosas que más me motivan.",
      en: "I still have a great deal to learn. And that is precisely one of the things that motivates me most."
    },
    "about.quickFacts": { es: "Datos rápidos", en: "Quick facts" },
    "about.education": { es: "Formación", en: "Education" },
    "about.educationValue": {
      es: "Grado en Administración y Dirección de Empresas",
      en: "Degree in Business Administration and Management"
    },
    "about.educationInstitutionValue": {
      es: "Universidad Carlos III de Madrid",
      en: "Universidad Carlos III de Madrid"
    },
    "about.internationalExperience": {
      es: "Experiencia internacional",
      en: "International experience"
    },
    "about.internationalExperienceValue": {
      es: "Erasmus en University of Latvia, Riga",
      en: "Erasmus at the University of Latvia, Riga"
    },
    "about.focus": { es: "Enfoque", en: "Focus" },
    "about.focusValue": {
      es: "Growth, negocio, operaciones y tecnología",
      en: "Growth, business, operations & technology"
    },
    "about.experience": { es: "Experiencia", en: "Experience" },
    "about.experienceValue": {
      es: "Emprendiendo y construyendo proyectos desde los 13 años",
      en: "Building ventures and projects since age 13"
    },
    "about.startImageAlt": {
      es: "Miguel dando una charla en un evento de Start UC3M",
      en: "Miguel speaking at a Start UC3M event"
    },
    "footer.label": { es: "Pie de página", en: "Footer" },
    "footer.rights": { es: "Todos los derechos reservados.", en: "All rights reserved." },
    "footer.contactLinks": { es: "Enlaces de contacto", en: "Contact links" },
    "footer.linkedinTitle": { es: "Miguel Arnáiz en LinkedIn", en: "Miguel Arnáiz on LinkedIn" },
    "footer.email": { es: "Correo", en: "Email" },
    "cv.button": { es: "CV", en: "CV" },
    "cv.openMenu": { es: "Mostrar opciones de descarga del CV", en: "Show CV download options" },
    "cv.languageMenu": { es: "Elegir idioma del CV", en: "Choose CV language" },
    "cv.spanish": { es: "CV Español", en: "Spanish CV" },
    "cv.english": { es: "CV English", en: "English CV" },
    "theme.mode.system": { es: "sistema", en: "system" },
    "theme.mode.dark": { es: "oscuro", en: "dark" },
    "theme.mode.light": { es: "claro", en: "light" },
    "theme.aria": {
      es: "Modo de tema: {mode}. Tema actual: {theme}. Pulsa para cambiar al modo {next}.",
      en: "Theme mode: {mode}. Current theme: {theme}. Click to switch to {next} mode."
    },
    "theme.title": {
      es: "Tema: {mode} (siguiente: {next})",
      en: "Theme: {mode} (next: {next})"
    }
  };

  function getSavedLanguage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (error) {
      // Keep the selected language for the current page when storage is unavailable.
    }
  }

  function resolveLanguage() {
    var savedLanguage = getSavedLanguage();
    return supportedLanguages.indexOf(savedLanguage) !== -1
      ? savedLanguage
      : defaultLanguage;
  }

  function interpolate(value, replacements) {
    return Object.keys(replacements || {}).reduce(function (result, key) {
      return result.replace(new RegExp("\\{" + key + "\\}", "g"), replacements[key]);
    }, value);
  }

  var currentLanguage = resolveLanguage();

  function translate(key, replacements, language) {
    var entry = translations[key];
    var selectedLanguage = language || currentLanguage;

    if (!entry) {
      return key;
    }

    var value = entry[selectedLanguage];
    if (value == null || value === "") {
      value = entry[defaultLanguage] || entry.es || "";
    }

    return interpolate(String(value), replacements || {});
  }

  function localize(value, language) {
    var selectedLanguage = language || currentLanguage;

    if (value == null) {
      return value;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      if (Object.prototype.hasOwnProperty.call(value, selectedLanguage)) {
        return value[selectedLanguage];
      }
      if (Object.prototype.hasOwnProperty.call(value, defaultLanguage)) {
        return value[defaultLanguage];
      }
      if (Object.prototype.hasOwnProperty.call(value, "es")) {
        return value.es;
      }
    }

    return value;
  }

  function updateLanguageControls(root) {
    (root || document).querySelectorAll("[data-language]").forEach(function (button) {
      var isActive = button.getAttribute("data-language") === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function localizePage(root) {
    var scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = translate(element.getAttribute("data-i18n"));
    });

    scope.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      element.innerHTML = translate(element.getAttribute("data-i18n-html"));
    });

    ["aria-label", "title", "content"].forEach(function (attribute) {
      var dataAttribute = "data-i18n-" + attribute;
      scope.querySelectorAll("[" + dataAttribute + "]").forEach(function (element) {
        element.setAttribute(attribute, translate(element.getAttribute(dataAttribute)));
      });
    });

    updateLanguageControls(scope);
  }

  function setLanguage(language) {
    if (supportedLanguages.indexOf(language) === -1) {
      return;
    }

    currentLanguage = language;
    saveLanguage(language);
    document.documentElement.lang = language;
    localizePage(document);
    document.dispatchEvent(new CustomEvent("languagechange", {
      detail: { language: language }
    }));
  }

  document.documentElement.lang = currentLanguage;

  window.I18N = {
    defaultLanguage: defaultLanguage,
    storageKey: storageKey,
    getLanguage: function () { return currentLanguage; },
    setLanguage: setLanguage,
    t: translate,
    localize: localize,
    localizePage: localizePage
  };

  document.addEventListener("DOMContentLoaded", function () {
    localizePage(document);

    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguage(button.getAttribute("data-language"));
      });
    });
  });
})();

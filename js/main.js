document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // App cards: <div class="apps-grid" data-apps data-base="path/to/site/root/">
  // Cards are built from apps.json so adding an app only means adding one entry there.
  var grid = document.querySelector("[data-apps]");
  if (!grid) return;
  var base = grid.getAttribute("data-base") || "";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function card(app) {
    var id = encodeURIComponent(app.id);
    var page = base + "apps/" + id + "/";
    return (
      '<article class="app-card">' +
        '<img class="icon" src="' + base + "assets/" + id + '/app_icon.png" alt="' + esc(app.name) + ' logo" width="64" height="64" loading="lazy">' +
        '<span class="tag">' + esc(app.badge) + "</span>" +
        "<h3>" + esc(app.name) + "</h3>" +
        "<p>" + esc(app.description) + "</p>" +
        '<a class="btn btn-primary" href="' + page + 'index.html">View App &rarr;</a>' +
        '<a class="small-link" href="' + page + 'privacy.html">Privacy Policy</a>' +
      "</article>"
    );
  }

  fetch(base + "apps.json")
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (apps) {
      grid.innerHTML = apps.map(card).join("");
    })
    .catch(function () {
      grid.innerHTML = '<p class="muted">Could not load the app list. Please refresh the page.</p>';
    });
});

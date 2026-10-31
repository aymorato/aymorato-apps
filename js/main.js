/* AYMorato Apps — site script.
   Vanilla JS, no build step. Shared by every page; each feature checks for
   its own markup and quietly skips itself when the page doesn't have it. */
(function () {
  "use strict";

  // The site root, resolved from this script's URL (js/main.js -> ../), so
  // links work the same from /, /apps/ and /apps/<id>/.
  var ROOT = new URL("../", document.currentScript.src).href;
  var EMAIL = "aymorato.apps@gmail.com";
  var GITHUB = "https://github.com/alwinmorato";
  var REPO = "aymorato/aymorato-apps";
  var THEME_KEY = "aymorato:theme";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // apps.json is fetched once and shared by everything that lists apps.
  var appsReady = fetch(ROOT + "apps.json").then(function (response) {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function appUrl(app) {
    return ROOT + "apps/" + encodeURIComponent(app.id) + "/";
  }

  function iconUrl(app) {
    return ROOT + "assets/" + encodeURIComponent(app.id) + "/app_icon.png";
  }

  function go(href) {
    return function () { location.href = href; };
  }

  /* Theme ------------------------------------------------------------------ */

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#F5F7FA" : "#0F172A");
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
    });
    return theme;
  }

  function toggleTheme() {
    return setTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  function initTheme() {
    setTheme(currentTheme());
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });
  }

  /* Toast + clipboard ------------------------------------------------------ */

  var toastEl;
  var toastTimer;

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1900);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      area.remove();
    });
  }

  function copyEmail() {
    copyText(EMAIL)
      .then(function () { toast("Copied " + EMAIL); })
      .catch(function () { location.href = "mailto:" + EMAIL; });
  }

  function initCopyButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-copy]");
      if (!btn) return;
      var text = btn.getAttribute("data-copy");
      copyText(text)
        .then(function () { toast("Copied " + text); })
        .catch(function () { location.href = "mailto:" + text; });
    });
  }

  /* Header ----------------------------------------------------------------- */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initKbdHints() {
    if (!isMac) return;
    document.querySelectorAll(".kbd-mod").forEach(function (el) { el.textContent = "⌘"; });
  }

  /* App tiles (homepage + /apps/) ------------------------------------------ */

  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function appTile(app, i) {
    var url = appUrl(app);
    var specs = app.specs || {};
    var rows = Object.keys(specs).map(function (key) {
      return "<div><dt>" + esc(key) + "</dt><dd>" + esc(specs[key]) + "</dd></div>";
    }).join("");
    var status = app.play
      ? '<a class="status" href="' + esc(app.play) + '" target="_blank" rel="noopener">Google Play ↗</a>'
      : '<span class="status"><span class="status-store">Google Play · </span>soon</span>';

    return (
      '<article class="tile app-tile">' +
        '<div class="app-top">' +
          '<img class="app-icon" src="' + iconUrl(app) + '" alt="" width="56" height="56" loading="lazy">' +
          "<div>" +
            '<p class="app-path">' + String(i + 1).padStart(2, "0") + " · apps/" + esc(app.id) + "</p>" +
            '<span class="tag">' + esc(app.badge) + "</span>" +
          "</div>" +
          status +
        "</div>" +
        '<div class="app-body">' +
          '<div class="app-main">' +
            '<h3><a href="' + url + '">' + esc(app.name) + "</a></h3>" +
            "<p>" + esc(app.description) + "</p>" +
          "</div>" +
          (rows ? '<dl class="specs">' + rows + "</dl>" : "") +
        "</div>" +
        '<div class="app-foot">' +
          '<span class="app-cta" aria-hidden="true">View app ' + ARROW + "</span>" +
          '<a href="' + url + 'privacy.html">privacy policy</a>' +
        "</div>" +
      "</article>"
    );
  }

  function initAppTiles() {
    var grids = document.querySelectorAll("[data-apps]");
    if (!grids.length) return;

    appsReady
      .then(function (apps) {
        var html = apps.map(appTile).join("");
        grids.forEach(function (grid) {
          grid.innerHTML = html;
          grid.removeAttribute("aria-busy");
        });
      })
      .catch(function () {
        grids.forEach(function (grid) {
          grid.innerHTML = '<p class="tile tile-note">Could not load the app list. Please refresh the page.</p>';
          grid.removeAttribute("aria-busy");
        });
      });
  }

  // Footer "apps" column. The static "All apps" link stays as the last item.
  function initAppLinks() {
    var lists = document.querySelectorAll("[data-app-links]");
    if (!lists.length) return;

    appsReady
      .then(function (apps) {
        var html = apps.map(function (app) {
          return '<li><a href="' + appUrl(app) + '">' + esc(app.short || app.name) + "</a></li>";
        }).join("");
        lists.forEach(function (list) { list.insertAdjacentHTML("afterbegin", html); });
      })
      .catch(function () {});
  }

  // Cursor spotlight on bento tiles (see .tile::before in style.css).
  function initSpotlight() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    document.addEventListener("pointermove", function (e) {
      var tile = e.target.closest && e.target.closest(".tile");
      if (!tile) return;
      var rect = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", e.clientX - rect.left + "px");
      tile.style.setProperty("--my", e.clientY - rect.top + "px");
    }, { passive: true });
  }

  /* Studio tiles ----------------------------------------------------------- */

  function manilaTime() {
    var parts = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date())
      .forEach(function (p) { parts[p.type] = p.value; });
    return { hour: parts.hour, minute: parts.minute };
  }

  function dayPart(hour) {
    if (hour < 5) return "late night in Bicol";
    if (hour < 12) return "morning in Bicol";
    if (hour < 18) return "afternoon in Bicol";
    return "evening in Bicol";
  }

  function initClock() {
    var big = document.querySelectorAll("[data-clock-big]");
    var small = document.querySelectorAll("[data-clock]");
    var part = document.querySelectorAll("[data-daypart]");
    if (!big.length && !small.length) return;

    function tick() {
      var t = manilaTime();
      big.forEach(function (el) { el.innerHTML = t.hour + '<span class="colon">:</span>' + t.minute; });
      small.forEach(function (el) { el.textContent = t.hour + ":" + t.minute; });
      part.forEach(function (el) { el.textContent = dayPart(Number(t.hour)); });
    }
    tick();
    setInterval(tick, 10000);
  }

  /* Command palette (Ctrl/⌘ K or "/") -------------------------------------- */

  function isTyping(el) {
    return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }

  function initPalette() {
    if (typeof HTMLDialogElement !== "function") return;

    var dialog = document.createElement("dialog");
    dialog.className = "cmdk";
    dialog.setAttribute("aria-label", "Command palette");
    dialog.innerHTML =
      '<div class="cmdk-box">' +
        '<div class="cmdk-input"><span aria-hidden="true">›</span>' +
          '<input type="text" placeholder="Jump to an app, page or action…" autocomplete="off" spellcheck="false" ' +
          'role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" aria-label="Search">' +
          "<kbd>esc</kbd></div>" +
        '<ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Results"></ul>' +
        '<div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span></div>' +
      "</div>";
    document.body.appendChild(dialog);

    var input = dialog.querySelector("input");
    var list = dialog.querySelector(".cmdk-list");
    var shown = [];
    var active = 0;
    var entries = [
      { group: "Pages", glyph: "/", label: "Home", hint: "/", run: go(ROOT) },
      { group: "Pages", glyph: "/", label: "All apps", hint: "/apps", run: go(ROOT + "apps/") },
      { group: "Pages", glyph: "/", label: "Studio", hint: "/#studio", run: go(ROOT + "#studio") },
      { group: "Pages", glyph: "/", label: "Contact", hint: "/contact", run: go(ROOT + "contact.html") },
      { group: "Pages", glyph: "/", label: "Terms of Use", hint: "/terms", run: go(ROOT + "terms.html") },
      { group: "Actions", glyph: ">", label: "Toggle light / dark theme", hint: "theme", run: toggleTheme },
      { group: "Actions", glyph: ">", label: "Copy email address", hint: EMAIL, run: copyEmail },
      { group: "Actions", glyph: ">", label: "View this site's source", hint: "github.com/" + REPO, run: go("https://github.com/" + REPO) }
    ];

    appsReady
      .then(function (apps) {
        var appEntries = apps.map(function (app) {
          return { group: "Apps", icon: iconUrl(app), label: app.short || app.name, hint: app.badge, run: go(appUrl(app)) };
        });
        var privacyEntries = apps.map(function (app) {
          return { group: "Privacy policies", glyph: "§", label: (app.short || app.name) + " privacy policy", hint: app.id, run: go(appUrl(app) + "privacy.html") };
        });
        entries = appEntries.concat(entries.slice(0, 5), privacyEntries, entries.slice(5));
        if (dialog.open) render();
      })
      .catch(function () {});

    function matches(entry, terms) {
      var hay = (entry.label + " " + entry.hint + " " + entry.group).toLowerCase();
      return terms.every(function (term) { return hay.indexOf(term) !== -1; });
    }

    function render() {
      var terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      shown = entries.filter(function (entry) { return matches(entry, terms); });
      active = Math.min(active, Math.max(shown.length - 1, 0));

      var html = "";
      var group = "";
      shown.forEach(function (entry, i) {
        if (entry.group !== group) {
          group = entry.group;
          html += '<li class="cmdk-group" role="presentation">' + esc(group) + "</li>";
        }
        html +=
          '<li class="cmdk-item" role="option" id="cmdk-' + i + '" data-i="' + i + '" aria-selected="' + (i === active) + '">' +
            (entry.icon
              ? '<img src="' + esc(entry.icon) + '" alt="" width="22" height="22">'
              : '<span class="cmdk-glyph" aria-hidden="true">' + esc(entry.glyph) + "</span>") +
            '<span class="cmdk-label">' + esc(entry.label) + "</span>" +
            '<span class="cmdk-hint">' + esc(entry.hint) + "</span>" +
          "</li>";
      });
      list.innerHTML = html || '<li class="cmdk-empty">Nothing matches. Try "lto" or "privacy".</li>';
      highlight(active);
    }

    function highlight(i) {
      active = i;
      list.querySelectorAll(".cmdk-item").forEach(function (item) {
        item.setAttribute("aria-selected", String(Number(item.getAttribute("data-i")) === i));
      });
      var current = list.querySelector('[aria-selected="true"]');
      if (current) {
        input.setAttribute("aria-activedescendant", current.id);
        current.scrollIntoView({ block: "nearest" });
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    }

    function choose(i) {
      var entry = shown[i];
      if (!entry) return;
      dialog.close();
      entry.run();
    }

    function open() {
      if (dialog.open) return;
      input.value = "";
      active = 0;
      render();
      dialog.showModal();
      input.focus();
    }

    input.addEventListener("input", function () {
      active = 0;
      render();
    });
    input.addEventListener("keydown", function (e) {
      if (!shown.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        highlight((active + 1) % shown.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        highlight((active - 1 + shown.length) % shown.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        choose(active);
      }
    });
    list.addEventListener("click", function (e) {
      var item = e.target.closest(".cmdk-item");
      if (item) choose(Number(item.getAttribute("data-i")));
    });
    list.addEventListener("mousemove", function (e) {
      var item = e.target.closest(".cmdk-item");
      if (item && Number(item.getAttribute("data-i")) !== active) highlight(Number(item.getAttribute("data-i")));
    });
    // A click on the backdrop lands on the <dialog> itself.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });

    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.open) dialog.close();
        else open();
      } else if (e.key === "/" && !dialog.open && !isTyping(e.target)) {
        e.preventDefault();
        open();
      }
    });
    document.querySelectorAll("[data-cmdk]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });
  }

  /* Hero terminal ---------------------------------------------------------- */

  function pad(text, width) {
    return text.length >= width ? text + " " : text + new Array(width - text.length + 1).join(" ");
  }

  function initTerminal() {
    var term = document.querySelector("[data-terminal]");
    if (!term) return;

    var body = term.querySelector(".term-body");
    var out = term.querySelector(".term-out");
    var form = term.querySelector(".term-form");
    var input = term.querySelector(".term-input");
    var apps = [];
    var history = [];
    var historyAt = 0;
    var booted = false;
    var finishBoot = function () {};

    // A line is a list of [text, className?, href?] segments.
    function line(segments) {
      var row = document.createElement("div");
      row.className = "tl";
      segments.forEach(function (seg) {
        var el = document.createElement(seg[2] ? "a" : "span");
        el.textContent = seg[0];
        if (seg[1]) el.className = seg[1];
        if (seg[2]) {
          el.href = seg[2];
          if (/^https?:/.test(seg[2])) { el.target = "_blank"; el.rel = "noopener"; }
        }
        row.appendChild(el);
      });
      out.appendChild(row);
      body.scrollTop = body.scrollHeight;
      return row;
    }

    function say(text, cls) {
      return line([[text, cls]]);
    }

    function prompt() {
      return [["alwin@albay", "t-user t-host"], [":", "t-dim t-host"], ["~/aymorato", "t-path"], ["$ ", "t-dim"]];
    }

    function findApp(query) {
      var q = query.replace(/\/$/, "");
      if (!q) return null;
      return apps.filter(function (app) {
        return app.id.indexOf(q) === 0 || (app.short || app.name).toLowerCase().indexOf(q) !== -1;
      })[0] || null;
    }

    var commands = {
      help: function () {
        [
          ["ls", "list the apps"],
          ["open <app>", "open an app page, e.g. open lto"],
          ["whoami", "who builds these"],
          ["doctor", "check the stack"],
          ["contact", "how to reach us"],
          ["theme", "toggle light / dark"],
          ["clear", "clear the screen"]
        ].forEach(function (row) {
          line([[pad(row[0], 13), "t-ok"], [row[1], "t-dim"]]);
        });
        say("tip: Ctrl/⌘ K opens the command palette anywhere", "t-dim");
      },
      ls: function () {
        if (!apps.length) return say("ls: apps.json didn't load. try refreshing", "t-err");
        apps.forEach(function (app) {
          line([[pad(app.id + "/", 17), "t-dir"], [app.tagline || app.badge, "t-dim"]]);
        });
      },
      open: function (arg) {
        if (!arg) return say("usage: open <app>   e.g. open csc", "t-dim");
        var app = findApp(arg);
        if (!app) return say("open: no app matches '" + arg + "'. try ls", "t-err");
        say("→ opening " + (app.short || app.name) + "…", "t-ok");
        setTimeout(go(appUrl(app)), 350);
      },
      whoami: function () {
        line([["alwin", "t-ok"], [" · indie flutter developer", ""]]);
        say("albay, philippines · building apps for PH exams & school", "t-dim");
      },
      doctor: function () {
        say("Doctor summary:", "t-dim");
        ["Flutter (channel stable)", "Dart", "SQLite (via sqflite)", "Hive · on-device storage", "AdMob · keeps the apps free", "Android toolchain"].forEach(function (item) {
          line([["[✓] ", "t-ok"], [item, ""]]);
        });
        say("• No issues found!", "t-ok");
      },
      contact: function () {
        line([["email   ", "t-dim"], [EMAIL, "t-link", "mailto:" + EMAIL]]);
        line([["github  ", "t-dim"], [GITHUB.replace("https://", ""), "t-link", GITHUB]]);
        say("bug report? include the app name, phone model and Android version", "t-dim");
      },
      theme: function () {
        say("theme → " + toggleTheme(), "t-ok");
      },
      clear: function () {
        out.textContent = "";
      },
      date: function () {
        say(new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "full", timeStyle: "short" }) + " (PHT)");
      },
      sudo: function () {
        say("nice try. this incident will be reported.", "t-warn");
      },
      exit: function () {
        say("logout? there's more below. scroll ↓", "t-dim");
      },
      flutter: function (arg) {
        if (arg === "doctor") return commands.doctor();
        say("flutter: try 'flutter doctor'", "t-dim");
      }
    };
    commands.apps = commands.ls;
    commands.cls = commands.clear;
    commands.email = commands.contact;

    function run(raw) {
      line(prompt().concat([[raw]]));
      var text = raw.trim();
      if (!text) return;
      history.push(text);
      historyAt = history.length;
      var words = text.split(/\s+/);
      var name = words[0].toLowerCase();
      var arg = words.slice(1).join(" ").toLowerCase();
      if (Object.prototype.hasOwnProperty.call(commands, name)) commands[name](arg);
      else line([["command not found: " + words[0] + ". type ", "t-err"], ["help", "t-ok"]]);
    }

    function complete() {
      var parts = input.value.split(" ");
      var last = parts[parts.length - 1].toLowerCase();
      var pool = parts.length > 1 ? apps.map(function (a) { return a.id; }) : Object.keys(commands);
      var hits = pool.filter(function (c) { return c.indexOf(last) === 0; });
      if (hits.length === 1) {
        parts[parts.length - 1] = hits[0];
        input.value = parts.join(" ") + (parts.length === 1 ? " " : "");
      } else if (hits.length > 1) {
        line(prompt().concat([[input.value]]));
        say(hits.join("   "), "t-dim");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      run(input.value);
      input.value = "";
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" && history.length) {
        e.preventDefault();
        historyAt = Math.max(0, historyAt - 1);
        input.value = history[historyAt];
      } else if (e.key === "ArrowDown" && history.length) {
        e.preventDefault();
        historyAt = Math.min(history.length, historyAt + 1);
        input.value = history[historyAt] || "";
      } else if (e.key === "Tab" && input.value) {
        // Only capture Tab when there's something to complete, so keyboard
        // users can still tab past the terminal.
        e.preventDefault();
        complete();
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        commands.clear();
      } else if (e.key === "Escape") {
        input.blur();
      }
    });

    body.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      if (String(window.getSelection())) return;
      finishBoot();
      input.focus({ preventScroll: true });
    });

    // Boot: "type" `ls apps/`, print the list, then hand over the prompt.
    function boot() {
      var cmd = "ls apps/";
      var row = line(prompt());
      var typed = document.createElement("span");
      row.appendChild(typed);
      form.hidden = true;

      finishBoot = function () {
        if (booted) return;
        booted = true;
        typed.textContent = cmd;
        commands.ls();
        line([["# type ", "t-dim"], ["help", "t-ok"], [" for commands, or try ", "t-dim"], ["open lto", "t-ok"]]);
        form.hidden = false;
        body.scrollTop = body.scrollHeight;
      };

      if (reduceMotion) return finishBoot();
      var i = 0;
      (function step() {
        if (booted) return;
        typed.textContent = cmd.slice(0, ++i);
        if (i < cmd.length) setTimeout(step, 65 + Math.random() * 70);
        else setTimeout(finishBoot, 320);
      })();
    }

    appsReady
      .then(function (list) { apps = list; })
      .catch(function () {})
      .then(function () { setTimeout(boot, reduceMotion ? 0 : 650); });
  }

  /* Go --------------------------------------------------------------------- */

  initTheme();
  initNav();
  initKbdHints();
  initCopyButtons();
  initAppTiles();
  initAppLinks();
  initSpotlight();
  initClock();
  initPalette();
  initTerminal();

  try {
    console.log(
      "%c>_ AYMorato Apps",
      "color:#3DDC84;font:700 14px monospace",
      "\nHand-written HTML, CSS and vanilla JS. No framework, no build step.\nSay hi: " + EMAIL
    );
  } catch (e) {}
})();

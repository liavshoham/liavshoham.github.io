// ============================================================
// ליאב שוהם — APP.JS
// Renderiza automaticamente o último lançamento e a grade de
// singles a partir de js/songs.js — nunca editem este arquivo
// para adicionar uma música nova, apenas o songs.js.
// ============================================================

(function () {
  "use strict";

  /* ---------- Utilitários do YouTube ---------- */

  function getYoutubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      if (u.searchParams.get("v")) {
        return u.searchParams.get("v");
      }
      const parts = u.pathname.split("/");
      return parts[parts.length - 1];
    } catch (e) {
      return "";
    }
  }

  function thumbUrl(id) {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }

  function embedUrl(id) {
    return `https://www.youtube.com/embed/${id}?rel=0`;
  }

  /* ---------- Renderização do lançamento mais recente ---------- */

  function renderLatest(song) {
    const id = getYoutubeId(song.youtube);

    document.getElementById("latest-cover").src = thumbUrl(id);
    document.getElementById("latest-cover").alt = song.title;
    document.getElementById("latest-title").textContent = song.title;
    document.getElementById("latest-date").textContent = song.date || "";
    document.getElementById("latest-watch").href = song.youtube;

    const playerWrap = document.getElementById("latest-player");
    playerWrap.innerHTML = `<iframe
        src="${embedUrl(id)}"
        title="${song.title}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
  }

  /* ---------- Renderização da grade de singles ---------- */

  function renderGrid(songList) {
    const grid = document.getElementById("songs-grid");
    grid.innerHTML = "";

    songList.forEach((song) => {
      const id = getYoutubeId(song.youtube);

      const card = document.createElement("a");
      card.className = "song-card reveal";
      card.href = song.youtube;
      card.target = "_blank";
      card.rel = "noopener";

      card.innerHTML = `
        <div class="song-card__thumb">
          <img src="${thumbUrl(id)}" alt="${song.title}" loading="lazy">
          <div class="song-card__play"><span>▶</span></div>
        </div>
        <div class="song-card__body">
          <div class="song-card__title">${song.title}</div>
          <div class="song-card__date">${song.date || ""}</div>
          <div class="song-card__link">צפו ביוטיוב ←</div>
        </div>`;

      grid.appendChild(card);
    });

    observeReveal();
  }

  /* ---------- Animações de revelação ao rolar ---------- */

  function observeReveal() {
    const items = document.querySelectorAll(".reveal:not(.is-visible)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Nav com fundo ao rolar ---------- */

  function setupNav() {
    const nav = document.getElementById("site-nav");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    });
  }

  /* ---------- Inicialização ---------- */

  function init() {
    if (typeof songs === "undefined" || !songs.length) {
      console.warn("Nenhum dado encontrado em songs.js");
      return;
    }

    renderLatest(songs[0]);
    renderGrid(songs);
    setupNav();
    observeReveal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

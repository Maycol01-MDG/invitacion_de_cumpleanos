/* ============================================================
   INVITACIÓN DE CUMPLEAÑOS — script.js
   ============================================================ */

const CONFIG = {
  // Fecha exacta: 19 de Julio del 2026, 4:00 PM
  birthdayDate: "2026-07-19T16:00:00",
  // Número de WhatsApp (Código país + número sin espacios)
  whatsappPhone: "51963316629",
  appsScriptUrl: "PEGA_AQUÍ_LA_URL_DE_TU_APPS_SCRIPT",
  driveFolderId: "PEGA_AQUÍ_EL_ID_DE_TU_CARPETA",
};

/* ─── AUDIO CONTROL ──────────────────────────────────────── */
(function initAudio() {
  const music = document.getElementById("bg-music");
  const btnMusic = document.getElementById("btn-music");
  const musicIcon = document.getElementById("music-icon");
  
  let isPlaying = false;

  btnMusic.addEventListener("click", () => {
    if (isPlaying) {
      music.pause();
      musicIcon.classList.remove("fa-music");
      musicIcon.classList.add("fa-volume-xmark");
    } else {
      music.play().catch(e => console.log("Interacción requerida para reproducir audio"));
      musicIcon.classList.remove("fa-volume-xmark");
      musicIcon.classList.add("fa-music");
    }
    isPlaying = !isPlaying;
  });
})();

/* ─── EFECTO MÁQUINA DE ESCRIBIR ────────────────────────── */
(function initTypewriter() {
  const text = "Cada cumpleaños es un nuevo capítulo lleno de alegría, sueños y momentos inolvidables. Queremos que seas parte de este día tan especial.";
  const container = document.getElementById("typewriter-text");
  let index = 0;

  function type() {
    if (index < text.length) {
      container.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, 35); // Velocidad de escritura
    }
  }
  
  // Iniciar al cargar (o con un pequeño delay)
  setTimeout(type, 800);
})();

/* ─── CONFETI ────────────────────────────────────────────── */
(function initConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, pieces = [];
  const COLORS = ["#C9A84C","#E8C96A","#FF6B9D","#FFB3CB","#FFFFFF","#A8D8EA"];
  const COUNT = 140;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function Piece() {
    this.reset = function() {
      this.x = Math.random() * W; this.y = -20;
      this.w = Math.random() * 10 + 5; this.h = Math.random() * 5 + 3;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.speed = Math.random() * 2.5 + 1; this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - .5) * .15; this.drift = (Math.random() - .5) * 1.2;
    };
    this.reset();
  }

  function update() {
    ctx.clearRect(0, 0, W, H);
    pieces.forEach(p => {
      p.y += p.speed; p.x += p.drift; p.angle += p.spin;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.fillStyle = p.color; ctx.globalAlpha = .85;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      if (p.y > H + 20) p.reset();
    });
  }

  let startTime = null;
  const DURATION = 8000;

  function loop(ts) {
    if (!startTime) startTime = ts; update();
    if (ts - startTime < DURATION) { requestAnimationFrame(loop); } 
    else { ctx.clearRect(0, 0, W, H); }
  }

  window.addEventListener("resize", resize); resize();
  for (let i = 0; i < COUNT; i++) {
    const p = new Piece(); p.y = Math.random() * H; pieces.push(p);
  }
  requestAnimationFrame(loop);
})();

/* ─── PARTÍCULAS FONDO ──────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div"); p.className = "particle";
    const size = Math.random() * 80 + 20; const x = Math.random() * 100; const y = Math.random() * 100;
    const hue = ["rgba(201,168,76,", "rgba(255,107,157,", "rgba(255,179,203,"][Math.floor(Math.random() * 3)];
    p.style.cssText = `width:${size}px; height:${size}px; left:${x}%; top:${y}%; background: radial-gradient(circle, ${hue}.25) 0%, ${hue}0) 70%); animation-duration:${Math.random() * 8 + 5}s; animation-delay:${Math.random() * 6}s;`;
    container.appendChild(p);
  }
})();

document.getElementById("btn-ver").addEventListener("click", e => {
  e.preventDefault(); document.querySelector("#cuenta-regresiva").scrollIntoView({ behavior: "smooth" });
});

/* ─── CUENTA REGRESIVA ──────────────────────────────────── */
(function initCountdown() {
  const target = new Date(CONFIG.birthdayDate).getTime();
  const elements = {
    days: document.getElementById("days"), hours: document.getElementById("hours"),
    mins: document.getElementById("minutes"), secs: document.getElementById("seconds")
  };
  const countEl = document.getElementById("countdown");
  const msgEl = document.getElementById("birthday-msg");

  function animateDigit(el, value) {
    const padded = String(value).padStart(2, "0");
    if (el.textContent !== padded) {
      el.style.animation = "none"; void el.offsetWidth;
      el.style.animation = "countFlip .35s ease"; el.textContent = padded;
    }
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      countEl.classList.add("hidden"); msgEl.classList.remove("hidden"); return;
    }
    animateDigit(elements.days, Math.floor(diff / 86400000));
    animateDigit(elements.hours, Math.floor((diff % 86400000) / 3600000));
    animateDigit(elements.mins, Math.floor((diff % 3600000) / 60000));
    animateDigit(elements.secs, Math.floor((diff % 60000) / 1000));
  }
  tick(); setInterval(tick, 1000);
})();

/* ─── FADE-IN SCROLL ────────────────────────────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".fade-in-section").forEach(s => observer.observe(s));
})();

/* ─── CARRUSEL AUTOMÁTICO ───────────────────────────────── */
(function initAutoCarousel() {
  const track = document.getElementById("auto-carousel");
  if (!track) return;
  
  let scrollAmount = 0;
  const speed = 1.5; // Ajusta velocidad
  
  function autoScroll() {
    scrollAmount += speed;
    if (scrollAmount >= track.scrollWidth - track.clientWidth) {
      scrollAmount = 0; // Vuelve al inicio
    }
    track.scrollTo({ left: scrollAmount, behavior: "auto" });
  }
  
  let scrollInterval = setInterval(autoScroll, 30);
  
  // Pausa el carrusel si el usuario interactúa
  track.addEventListener("touchstart", () => clearInterval(scrollInterval));
  track.addEventListener("touchend", () => {
    scrollAmount = track.scrollLeft;
    scrollInterval = setInterval(autoScroll, 30);
  });
})();

/* ─── LIGHTBOX GALERÍA ──────────────────────────────────── */
(function initLightbox() {
  const lightbox = document.getElementById("lightbox"), lightboxImg = document.getElementById("lightbox-img");
  document.addEventListener("click", e => {
    const card = e.target.closest(".gallery-card");
    if (card && card.querySelector("img")) {
      lightboxImg.src = card.querySelector("img").src;
      lightbox.classList.remove("hidden"); document.body.style.overflow = "hidden";
    }
  });
  function closeLB() { lightbox.classList.add("hidden"); document.body.style.overflow = ""; }
  document.getElementById("lightbox-close").addEventListener("click", closeLB);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLB(); });
})();

/* ─── SUBIDA DRIVE (Manteniendo lógica original) ────────── */
(function initUpload() {
  const btnUpload = document.getElementById("btn-upload"), fileInput = document.getElementById("file-input");
  const progressWrap = document.getElementById("upload-progress-wrapper"), progressBar = document.getElementById("progress-bar-fill");
  const statusText = document.getElementById("upload-status"), gallery = document.getElementById("uploaded-gallery");

  btnUpload.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async function() {
    if (!this.files.length) return;
    if (CONFIG.appsScriptUrl === "PEGA_AQUÍ_LA_URL_DE_TU_APPS_SCRIPT") { alert("⚠️ Configura la URL de Apps Script"); return; }
    
    progressWrap.classList.remove("hidden"); btnUpload.disabled = true;
    let uploaded = 0;
    
    for (const file of this.files) {
      statusText.textContent = `Subiendo ${file.name} (${uploaded + 1}/${this.files.length})…`;
      try {
        const url = await uploadToDrive(file);
        const card = document.createElement("div"); card.className = "gallery-card";
        card.innerHTML = `<img src="${url}" loading="lazy" /><div class="gallery-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i></div>`;
        gallery.prepend(card);
      } catch (err) { statusText.textContent = `❌ Error con ${file.name}`; }
      uploaded++; progressBar.style.width = ((uploaded / this.files.length) * 100) + "%";
    }
    statusText.textContent = `✅ ¡${uploaded} fotos subidas!`; btnUpload.disabled = false; fileInput.value = "";
    setTimeout(() => { progressWrap.classList.add("hidden"); progressBar.style.width = "0%"; }, 3000);
  });

  function uploadToDrive(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async e => {
        const formData = new FormData();
        formData.append("data", e.target.result.split(",")[1]); formData.append("mimeType", file.type); formData.append("filename", file.name);
        try {
          const res = await fetch(CONFIG.appsScriptUrl, { method: "POST", body: formData });
          const json = await res.json(); json.success ? resolve(json.url) : reject("Error");
        } catch (err) { reject(err); }
      };
      reader.onerror = reject; reader.readAsDataURL(file);
    });
  }
})();

/* ─── RSVP POR WHATSAPP ─────────────────────────────────── */
(function initRsvp() {
  document.getElementById("btn-rsvp").addEventListener("click", function() {
    const name = document.getElementById("rsvp-name").value.trim();
    const guests = document.getElementById("rsvp-guests").value.trim();
    const message = document.getElementById("rsvp-message").value.trim();

    if (!name) { return highlightEmpty("rsvp-name"); }
    if (!guests || guests < 1) { return highlightEmpty("rsvp-guests"); }

    const text = `Hola.\n\nQuiero confirmar mi asistencia al cumpleaños de Laly Samara Mahelet Coronado Mondragón.\n\nNombre:\n${name}\n\nAsistiremos:\n${guests}\n\nMensaje:\n${message || '¡Ahí estaremos!'}\n\n¡Nos vemos el 19 de julio!`;
    const encodedText = encodeURIComponent(text);
    
    // Abre WhatsApp
    window.open(`https://wa.me/${CONFIG.whatsappPhone}?text=${encodedText}`, "_blank");

    document.getElementById("rsvp-form-wrapper").classList.add("hidden");
    document.getElementById("rsvp-success").classList.remove("hidden");
  });

  function highlightEmpty(id) {
    const el = document.getElementById(id);
    el.style.borderColor = "#FF6B9D"; el.focus();
    el.addEventListener("input", () => el.style.borderColor = "", { once: true });
  }
})();




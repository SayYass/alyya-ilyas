// --------------------
// INTRO AMPLOP
// --------------------
const intro = document.getElementById("intro-envelope");
let introActive = true;

if (intro) {
  intro.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    intro.classList.add("open");

    setTimeout(() => {
      const openEnv = intro.querySelector(".envelope.open");
      const openText = intro.querySelector(".open-text");
      const yth = intro.querySelector(".yth");
      const ythtitle = intro.querySelector(".yth-title");
      const btnPrev = intro.querySelector(".btn-prev");
      const btnNext = intro.querySelector(".btn-next");
      if (openEnv) openEnv.style.opacity = "1";
      if (openText) openText.classList.add("hide");
      if (yth) yth.classList.add("hide");
      if (ythtitle) ythtitle.classList.add("hide");
      if (btnPrev) btnPrev.classList.add("hide");
      if (btnNext) btnNext.classList.add("hide");
    }, 800);

    setTimeout(() => {
      const openEnv = intro.querySelector(".envelope.open");
      if (openEnv) openEnv.classList.add("zoom-out");
    }, 1200);

    setTimeout(() => {
      intro.style.opacity = "0";
      setTimeout(() => {
        intro.style.display = "none";
        introActive = false;
        goToSection(0);
      }, 800);
    }, 2500);
  });
}

// --------------------
// DASAR SECTION
// --------------------
const container = document.getElementById("sections");
const sections = document.querySelectorAll(".section");
let currentSection = 0;
const loop = false;

const bird = document.getElementById("bird-anim");
const birdStatic = document.querySelector(".burung-static");
if (birdStatic) birdStatic.style.display = "none";

if (sections[0]) sections[0].classList.add("active");

// --------------------
// FLAG TRANSISI
// --------------------
let isTransitioning = false;
function lockTransition() { isTransitioning = true; }
function unlockTransition() { isTransitioning = false; }

// --------------------
// FUNGSI PINDAH SECTION
// --------------------
function changeSection(index) {
  sections.forEach(sec => sec.classList.remove("active"));
  currentSection = index;
  sections[currentSection].classList.add("active");

  if (sections[currentSection] === section5) {
    revealItems.forEach(item => item?.classList.remove("show"));
    autoRevealSection5();
  }

  if (sections[currentSection] === section4) {
    revealItems4.forEach(item => item?.classList.remove("show"));
    autoRevealSection4();
  }

  console.log("Change section ->", currentSection);
}

// --------------------
// ANIMASI BURUNG (section 1 → 2)
// --------------------
function playBirdTransition(callback) {
  bird.classList.remove("enter", "exit");
  bird.style.display = "block";
  bird.classList.add("enter");

  function onAnimEnd(e) {
    if (e.animationName === "birdEnter") {
      bird.classList.remove("enter");
      bird.classList.add("exit");
    } else if (e.animationName === "birdExit") {
      bird.classList.remove("exit");
      bird.style.display = "none";
      bird.removeEventListener("animationend", onAnimEnd);
      if (typeof callback === "function") callback();
    }
  }

  bird.addEventListener("animationend", onAnimEnd);
}

// --------------------
// LOGIC NAVIGASI
// --------------------
function goToSection(index) {
  if (introActive || isTransitioning) return;
  const len = sections.length;
  if (index < 0) index = loop ? len - 1 : 0;
  else if (index >= len) index = loop ? 0 : len - 1;
  if (index === currentSection) return;

  lockTransition();

  if (currentSection === 0 && index === 1) {
    // 1 -> 2 burung
    sections[currentSection].classList.remove("active");
    playBirdTransition(() => {
      changeSection(index);
      if (birdStatic) birdStatic.style.display = "block";
      unlockTransition();
    });

  } else if (currentSection === 2 && index === 3) {
    // 3 -> 4
    const sec3 = sections[currentSection];
    const sec4 = sections[index];

    sec3.classList.add("anim-out-left");
    sec4.classList.add("active", "anim-in-right");

    sec3.addEventListener("animationend", () => {
      sec3.classList.remove("active", "anim-out-left");
    }, { once: true });

    sec4.addEventListener("animationend", () => {
      sec4.classList.remove("anim-in-right");
      currentSection = index;
      // 🔒 kunci sampai semua elemen section4 muncul
      autoRevealSection4();
    }, { once: true });

  } else if (currentSection === 3 && index === 4) {
    // 4 -> 5
    const sec4 = sections[currentSection];
    const sec5 = sections[index];
    const door = sec4.querySelector(".home");

    if (door) {
      const rect = door.getBoundingClientRect();
      const secRect = sec4.getBoundingClientRect();
      const originX = ((rect.left + rect.width / 2) - secRect.left) / secRect.width * 100;
      const originY = ((rect.top + rect.height / 2) - secRect.top) / secRect.height * 100;
      sec4.style.transformOrigin = `${originX}% ${originY}%`;
    }

    sec4.classList.add("zoom-into-door");

    sec4.addEventListener("animationend", () => {
      sec4.classList.remove("active", "zoom-into-door");
      sec5.classList.add("active", "anim-in");
      sec5.addEventListener("animationend", () => {
        sec5.classList.remove("anim-in");
        currentSection = index;
        revealItems.forEach(item => item?.classList.remove("show"));
        autoRevealSection5(() => unlockTransition());
      }, { once: true });
    }, { once: true });

  } else if (currentSection === 4 && index === 3) {
    // 5 -> 4
    const sec5 = sections[currentSection];
    const sec4 = sections[index];
    const door = sec4.querySelector(".home");

    if (door) {
      const rect = door.getBoundingClientRect();
      const secRect = sec4.getBoundingClientRect();
      const originX = ((rect.left + rect.width / 2) - secRect.left) / secRect.width * 100;
      const originY = ((rect.top + rect.height / 2) - secRect.top) / secRect.height * 100;
      sec5.style.transformOrigin = `${originX}% ${originY}%`;
    }

    autoHideSection5(() => {
      sec5.classList.add("zoom-out-from-door");
      sec5.addEventListener("animationend", () => {
        sec5.classList.remove("active", "zoom-out-from-door");
        sec4.classList.add("active", "anim-in");
        sec4.addEventListener("animationend", () => {
          sec4.classList.remove("anim-in");
          currentSection = index;
          autoRevealSection4(); // tunggu section4 masuk semua
        }, { once: true });
      }, { once: true });
    });

  } else {
    // default
    changeSection(index);
    setTimeout(() => unlockTransition(), 800);
  }
}

// --------------------
// POINTER HANDLER
// --------------------
let pointerStartX = null, pointerStartY = null;

function onPointerDown(e) {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  if (e.target.closest("input, textarea, button, form, .maps")) return;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
}

function onPointerUp(e) {
  if (introActive || isTransitioning) return;
  if (e.target.closest("input, textarea, button, form, .maps")) return;

  if (pointerStartX === null) return;
  const dx = e.clientX - pointerStartX;
  const dy = e.clientY - pointerStartY;
  if (Math.hypot(dx, dy) > 20) { pointerStartX = pointerStartY = null; return; }

  const screenWidth = window.innerWidth;
  if (e.clientX > screenWidth / 2) goToSection(currentSection + 1);
  else goToSection(currentSection - 1);

  pointerStartX = pointerStartY = null;
}

if (window.PointerEvent) {
  document.documentElement.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.documentElement.addEventListener("pointerup", onPointerUp, { passive: true });
}

// --------------------
// COUNTDOWN
// --------------------
const targetDate = new Date("2025-10-18T00:01:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    document.getElementById("countdown").innerHTML = "<p>Tiba di hari acara 🎉</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days.toString().padStart(2, "0");
  document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
  document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
  document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --------------------
// SECTION 4 AUTO REVEAL
// --------------------
const section4 = document.querySelector(".section4");
let revealItems4 = [];

if (section4) {
  revealItems4 = [
    section4.querySelector(".title-surah"),
    section4.querySelector(".quote-arab"),
    section4.querySelector(".quote-indo"),
    section4.querySelector(".home"),
    section4.querySelector(".cat"),
  ].filter(Boolean);
}

function autoRevealSection4() {
  if (!section4.classList.contains("active")) return;
  lockTransition();
  revealItems4.forEach((item, i) => {
    if (item) {
      setTimeout(() => {
        item.classList.add("show");
        if (i === revealItems4.length - 1) {
          unlockTransition();
        }
      }, i * 1000);
    }
  });
}

// --------------------
// SECTION 5 AUTO REVEAL & HIDE
// --------------------
const section5 = document.querySelector(".section5");
let revealItems = [];

if (section5) {
  revealItems = [
    section5.querySelector(".bird"),
    section5.querySelector(".ilyas"),
    section5.querySelector(".mempelai-pria"),
    section5.querySelector(".alyya"),
    section5.querySelector(".mempelai-wanita"),
    section5.querySelector(".love-logo"),
  ].filter(Boolean);
}

function autoRevealSection5(callback) {
  if (!section5.classList.contains("active")) return;
  lockTransition();
  revealItems.forEach((item, i) => {
    if (item) {
      setTimeout(() => {
        item.classList.add("show");
        if (i === revealItems.length - 1) {
          unlockTransition();
          if (typeof callback === "function") callback();
        }
      }, i * 1200);
    }
  });
}

function autoHideSection5(callback) {
  if (!section5.classList.contains("active")) {
    if (typeof callback === "function") callback();
    return;
  }
  revealItems.forEach((item, i) => {
    if (item) {
      setTimeout(() => {
        item.classList.remove("show");
        if (i === revealItems.length - 1 && typeof callback === "function") {
          callback();
        }
      }, i * 300);
    }
  });
}

// --------------------
// SECTION 8 PESAN & KESAN (Firebase)
// --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,               // ✅ tambahkan ini!
  onChildAdded,
  query,
  orderByChild,
  limitToLast
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHf9CJf8pIEyQCMQWKpi2JfQI_7daUkBA",
  authDomain: "wedding-3b59b.firebaseapp.com",
  databaseURL: "https://wedding-3b59b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "wedding-3b59b",
  storageBucket: "wedding-3b59b.firebasestorage.app",
  messagingSenderId: "462669784215",
  appId: "1:462669784215:web:636b91a06b2f1e108335d2",
  measurementId: "G-P3E04B52WH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("pesanForm");
const pesanList = document.getElementById("pesanList");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const pesan = document.getElementById("pesan").value.trim();
    if (!nama || !pesan) return;

    const newRef = push(ref(db, "pesan"));
    set(newRef, { nama, pesan, timestamp: Date.now() }).then(() => {
      form.reset();
    });
  });

  const pesanRef = query(ref(db, "pesan"), orderByChild("timestamp"), limitToLast(50));
  onChildAdded(pesanRef, (snapshot) => {
    const data = snapshot.val();
    const item = document.createElement("div");
    item.classList.add("pesan-item");
    item.innerHTML = `
      <h4 class="nama">${data.nama}</h4>
      <p class="isi">${data.pesan}</p>
    `;
    pesanList.prepend(item);
  });
}

// --------------------
// SECTION 9 TALI KASIH (Copy Rekening)
// --------------------
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const text = document.getElementById(targetId).innerText;

    navigator.clipboard.writeText(text).then(() => {
      btn.innerText = "Tersalin ✔";
      setTimeout(() => btn.innerText = "Salin", 2000);
    });
  });
});

// --------------------
// MUSIC CONTROL
// --------------------
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.innerText = "🔇";
  } else {
    music.pause();
    musicBtn.innerText = "🎵";
  }
});

if (intro) {
  intro.addEventListener("click", () => {
    music.play().catch(err => console.log("Autoplay dicegah:", err));
    musicBtn.innerText = "🔇";
  }, { once: true });
}

// --------------------
// NAMA UNDANGAN DARI URL
// --------------------
function getNamaFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("nama");
}

const namaUndanganEl = document.getElementById("nama-undangan");
const nama = getNamaFromURL();

if (namaUndanganEl) {
  if (nama) {
    namaUndanganEl.textContent = `${nama}`;
  } else {
    namaUndanganEl.textContent = "Tamu Undangan";
  }
}


// --------------------
// SECTION 10 KONFIRMASI KEHADIRAN
// --------------------
const btnHadir = document.querySelectorAll(".btn-hadir");
const statusEl = document.getElementById("hadir-status");

btnHadir.forEach(btn => {
  btn.addEventListener("click", async () => {
    const nama = getNamaFromURL() || "Tamu Undangan";
    const kehadiran = btn.getAttribute("data-status");
    const kehadiranRef = ref(db, "kehadiran");

    try {
      // 🔍 Cari apakah nama sudah pernah mengirim kehadiran
      const snapshot = await get(kehadiranRef);

      let existingKey = null;
      snapshot.forEach(child => {
        const data = child.val();
        if (data.nama === nama) {
          existingKey = child.key;
        }
      });

      if (existingKey) {
        // 📝 Update data lama
        await set(ref(db, `kehadiran/${existingKey}`), {
          nama,
          kehadiran,
          timestamp: Date.now()
        });
        statusEl.textContent = `✅ Konfirmasi diperbarui: ${kehadiran}`;
      } else {
        // ➕ Tambah baru
        const newRef = push(kehadiranRef);
        await set(newRef, {
          nama,
          kehadiran,
          timestamp: Date.now()
        });
        statusEl.textContent = `❤️ Terima kasih ${nama}, konfirmasi "${kehadiran}" telah dikirim!`;
      }

      btnHadir.forEach(b => b.disabled = false); // tetap bisa klik kalau berubah pikiran
    } catch (err) {
      console.error("❌ Gagal kirim konfirmasi:", err);
      statusEl.textContent = "⚠️ Gagal mengirim, coba lagi nanti.";
    }
  });
});

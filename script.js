// --------------------
// INTRO AMPLOP
// --------------------
const intro = document.getElementById("intro-envelope");
let introActive = true; // 🚀 kunci navigasi selama intro

if (intro) {
  intro.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Step 1: jalankan flipOut pada envelope tertutup
    intro.classList.add("open");

    // Step 2: setelah 800ms, tampilkan envelope terbuka
    setTimeout(() => {
      const openEnv = intro.querySelector(".envelope.open");
      const openText = intro.querySelector(".open-text");
      if (openEnv) openEnv.style.opacity = "1"; // tampil dulu
      if (openText) openText.classList.add("hide");
    }, 800);

    // Step 3: setelah envelope terbuka tampil, jalankan zoomOut
    setTimeout(() => {
      const openEnv = intro.querySelector(".envelope.open");
      if (openEnv) openEnv.classList.add("zoom-out");
    }, 1200);

    // Step 4: setelah zoomOut selesai, sembunyikan intro
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

// burung animasi & statis
const bird = document.getElementById("bird-anim");
const birdStatic = document.querySelector(".burung-static");
if (birdStatic) birdStatic.style.display = "none";

// tampilkan section pertama (sementara nonaktif karena intro yang handle)
if (sections[0]) sections[0].classList.add("active");

// --------------------
// FUNGSI PINDAH SECTION
// --------------------
function changeSection(index) {
  sections.forEach(sec => sec.classList.remove("active"));
  currentSection = index;
  sections[currentSection].classList.add("active");

  // kalau masuk section 5, auto reveal
  if (sections[currentSection] === section5) {
    revealItems.forEach(item => item?.classList.remove("show"));
    autoRevealSection5();
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
  const len = sections.length;
  if (index < 0) index = loop ? len - 1 : 0;
  else if (index >= len) index = loop ? 0 : len - 1;
  if (index === currentSection) return;

  // jika transisi 1 -> 2, mainkan animasi burung
  if (currentSection === 0 && index === 1) {
    sections[currentSection].classList.remove("active");

    playBirdTransition(() => {
      changeSection(index);
      if (birdStatic) birdStatic.style.display = "block";
    });
  }
  // transisi khusus 3 -> 4
  else if (currentSection === 2 && index === 3) {
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
    }, { once: true });
  }
  // transisi khusus 4 -> 3
  else if (currentSection === 3 && index === 2) {
    const sec4 = sections[currentSection];
    const sec3 = sections[index];

    sec4.classList.add("anim-out-right");
    sec3.classList.add("active", "anim-in-left");

    sec4.addEventListener("animationend", () => {
      sec4.classList.remove("active", "anim-out-right");
    }, { once: true });

    sec3.addEventListener("animationend", () => {
      sec3.classList.remove("anim-in-left");
      currentSection = index;
    }, { once: true });
  }
  // transisi khusus 4 -> 5 (zoom pintu)
  else if (currentSection === 3 && index === 4) {
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

      // tampilkan section 5 dengan animasi masuk
      sec5.classList.add("active", "anim-in");

      sec5.addEventListener("animationend", () => {
        sec5.classList.remove("anim-in");
        currentSection = index;

        // pastikan reveal item jalan
        revealItems.forEach(item => item?.classList.remove("show"));
        autoRevealSection5();
      }, { once: true });
    }, { once: true });
  }
  // transisi biasa
  else {
    setTimeout(() => changeSection(index), 800); // sesuai fade CSS
  }
}

// --------------------
// POINTER HANDLER
// --------------------
let pointerStartX = null, pointerStartY = null;

function onPointerDown(e) {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
}

function onPointerUp(e) {
  if (introActive) return; // 🚫 blokir navigasi saat intro

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
const targetDate = new Date("2025-10-18T12:15:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    document.getElementById("countdown").innerHTML = "<p>Acara sudah dimulai 🎉</p>";
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
// SECTION 5 AUTO REVEAL
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

function autoRevealSection5() {
  if (!section5.classList.contains("active")) return;

  revealItems.forEach((item, i) => {
    if (item) {
      setTimeout(() => {
        item.classList.add("show");
      }, i * 1200);
    }
  });
}

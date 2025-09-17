const container = document.getElementById("sections"); 
const sections = document.querySelectorAll(".section");
let currentSection = 0;
const loop = false; 

// burung animasi & statis
const bird = document.getElementById("bird-anim"); 
const birdStatic = document.querySelector(".burung-static");
if (birdStatic) birdStatic.style.display = "none";

// tampilkan section pertama
sections[0].classList.add("active");
console.log("Init: section 0 aktif");

// fungsi pindah section
function changeSection(index) {
  console.log("Change section from", currentSection, "to", index);

  // pastikan semua section non-aktif dulu
  sections.forEach(sec => sec.classList.remove("active"));

  // update index & aktifkan section target
  currentSection = index;
  sections[currentSection].classList.add("active");

  console.log("Section", currentSection, "should now be active");
}

// animasi burung
function playBirdTransition(callback) {
  bird.classList.remove("enter", "exit");
  bird.style.display = "block";
  bird.classList.add("enter");
  console.log("Burung animasi: ENTER mulai");

  function onAnimEnd(e) {
    if (e.animationName === "birdEnter") {
      console.log("Burung animasi: ENTER selesai, lanjut EXIT");
      bird.classList.remove("enter");
      bird.classList.add("exit");
    } else if (e.animationName === "birdExit") {
      console.log("Burung animasi: EXIT selesai, burung hilang");
      bird.classList.remove("exit");
      bird.style.display = "none";
      bird.removeEventListener("animationend", onAnimEnd);

      if (typeof callback === "function") {
        console.log("Panggil callback setelah burung exit");
        callback();
      }
    }
  }

  bird.addEventListener("animationend", onAnimEnd);
}

// logic navigasi
function goToSection(index) {
  const len = sections.length;
  if (index < 0) index = loop ? len - 1 : 0;
  else if (index >= len) index = loop ? 0 : len - 1;
  if (index === currentSection) return;

  console.log("GoToSection:", currentSection, "->", index);

  // hapus dulu active dari section sekarang (fade out)
  sections[currentSection].classList.remove("active");

  // jika transisi 1 -> 2, mainkan animasi burung
  if (currentSection === 0 && index === 1) {
    console.log("Transisi khusus 1 -> 2: burung animasi");
    playBirdTransition(() => {
      changeSection(index);
      if (birdStatic) {
        birdStatic.style.display = "block";
        console.log("Burung statis ditampilkan di section 2");
      }
    });
  } else {
    // kalau transisi biasa: tunggu sedikit setelah fade-out, lalu aktifkan target
    setTimeout(() => changeSection(index), 800); // 0.8s sesuai CSS
  }
}

// Pointer handler
let pointerStartX = null, pointerStartY = null;

function onPointerDown(e) {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
}

function onPointerUp(e) {
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

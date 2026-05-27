const gateButton = document.getElementById("openInvite");
const audio = document.getElementById("audio");
const musicButton = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");
const rsvpForm = document.getElementById("rsvpForm");
const success = document.getElementById("success");
const successName = document.getElementById("successName");

const weddingDate = new Date("2026-08-22T15:00:00+02:00");
let musicPlaying = false;
let musicTimer;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function showMusicLabel() {
  musicLabel.classList.add("show");
  window.clearTimeout(musicTimer);
  musicTimer = window.setTimeout(() => musicLabel.classList.remove("show"), 2200);
}

async function playMusic() {
  try {
    await audio.play();
    musicPlaying = true;
    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-label", "Pausar musica");
  } catch {
    musicPlaying = false;
  }
}

function pauseMusic() {
  audio.pause();
  musicPlaying = false;
  musicButton.classList.remove("playing");
  musicButton.setAttribute("aria-label", "Tocar musica");
}

gateButton.addEventListener("click", () => {
  window.scrollTo(0, 0);
  document.body.classList.add("gate-opening");
  playMusic();
  window.setTimeout(() => {
    document.body.classList.add("invite-open");
    window.scrollTo(0, 0);
  }, 850);
});

musicButton.addEventListener("click", () => {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
  showMusicLabel();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function setUnit(id, value) {
  document.getElementById(id).textContent = String(value).padStart(2, "0");
}

function updateCountdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  setUnit("days", Math.floor(diff / 86400000));
  setUnit("hours", Math.floor((diff % 86400000) / 3600000));
  setUnit("minutes", Math.floor((diff % 3600000) / 60000));
  setUnit("seconds", Math.floor((diff % 60000) / 1000));
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const phone = document.getElementById("guestPhone").value.trim();
  const guests = document.getElementById("guestCount").value;
  const confirm = document.getElementById("guestConfirm").value;
  const notes = document.getElementById("guestNotes").value.trim();

  if (!name) {
    document.getElementById("guestName").focus();
    return;
  }

  successName.textContent = name.split(" ")[0];
  rsvpForm.style.display = "none";
  success.style.display = "block";

  const message = encodeURIComponent(
    `Confirmacao de Presenca\n\nNome: ${name}\nContacto: ${phone || "-"}\nConvidados: ${guests}\nPresenca: ${confirm === "sim" ? "Confirmada" : "Nao comparece"}\nObservacoes: ${notes || "-"}`
  );

  window.open(`https://wa.me/258000000000?text=${message}`, "_blank", "noopener,noreferrer");
});

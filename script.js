// Mise à jour de l'année dans le footer
document.getElementById("year").textContent = new Date().getFullYear();

// Toast de notification
const toast = document.getElementById("toast");
function showToast(message = "Message envoyé ✅") {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Fond de particules animé
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

// Ajuste la taille du canvas à la fenêtre
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Création d'un ensemble de particules
function createParticles(count = 70) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.6 + 0.2
    });
  }
}
createParticles();

// Boucle d'animation des particules
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
    gradient.addColorStop(0, `rgba(34, 211, 238, ${p.alpha})`);
    gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
    ctx.fill();

    // Déplacement simple avec rebond sur les bords
    p.x += p.dx;
    p.y += p.dy;

    if (p.x <= 0 || p.x >= canvas.width) p.dx *= -1;
    if (p.y <= 0 || p.y >= canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

// Animation progressive des barres de compétences
const skillBars = document.querySelectorAll(".skill-bar");
const levels = {
  Java: "85%",
  Python: "80%",
  PHP: "75%",
  JavaScript: "80%",
  "HTML/CSS": "85%",
  SQL: "80%",
  RDB: "75%",
  Office: "80%",
  Hardware: "70%"
};

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const label = el.getAttribute("data-skill");
        el.style.setProperty("--level", levels[label] || "70%");
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);

skillBars.forEach(bar => observer.observe(bar));

// Gestion de l'envoi du formulaire avec Formspree (AJAX)
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        form.reset();
        status.textContent = "Merci, votre message a bien été envoyé.";
        showToast("Message envoyé ✅");
      } else {
        status.textContent = "Une erreur est survenue. Vous pouvez aussi m'écrire directement par e-mail.";
        showToast("Erreur lors de l'envoi ❌");
      }
    } catch (err) {
      status.textContent = "Impossible de contacter le service pour le moment.";
      showToast("Erreur réseau ❌");
    }
  });
}

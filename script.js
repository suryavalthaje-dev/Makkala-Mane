document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function sendWhatsApp(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const program = document.getElementById("program").value;
  const message = document.getElementById("message").value.trim();

  const text =
    `Hello Makkala Mane,%0A%0A` +
    `Parent/Guardian: ${encodeURIComponent(name)}%0A` +
    `Phone: ${encodeURIComponent(phone)}%0A` +
    `Program: ${encodeURIComponent(program)}%0A` +
    `Message: ${encodeURIComponent(message || "I would like to know more.")}`;

  window.open(`https://wa.me/919686940988?text=${text}`, "_blank", "noopener");
  return false;
}

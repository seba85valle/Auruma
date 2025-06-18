document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("navbarMenu");

  // Toggle para mostrar/ocultar menú
  toggleButton.addEventListener("click", function () {
    menu.classList.toggle("show");
  });

  // Cerrar el menú al hacer clic en cualquier enlace del menú
  const navLinks = menu.querySelectorAll("a");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
      }
    });
  });
});

function abrirSubtarjeta(event, salida, corazon, fondo) {
  event.preventDefault();
  document.getElementById('subtarjeta-salida').innerHTML = `<strong>Salida:</strong> ${salida}`;
  document.getElementById('subtarjeta-corazon').innerHTML = `<strong>Corazón:</strong> ${corazon}`;
  document.getElementById('subtarjeta-fondo').innerHTML = `<strong>Fondo:</strong> ${fondo}`;
  document.getElementById('subtarjeta-overlay').classList.remove('d-none');
}

function cerrarSubtarjeta() {
  document.getElementById('subtarjeta-overlay').classList.add('d-none');
}


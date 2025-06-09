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

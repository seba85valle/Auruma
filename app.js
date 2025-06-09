document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("navbarMenu");

  toggleButton.addEventListener("click", function () {
    menu.classList.toggle("show");
  });
});


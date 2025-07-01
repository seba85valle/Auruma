document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const contenedor = document.getElementById("productos-container");

  // === RENDERIZAR PRODUCTOS DESDE API ===
  const renderProductos = () => {
    fetch("https://dummyjson.com/products?limit=30")
      .then(res => res.json())
      .then(data => {
        // Filtramos hasta 8 productos de perfumería/beauty
        const productosFiltrados = data.products.filter(producto =>
          producto.category === "fragrances" ||
          producto.category === "beauty"
        ).slice(0, 8);

        productosFiltrados.forEach(prod => {
          // Crear card
          const card = document.createElement("div");
          card.className = "card";
          card.style.width = "16rem";

          // Imagen
          const img = document.createElement("img");
          img.src = prod.thumbnail;
          img.alt = prod.title;
          img.className = "card-img-top";

          // Body
          const body = document.createElement("div");
          body.className = "card-body d-flex flex-column";

          // Título
          const titulo = document.createElement("h5");
          titulo.className = "card-title";
          titulo.textContent = prod.title;

          // Precio
          const precio = document.createElement("p");
          precio.className = "card-text fw-bold";
          precio.textContent = `$${prod.price}`;

          // Botón agregar
          const btnAgregar = document.createElement("button");
          btnAgregar.className = "btn btn-dark mt-auto";
          btnAgregar.textContent = "Agregar al carrito";

          btnAgregar.addEventListener("click", () => {
            const productoParaCarrito = {
              id: prod.id,
              title: prod.title,
              price: prod.price,
              thumbnail: prod.thumbnail
            };
            carrito.push(productoParaCarrito);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
          });

          // Armar estructura
          body.appendChild(titulo);
          body.appendChild(precio);
          body.appendChild(btnAgregar);

          card.appendChild(img);
          card.appendChild(body);

          contenedor.appendChild(card);
        });
      })
      .catch(err => console.error("ERROR:", err));
  };

  // === ACTUALIZAR CONTADOR CARRITO ===
  const actualizarContador = () => {
    const contador = document.getElementById("cart-count");
    contador.textContent = carrito.length;
  };

  // === MENÚ HAMBURGUESA ===
  const btnMenu = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("navbarMenu");

  btnMenu.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });

  // Inicialización
  renderProductos();
  actualizarContador();
});

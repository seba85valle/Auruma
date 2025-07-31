document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("navbarMenu");

  toggleButton.addEventListener("click", function () {
    menu.classList.toggle("show");
  });

  const navLinks = menu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
      }
    });
  });

  fetch("productos.json")
    .then(res => res.json())
    .then(data => {
      renderizarProductosPorCategoria(data);
      window.productosData = data; 
    })
    .catch(err => console.error("Error al cargar productos:", err));

  actualizarBadge();

  if (document.body.classList.contains("carrito-page")) {
    renderizarCarrito();
  }
});

// ---------- PRODUCTOS ----------
function renderizarProductosPorCategoria(productos) {
  productos.forEach(p => {
    const contenedorId = {
      femenina: "productos-femeninas",
      masculina: "productos-masculinas",
      unisex: "productos-unisex",
      premium: "productos-premium"
    }[p.categoria];

    if (contenedorId) {
      const contenedor = document.getElementById(contenedorId);
      const card = document.createElement("div");
      card.className = "card";
      card.style.width = "18rem";

      card.innerHTML = `
        <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text mb-3">
            100ml<br>
            <strong>$${p.precio}</strong>
          </p>
          <div class="d-flex justify-content-between">
            <a href="#" class="btn btn-outline-dark btn-sm flex-fill me-1"
              onclick="abrirSubtarjeta(event, 
                '${p.salida}',
                '${p.corazon}',
                '${p.fondo}')">Ver detalles</a>
            <a href="#" class="btn btn-outline-dark btn-sm flex-fill ms-1"
              onclick="agregarAlCarrito('${p.id}')">Agregar al carrito</a>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    }
  });
}

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

// ---------- CARRITO ----------
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }
}

function agregarAlCarrito(idProducto) {
  const producto = (window.productosData || []).find(p => p.id === idProducto);
  if (!producto) return;

  const existe = carrito.find(p => p.id === producto.id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarBadge();
  window.location.href = "carrito.html";
}

function renderizarCarrito() {
  const tbody = document.querySelector("tbody");
  const totalElem = document.querySelector(".fs-5 strong");
  tbody.innerHTML = "";

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${item.imagen}" alt="${item.nombre}" style="height: 50px;"></td>
      <td>${item.nombre}</td>
      <td><input type="number" class="form-control cantidad-input" value="${item.cantidad}" min="1" style="width: 70px;" data-id="${item.id}"></td>
      <td>$${item.precio}</td>
      <td>$${subtotal}</td>
      <td><button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${item.id}"><i class="bi bi-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
  });

  totalElem.textContent = `Total: $${total}`;

  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("change", e => {
      const id = e.target.dataset.id;
      const nuevoValor = parseInt(e.target.value);
      const prod = carrito.find(p => p.id === id);
      if (prod && nuevoValor >= 1) {
        prod.cantidad = nuevoValor;
        guardarCarrito();
        renderizarCarrito();
        actualizarBadge();
      }
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.currentTarget.dataset.id;
      carrito = carrito.filter(p => p.id !== id);
      guardarCarrito();
      renderizarCarrito();
      actualizarBadge();
    });
  });
}

// ---------- FINALIZAR COMPRA ----------
function finalizarCompra() {
  if (carrito.length === 0) {
    // Mostrar modal si el carrito está vacío
    const vacioModal = new bootstrap.Modal(document.getElementById("carritoVacioModal"));
    vacioModal.show();

    // Limpiar backdrop si queda colgado al cerrar
    vacioModal._element.addEventListener("hidden.bs.modal", () => {
      document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    });
    return;
  }

  // Generar código aleatorio de compra
  const codigo = Math.floor(Math.random() * 900000 + 100000);
  document.getElementById("codigo-compra").textContent = codigo;

  // Rellenar ticket con los productos del carrito
  const tbody = document.getElementById("ticket-body");
  tbody.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precio}</td>
      <td>$${subtotal}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("ticket-total").textContent = total;

  // Mostrar el modal con el ticket
  const compraModal = new bootstrap.Modal(document.getElementById("compraModal"));
  compraModal.show();

  // Guardar copia del carrito 
  localStorage.setItem("carrito_backup", JSON.stringify(carrito));

  // Limpiar carrito y actualizar
  carrito = [];
  guardarCarrito();
  actualizarBadge();
  renderizarCarrito(); // Limpia visualmente la tabla
}

// ---------- IMPRIMIR TICKET ----------
function imprimirTicket() {
  const contenido = document.getElementById("ticket-content").outerHTML;
  const ventana = window.open("", "PRINT", "height=600,width=800");
  ventana.document.write(`
    <html>
    <head>
      <title>Ticket de compra</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #fff; color: #000; }
        .ticket { border: 1px solid #ccc; padding: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
        th { background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="ticket">
        ${contenido}
      </div>
    </body>
    </html>
  `);
  ventana.document.close();
  ventana.focus();
  ventana.print();
  ventana.close();
}

// ---------- DESCARGAR TICKET ----------
function descargarTicket() {
  const contenido = document.getElementById("ticket-content").outerHTML.replace(
    /<img[^>]+>/,
    '<div style="font-size:1.2em;font-weight:bold;">AURUMA Perfumes</div>'
  );

  const blob = new Blob([`
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ticket de compra</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #fff; color: #000; }
        .ticket { border: 1px solid #ccc; padding: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
        th { background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="ticket">
        ${contenido}
      </div>
    </body>
    </html>
  `], { type: "text/html" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ticket_compra_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

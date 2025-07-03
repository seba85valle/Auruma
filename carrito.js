document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Aseguramos cantidades válidas
  carrito = carrito.map(prod => ({
    ...prod,
    cantidad: prod.cantidad && prod.cantidad > 0 ? prod.cantidad : 1
  }));

  const tbody = document.querySelector("tbody");
  const totalElement = document.querySelector(".fs-5 strong");
  const ticketBody = document.getElementById("ticket-body");
  const ticketTotal = document.getElementById("ticket-total");
  const codigoCompra = document.getElementById("codigo-compra");

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderCarrito() {
    tbody.innerHTML = "";
    let total = 0;

    carrito.forEach((prod, index) => {
      const cantidadValida = prod.cantidad && prod.cantidad > 0 ? prod.cantidad : 1;
      const subtotal = prod.price * cantidadValida;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${prod.thumbnail}" alt="${prod.title}" style="height: 50px;"></td>
        <td>${prod.title}</td>
        <td>
          <input type="number" min="1" value="${cantidadValida}" class="form-control form-control-sm cantidad-input" data-index="${index}" style="width: 70px;">
        </td>
        <td>$${prod.price}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger eliminar-btn" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }

  function actualizarCantidad(index, nuevaCantidad) {
    if (nuevaCantidad > 0) {
      carrito[index].cantidad = nuevaCantidad;
      guardarCarrito();
      renderCarrito();
    }
  }

  function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderCarrito();
  }

  function vaciarCarrito() {
    if (carrito.length === 0) {
      const modal = new bootstrap.Modal(document.getElementById("carritoVacioModal"));
      modal.show();
    } else {
      carrito = [];
      guardarCarrito();
      renderCarrito();
    }
  }

  function finalizarCompra() {
    if (carrito.length === 0) {
      const modal = new bootstrap.Modal(document.getElementById("carritoVacioModal"));
      modal.show();
    } else {
      ticketBody.innerHTML = "";
      let total = 0;
      carrito.forEach(prod => {
        const subtotal = prod.price * prod.cantidad;
        total += subtotal;
        ticketBody.innerHTML += `
          <tr>
            <td>${prod.title}</td>
            <td>${prod.cantidad}</td>
            <td>$${prod.price}</td>
            <td>$${subtotal.toFixed(2)}</td>
          </tr>
        `;
      });
      ticketTotal.textContent = total.toFixed(2);
      codigoCompra.textContent = Math.floor(Math.random() * 1000000);
      const modal = new bootstrap.Modal(document.getElementById("compraModal"));
      modal.show();
      carrito = [];
      guardarCarrito();
      renderCarrito();
    }
  }

  function imprimirTicket() {
    window.print();
  }

  async function descargarTicket() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const ticket = document.getElementById("ticket-content");
    const canvas = await html2canvas(ticket);
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("ticket.pdf");
  }

  tbody.addEventListener("input", e => {
    if (e.target.classList.contains("cantidad-input")) {
      const index = e.target.dataset.index;
      const value = parseInt(e.target.value);
      if (value > 0) {
        actualizarCantidad(index, value);
      }
    }
  });

  tbody.addEventListener("click", e => {
    if (e.target.closest(".eliminar-btn")) {
      const index = e.target.closest(".eliminar-btn").dataset.index;
      eliminarProducto(index);
    }
  });

  window.vaciarCarrito = vaciarCarrito;
  window.finalizarCompra = finalizarCompra;
  window.imprimirTicket = imprimirTicket;
  window.descargarTicket = descargarTicket;

  renderCarrito();

  // MENU HAMBURGUESA
  const btnMenu = document.getElementById("menu-toggle");
  const navbarMenu = document.getElementById("navbarMenu");

  btnMenu?.addEventListener("click", () => {
    navbarMenu.classList.toggle("show");
  });
});

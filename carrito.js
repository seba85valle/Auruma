document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.map(p => ({ ...p, cantidad: p.cantidad || 1 }));

  const tbody = document.querySelector("tbody");
  const totalTexto = document.querySelector(".text-end p strong");
  const cartCount = document.getElementById("cart-count");

  const renderCarrito = () => {
    tbody.innerHTML = "";
    carrito.forEach((prod, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${prod.thumbnail}" alt="${prod.title}" style="width: 50px;"></td>
        <td>${prod.title}</td>
        <td><input type="number" min="1" value="${prod.cantidad}" data-index="${index}" class="form-control form-control-sm cantidad-input" style="width: 60px;"></td>
        <td>$${prod.price.toFixed(2)}</td>
        <td>$${(prod.price * prod.cantidad).toFixed(2)}</td>
        <td><button class="btn btn-sm btn-danger eliminar-btn" data-index="${index}"><i class="bi bi-trash"></i></button></td>
      `;
      tbody.appendChild(tr);
    });
    actualizarTotal();
    actualizarContador();
  };

  const actualizarTotal = () => {
    const total = carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0);
    totalTexto.textContent = `Total: $${total.toFixed(2)}`;
  };

  const actualizarContador = () => {
    cartCount.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  };

  tbody.addEventListener("input", e => {
    if (e.target.classList.contains("cantidad-input")) {
      const index = e.target.dataset.index;
      let nuevaCant = parseInt(e.target.value);
      if (isNaN(nuevaCant) || nuevaCant < 1) nuevaCant = 1;
      carrito[index].cantidad = nuevaCant;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    }
  });

  tbody.addEventListener("click", e => {
    if (e.target.closest(".eliminar-btn")) {
      const index = e.target.closest(".eliminar-btn").dataset.index;
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    }
  });

  window.finalizarCompra = () => {
    if (carrito.length === 0) {
      const vacioModal = new bootstrap.Modal(document.getElementById("carritoVacioModal"));
      vacioModal.show();
    } else {
      generarTicket();
      const compraModal = new bootstrap.Modal(document.getElementById("compraModal"));
      compraModal.show();
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    }
  };

  const generarTicket = () => {
    document.getElementById("codigo-compra").textContent = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticketBody = document.getElementById("ticket-body");
    ticketBody.innerHTML = "";
    carrito.forEach(p => {
      ticketBody.innerHTML += `
        <tr>
          <td>${p.title}</td>
          <td>${p.cantidad}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>$${(p.price * p.cantidad).toFixed(2)}</td>
        </tr>
      `;
    });
    const total = carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0);
    document.getElementById("ticket-total").textContent = total.toFixed(2);
  };

  window.imprimirTicket = () => {
    const content = document.getElementById("ticket-content").innerHTML;
    const w = window.open("");
    w.document.write(`<html><head><title>Ticket</title></head><body>${content}</body></html>`);
    w.document.close();
    w.print();
  };

  window.descargarTicket = () => {
    html2canvas(document.getElementById("ticket-content")).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("ticket.pdf");
    });
  };

  // === MENÚ HAMBURGUESA ===
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("navbarMenu").classList.toggle("show");
  });

  renderCarrito();
});


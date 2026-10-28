
const productos = [
  { id: 1, nombre: "Runner Pro",    precio: 1499, categoria: "running",    imagen: "runner_pro.avif" },
  { id: 2, nombre: "Urban Style",   precio: 1199, categoria: "casual",     imagen: "urban_style.jpg" },
  { id: 3, nombre: "Court King",    precio: 1899, categoria: "basquetbol", imagen: "court_king.jpg" },
  { id: 4, nombre: "Speed Air",     precio: 1699, categoria: "running",    imagen: "speed_air.jpg" },
  { id: 5, nombre: "Classic White", precio: 999,  categoria: "casual",     imagen: "classic_white.jpg" },
  { id: 6, nombre: "Jump Max",      precio: 2099, categoria: "basquetbol", imagen: "jump_max.jpg" },
  { id: 7, nombre: "Trail Runner",  precio: 1799, categoria: "running",    imagen: "trail_running.jpg" },
  { id: 8, nombre: "Street Low",    precio: 1099, categoria: "casual",     imagen: "street_low.jpg" }
];
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}
function actualizarContador() {
  const contador = document.querySelector("#contador-carrito");
  const carrito = obtenerCarrito();
  let total = 0;
  carrito.forEach(function (item) {
    total += item.cantidad;
  });
  contador.textContent = total;
}

function agregarAlCarrito(id) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) { return item.id === id; });

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  guardarCarrito(carrito);

  const producto = productos.find(function (p) { return p.id === id; });
  Swal.fire({
    icon: "success",
    title: "¡Agregado!",
    text: producto.nombre + " se agregó al carrito",
    timer: 1500,
    showConfirmButton: false
  });
}
function crearTarjeta(p) {
  return `
    <div class="col-12 col-sm-6 col-lg-3">
      <article class="card producto">
        <div class="foto">
          <img src="${p.imagen}" class="card-img-top" alt="Tenis ${p.nombre}">
        </div>
        <div class="card-body text-center">
          <h3 class="h5">${p.nombre}</h3>
          <p class="text-capitalize text-muted mb-1">${p.categoria}</p>
          <p class="precio">$${p.precio}</p>
          <button class="btn btn-naranja btn-agregar" data-id="${p.id}">
            <i class="fa-solid fa-cart-plus"></i> Agregar
          </button>
        </div>
      </article>
    </div>`;
}
function mostrarProductos(lista, contenedor) {
  contenedor.innerHTML = "";
  lista.forEach(function (p) {
    contenedor.innerHTML += crearTarjeta(p);
  });
  contenedor.querySelectorAll(".btn-agregar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      agregarAlCarrito(Number(boton.dataset.id));
    });
  });
}
const destacados = document.querySelector("#destacados");
if (destacados) {
  mostrarProductos(productos.slice(0, 4), destacados);
}
const listaProductos = document.querySelector("#lista-productos");
if (listaProductos) {
  const inputBuscar = document.querySelector("#buscar");
  const selectCategoria = document.querySelector("#filtro-categoria");
  const sinResultados = document.querySelector("#sin-resultados");

  function filtrar() {
    const texto = inputBuscar.value.toLowerCase();
    const categoria = selectCategoria.value;

    const filtrados = productos.filter(function (p) {
      const coincideNombre = p.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === "todas" || p.categoria === categoria;
      return coincideNombre && coincideCategoria;
    });

    mostrarProductos(filtrados, listaProductos);
    sinResultados.classList.toggle("d-none", filtrados.length > 0);
  }

  inputBuscar.addEventListener("input", filtrar);
  selectCategoria.addEventListener("change", filtrar);
  filtrar();
}
const cuerpoCarrito = document.querySelector("#cuerpo-carrito");
if (cuerpoCarrito) {
  function mostrarCarrito() {
    const carrito = obtenerCarrito();
    let total = 0;
    cuerpoCarrito.innerHTML = "";

    carrito.forEach(function (item) {
      const p = productos.find(function (prod) { return prod.id === item.id; });
      const subtotal = p.precio * item.cantidad;
      total += subtotal;

      cuerpoCarrito.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>$${p.precio}</td>
          <td>
            <button class="btn btn-sm btn-outline-dark btn-menos" data-id="${p.id}" aria-label="Quitar uno">-</button>
            <span class="mx-2">${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-dark btn-mas" data-id="${p.id}" aria-label="Agregar uno">+</button>
          </td>
          <td>$${subtotal}</td>
          <td><button class="btn btn-sm btn-danger btn-quitar" data-id="${p.id}" aria-label="Eliminar ${p.nombre}"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    });

    document.querySelector("#total-carrito").textContent = "$" + total;

    const vacio = carrito.length === 0;
    document.querySelector("#carrito-vacio").classList.toggle("d-none", !vacio);
    document.querySelector("#tabla-carrito").classList.toggle("d-none", vacio);
    document.querySelector("#resumen-carrito").classList.toggle("d-none", vacio);

    document.querySelectorAll(".btn-mas").forEach(function (b) {
      b.addEventListener("click", function () { cambiarCantidad(Number(b.dataset.id), 1); });
    });
    document.querySelectorAll(".btn-menos").forEach(function (b) {
      b.addEventListener("click", function () { cambiarCantidad(Number(b.dataset.id), -1); });
    });
    document.querySelectorAll(".btn-quitar").forEach(function (b) {
      b.addEventListener("click", function () { quitarProducto(Number(b.dataset.id)); });
    });
  }

  function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const item = carrito.find(function (i) { return i.id === id; });
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      quitarProducto(id);
      return;
    }
    guardarCarrito(carrito);
    mostrarCarrito();
  }

  function quitarProducto(id) {
    const carrito = obtenerCarrito().filter(function (i) { return i.id !== id; });
    guardarCarrito(carrito);
    mostrarCarrito();
  }

  document.querySelector("#btn-vaciar").addEventListener("click", function () {
    Swal.fire({
      title: "¿Vaciar el carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar"
    }).then(function (resultado) {
      if (resultado.isConfirmed) {
        guardarCarrito([]);
        mostrarCarrito();
      }
    });
  });

  document.querySelector("#btn-comprar").addEventListener("click", function () {
    Swal.fire({
      icon: "success",
      title: "¡Gracias por tu compra!",
      text: "Esta es una simulación, no se hizo ningún cobro."
    });
    guardarCarrito([]);
    mostrarCarrito();
  });

  mostrarCarrito();
}

const formulario = document.querySelector("#form-contacto");
if (formulario) {
  const selectModelo = document.querySelector("#modelo");
  productos.forEach(function (p) {
    selectModelo.innerHTML += `<option value="${p.nombre}">${p.nombre} - $${p.precio}</option>`;
  });

  const mensaje = document.querySelector("#mensaje");
  mensaje.addEventListener("input", function () {
    document.querySelector("#contador-letras").textContent = mensaje.value.length;
  });

  function validarCampo(campo) {
    if (campo.checkValidity()) {
      campo.classList.remove("is-invalid");
      campo.classList.add("is-valid");
      return true;
    } else {
      campo.classList.remove("is-valid");
      campo.classList.add("is-invalid");
      return false;
    }
  }

  formulario.querySelectorAll("input:not([type=radio]), select, textarea").forEach(function (campo) {
    campo.addEventListener("input", function () { validarCampo(campo); });
    campo.addEventListener("change", function () { validarCampo(campo); });
  });

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    let todoBien = true;

    formulario.querySelectorAll("input:not([type=radio]), select, textarea").forEach(function (campo) {
      if (!validarCampo(campo)) {
        todoBien = false;
      }
    });

    const pagoElegido = formulario.querySelector("input[name=pago]:checked");
    const errorPago = document.querySelector("#error-pago");
    errorPago.classList.toggle("d-none", pagoElegido !== null);
    if (!pagoElegido) {
      todoBien = false;
    }

    const resultado = document.querySelector("#resultado-form");

    if (!todoBien) {
      resultado.innerHTML = `<div class="alert alert-danger">Revisa los campos marcados en rojo.</div>`;
      return;
    }

    resultado.innerHTML = `
      <div class="alert alert-success">
        <h3 class="h5">¡Pedido recibido!</h3>
        <p class="mb-1"><strong>Nombre:</strong> ${formulario.nombre.value}</p>
        <p class="mb-1"><strong>Modelo:</strong> ${formulario.modelo.value} (talla ${formulario.talla.value})</p>
        <p class="mb-0"><strong>Pago:</strong> ${pagoElegido.value}</p>
      </div>`;

    Swal.fire({
      icon: "success",
      title: "¡Enviado!",
      text: "Te contactaremos pronto, " + formulario.nombre.value
    });

    formulario.reset();
    formulario.querySelectorAll(".is-valid").forEach(function (c) { c.classList.remove("is-valid"); });
    document.querySelector("#contador-letras").textContent = 0;
  });
}
actualizarContador();
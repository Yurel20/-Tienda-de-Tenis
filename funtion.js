
const productos = [
  { id: 1, nombre: "Runner Pro",    precio: 1499, categoria: "running",    color: 0 },
  { id: 2, nombre: "Urban Style",   precio: 1199, categoria: "casual",     color: 1 },
  { id: 3, nombre: "Court King",    precio: 1899, categoria: "basquetbol", color: 2 },
  { id: 4, nombre: "Speed Air",     precio: 1699, categoria: "running",    color: 3 },
  { id: 5, nombre: "Classic White", precio: 999,  categoria: "casual",     color: 4 },
  { id: 6, nombre: "Jump Max",      precio: 2099, categoria: "basquetbol", color: 1 },
  { id: 7, nombre: "Trail Runner",  precio: 1799, categoria: "running",    color: 2 },
  { id: 8, nombre: "Street Low",    precio: 1099, categoria: "casual",     color: 3 }
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
          <img src="img/tenis.svg" class="card-img-top color-${p.color}" alt="Tenis ${p.nombre}">
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
      const p = productos.find(funtion (prod) { return prod.id === item.id; });
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
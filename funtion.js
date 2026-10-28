
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
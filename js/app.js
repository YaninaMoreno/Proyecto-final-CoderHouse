const cards = document.getElementById('cards');
const templateCard = document.getElementById('templateCard').content;
const carritoCard = document.querySelector('.carritoCard').content;
const carritoList = document.getElementById('carritoList');
const templateCarritoTotal = document.getElementById('totalComprar').content;
const fragment = document.createDocumentFragment();
let carrito = {};


document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    iconCarrito('.navbarCarrito', 'carritoList')
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
        pintarTotal()
    }
})

//carrito icon
const iconCarrito = (icon, lista) => {
    document.addEventListener('click', e =>{
        if(e.target.matches(icon)){
            document.getElementById(lista).classList.toggle('isActive');
        }
    })
}
//evento teclado buscador
document.addEventListener('keyup', e => {
    if (e.target.matches('#buscador')){
        document.querySelectorAll('#dispositivo').forEach(dispositivo => {
            dispositivo.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            ?dispositivo.classList.remove('filtro')
            :dispositivo.classList.add('filtro')
        })
    }
})

//Eventos Click
cards.addEventListener('click', e => {
    agregarAlCarrito(e)
});
carritoList.addEventListener('click', e => {
    btnEliminar(e)
})

//capturar datos
const fetchData = async() => {
    try {
        const respuesta = await fetch('../api.json')
        const data = await respuesta.json()
        agregarCards(data)
    } catch (error) {
        console.log(error);
    }
}

//agregar productos a las cards del index
const agregarCards = data => {
    data.forEach( producto => {
        templateCard.querySelector('h3').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute('src', producto.img);
        templateCard.querySelector('img').setAttribute('alt', producto.title);
        templateCard.querySelector('button').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

//capturar el div del producto
const agregarAlCarrito = e => {
    if(e.target.classList.contains('cartaBtn')){
        setCarrito(e.target.parentElement.parentElement)
        agregarToast()
    }
    e.stopPropagation()
}

//convertir en objeto y sumar cantidades
const setCarrito = objeto => {
    const producto = {
        title: objeto.querySelector('h3').textContent,
        img: objeto.querySelector('img').src,
        precio: objeto.querySelector('p').textContent,
        id: objeto.querySelector('.cartaBtn').dataset.id,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto}
    pintarCarrito()
    pintarTotal()
}

//Agregar productos al carrito
const pintarCarrito = () =>{
    carritoList.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        carritoCard.querySelector('img').setAttribute('src', producto.img)
        carritoCard.querySelector('img').setAttribute('alt', producto.title)
        carritoCard.querySelector('.carritoBorrar').dataset.id = producto.id
        carritoCard.querySelector('.carritoTrash').dataset.id = producto.id
        carritoCard.querySelector('.carritoNombre').textContent = producto.title;
        carritoCard.querySelector('.carritoPrecio').textContent = producto.precio * producto.cantidad;
        carritoCard.querySelector('.carritoCantidad').textContent = producto.cantidad
        const clone = carritoCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    carritoList.appendChild(fragment)
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
//Total del cantidades y precios
const pintarTotal = () =>{
const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
templateCarritoTotal.querySelector('.tProductos').textContent = nCantidad
templateCarritoTotal.querySelector('.tPrecio2').textContent = nPrecio
const clone = templateCarritoTotal.cloneNode(true)
fragment.appendChild(clone)
carritoList.appendChild(fragment)
//Comprar
const comprarButton = document.getElementById('btnComprar')
comprarButton.addEventListener('click' , () =>{
    carrito = {}
    pintarCarrito()
    pintarTotal()
    alertComprar()
})
//Vaciar Carrito
const btnVaciarCarrito = document.querySelector('.btnCarritoBorrar')
btnVaciarCarrito.addEventListener('click' , () => {
    carrito = {}
    pintarCarrito()
    pintarTotal()
    eliminarTodo()
})
}
//Borrar Productos
const btnEliminar = e => {
    if(e.target.classList.contains('carritoTrash')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
        pintarTotal()
        eliminarToast()
    }
}

//Alerts
const agregarToast = () =>{
    Toastify({
        text: "Se agrego un nuevo producto al carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "#fff",
            color: "#000"
        },
    }).showToast()
}
const eliminarToast = () =>{
    Toastify({
        text: "Se elimino un producto del carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "#f70202",
            color: "#FFF"
        },
    }).showToast()
}
const eliminarTodo = () =>{
    Toastify({
        text: "Eliminaste todos los productos del carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "#f70202",
            color: "#FFF"
        },
    }).showToast()
}

const alertComprar = () => {
    Swal.fire({
        title: 'Compra realizada con exito.',
        text: 'Gracias por elegirnos!',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#313132',
    })
}
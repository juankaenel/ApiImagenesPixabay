const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;

    //validación de formulario vacío
    if (terminoBusqueda === '') {
        mostrarAlerta('Agregá un término de búsqueda')
        return;
    }

    buscarImagenes(terminoBusqueda);

}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.bg-red-500');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('error', 'bg-red-500', 'border-red-400', 'text-white', 'px-4', 'py-4', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);
    }

    setTimeout(() => {
        alerta.remove();
    }, 2000);
}

function buscarImagenes(termino){
    //Para poder hacer peticiones a la api debes tener una api key, primeramente debes registrarte en pixabay. -> https://pixabay.com/api/docs/
    const key = '18789396-cb425b960b98f7fb93d8a42a0';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}`;
    fetch(url)
        .then(respuesta=>respuesta.json())
        .then(respuesta=>{
            mostrarImagenes(respuesta.hits);
        });
}

function mostrarImagenes(imagenes){
    console.log(imagenes);
}
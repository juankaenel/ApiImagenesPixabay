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

function buscarImagenes(termino) {
    //Para poder hacer peticiones a la api debes tener una api key, primeramente debes registrarte en pixabay. -> https://pixabay.com/api/docs/
    const key = '18789396-cb425b960b98f7fb93d8a42a0';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=100`; //con &per_page=100 nos va a traer 100 por cada consulta
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            if (resultado.total===0){
                mostrarAlerta('No existe ninguna imágen con éste término de búsqueda')
            }
            //else
            mostrarImagenes(resultado.hits);

        });
}

function mostrarImagenes(imagenes) {
    //limpiamos html
    limpiarHTML();
    // console.log(imagenes);

    //Iteramos sobre el array de imagenes y construimos el html
    imagenes.forEach(imagen => {
        console.log(imagen);
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white rounded">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light">Me gusta</span></p>
                    <p class="font-bold"> ${views} <span class="font-light">Veces vista</span></p>
                    
                    <!-- Con block -> display block -->
                    <a  class="block w-full bg-blue-800 hover:bg-blue-700 text-white uppercase font-bold text-center rounded mt-5 px-2 p-1"
                    href="${largeImageURL}" target="_blank">
                        Ver imágen
                    </a>
                </div>
            </div>
        </div>
        `
    })


}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
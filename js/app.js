const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;
    if (terminoBusqueda === '') {
        mostrarAlerta('Agregá un término de búsqueda')
        return;
    }
    buscarImagenes();

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

        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }



}

async function buscarImagenes() {
    //Para poder hacer peticiones a la api debes tener una api key, primeramente debes registrarte en pixabay. -> https://pixabay.com/api/docs/

    const termino = document.querySelector('#termino').value;

    //validación de formulario vacío
    if (termino === '') {
        mostrarAlerta('Agregá un término de búsqueda')
        return;
    }

    const key = '18789396-cb425b960b98f7fb93d8a42a0';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`; //con &per_page=100 nos va a traer 100 por cada consulta
  /*   fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            if (resultado.total===0){
                  mostrarAlerta('No existe ninguna imágen con éste término de búsqueda')

            }
            totalPaginas = calcularPaginas(resultado.totalHits); //totalHits contiene la cantidad de páginas que trae esa consulta
            //console.log(totalPaginas); //numero de imágenes por página
            mostrarImagenes(resultado.hits); 

        });*/

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json(); 
        if (resultado.total===0){
            mostrarAlerta('No existe ninguna imágen con éste término de búsqueda')
        }
        totalPaginas = calcularPaginas(resultado.totalHits); //totalHits contiene la cantidad de páginas que trae esa consulta
        //console.log(totalPaginas); //numero de imágenes por página
        mostrarImagenes(resultado.hits);
    } catch (error) {
        console.log(error);
    }
        
}


//Generador que va a registrar la cantidad de elementos de acuerdo a las páginas. Utilizamos un generador porque este nos puede informar a traves del metodo done cuando llega al final de una iteracion
function *crearPaginador(total){
    //si tiene una sola pagina registra 1 sola, si tiene 17 registra kas 17
    for(let i=1; i<=total; i++){
        yield i; //registra los valores interamente en el generador
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina)) //calcula la paginación en base al total de imagenes / 40, y lo redondea para arriba
}

function mostrarImagenes(imagenes) {
    //limpiamos html
    limpiarHTML();
    // console.log(imagenes);

    //Iteramos sobre el array de imagenes y construimos el html
    imagenes.forEach(imagen => {
        //console.log(imagen);
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
    });

    //limpio el paginador anterior si es que existe
    limpiarPaginadorDiv();

    imprimirPaginador();

}

function limpiarPaginadorDiv(){
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    // console.log(iterador.next().done)
    while (true){

        const {value,done} =iterador.next();
        if (done) return; //si llegúe al final del iterador, es decir a la ultima imagen terminá

        //caso contrario, generá un boton por cada elemento del generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value; //el valor 1,2,3,4
        boton.textContent =value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','uppercase','rounded', 'mb-4');
        paginacionDiv.appendChild(boton);

        boton.onclick = () =>{
            paginaActual = value;//si doy click en la paginacion 10 me imprime boton 10
            //console.log(paginaActual);
            //cuando de click en algun boton, hago una consulta nuevamente con la página a la que tiene ese valor en el btn, es decir, doy click en la pag 5 y se vuelve hacer una peticion a la página 5 donde en el fetch recibe como parametro la page 5
            buscarImagenes();
        }

    }
}

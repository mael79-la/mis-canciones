document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-canciones");
    const buscador = document.getElementById("buscador");
    
    let todasLasCanciones = [];

    // Ahora buscamos el archivo correcto: canciones.json
    fetch("./canciones.json")
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("No se pudo leer canciones.json");
            return respuesta.json();
        })
        .then(canciones => {
            todasLasCanciones = canciones;
            mostrarCanciones(todasLasCanciones);
        })
        .catch(error => {
            console.error("Error detectado:", error);
            contenedor.innerHTML = "<p class='cargando'>Error al cargar la música. Verifica el archivo canciones.json</p>";
        });

    function mostrarCanciones(lista) {
        contenedor.innerHTML = "";

        if (lista.length === 0) {
            contenedor.innerHTML = "<p class='cargando'>No se encontraron canciones.</p>";
            return;
        }

        lista.forEach(cancion => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-cancion";

            tarjeta.innerHTML = `
                <div class="info-cancion">
                    <div class="detalles">
                        <span class="titulo">${cancion.titulo}</span>
                        <span class="artista">${cancion.artista || 'Mael'}</span>
                    </div>
                    <span class="duracion">${cancion.duracion}</span>
                </div>
                <audio controls src="${cancion.archivo}"></audio>
                <a href="${cancion.archivo}" download="${cancion.titulo}.mp3" class="btn-descargar">
                    📥 Descargar Canción
                </a>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    buscador.addEventListener("input", (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase().trim();
        const cancionesFiltradas = todasLasCanciones.filter(cancion => {
            return cancion.titulo.toLowerCase().includes(textoBusqueda) || 
                   (cancion.artista && cancion.artista.toLowerCase().includes(textoBusqueda));
        });
        mostrarCanciones(cancionesFiltradas);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-canciones");
    const buscador = document.getElementById("buscador");
    
    let todasLasCanciones = [];

    // Forzamos a que busque manifest.json de forma correcta
    fetch("./manifest.json")
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("No se pudo leer el archivo manifest.json");
            return respuesta.json();
        })
        .then(canciones => {
            todasLasCanciones = canciones;
            mostrarCanciones(todasLasCanciones);
        })
        .catch(error => {
            console.error("Error detectado:", error);
            contenedor.innerHTML = "<p class='cargando'>Error al cargar la música. Asegúrate de que manifest.json existe y está bien escrito.</p>";
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
                        <span class="artista">${canclon.artista || 'Mael'}</span>
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
            const coincideTitulo = cancion.titulo.toLowerCase().includes(textoBusqueda);
            return coincideTitulo;
        });
        mostrarCanciones(cancionesFiltradas);
    });
});

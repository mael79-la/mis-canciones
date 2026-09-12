document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-canciones");
    const buscador = document.getElementById("buscador");
    
    // Aquí guardaremos las canciones que descarguemos del JSON
    let todasLasCanciones = [];

    // 1. Obtener los datos del JSON
    fetch("canciones.json")
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error al cargar JSON");
            return respuesta.json();
        })
        .then(canciones => {
            todasLasCanciones = canciones;
            // Mostramos todas las canciones al cargar la página por primera vez
            mostrarCanciones(todasLasCanciones);
        })
        .catch(error => {
            console.error("Error:", error);
            contenedor.innerHTML = "<p class='cargando'>Error al cargar la música.</p>";
        });

    // 2. Función encargada de dibujar las tarjetas en el HTML
    function mostrarCanciones(lista) {
        contenedor.innerHTML = ""; // Limpiar el contenedor

        if (lista.length === 0) {
            contenedor.innerHTML = "<p class='cargando'>No se encontraron canciones que coincidan.</p>";
            return;
        }

        lista.forEach(cancion => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-cancion";

            tarjeta.innerHTML = `
                <div class="info-cancion">
                    <div class="detalles">
                        <span class="titulo">${cancion.titulo}</span>
                        <span class="artista">${cancion.artista}</span>
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

    // 3. Escuchar lo que el usuario escribe en el buscador
    buscador.addEventListener("input", (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase().trim();

        // Filtramos buscando coincidencias tanto en el título como en el artista
        const cancionesFiltradas = todasLasCanciones.filter(cancion => {
            const coincideTitulo = cancion.titulo.toLowerCase().includes(textoBusqueda);
            const coincideArtista = cancion.artista.toLowerCase().includes(textoBusqueda);
            return coincideTitulo || coincideArtista;
        });

        // Volvemos a dibujar solo las canciones que pasaron el filtro
        mostrarCanciones(cancionesFiltradas);
    });
});

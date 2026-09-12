document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-canciones");
    const buscador = document.getElementById("buscador");
    
    // Lista de canciones configurada con el nombre correcto de tu archivo
    const todasLasCanciones = [
        {
            "titulo": "Hola",
            "artista": "Mael",
            "archivo": "hola.mp3",
            "duracion": "0:03"
        },
        {
            "titulo": "Down Like That",
            "artista": "Mael",
            "archivo": "down-like-that.mp3", // <-- Corregido con "k" para que coincida perfectamente
            "duracion": "3:01"
        }
    ];

    mostrarCanciones(todasLasCanciones);

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

    buscador.addEventListener("input", (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase().trim();
        const cancionesFiltradas = todasLasCanciones.filter(cancion => {
            return cancion.titulo.toLowerCase().includes(textoBusqueda) || 
                   cancion.artista.toLowerCase().includes(textoBusqueda);
        });
        mostrarCanciones(cancionesFiltradas);
    });
});

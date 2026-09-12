document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-canciones");

    // Hacemos la petición para leer nuestro archivo JSON local
    fetch("canciones.json")
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo JSON de canciones");
            }
            return respuesta.json();
        })
        .then(canciones => {
            // Limpiamos el texto de "Cargando..."
            contenedor.innerHTML = "";

            if (canciones.length === 0) {
                contenedor.innerHTML = "<p class='cargando'>No hay canciones disponibles en este momento.</p>";
                return;
            }

            // Recorremos cada canción del JSON para dibujarla en la web
            canciones.forEach(cancion => {
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
        })
        .catch(error => {
            console.error("Error:", error);
            contenedor.innerHTML = "<p class='cargando'>Error al cargar la música. Inténtalo de nuevo más tarde.</p>";
        });
});


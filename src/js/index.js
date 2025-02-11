let i = 1;
let miarray = [];
let turnoJugador = true; /* Controla si es el turno del jugador */

/* casillas del tablero */
while (i <= 9) {
    let caja = document.getElementById("g" + i);
    miarray.push(caja);
    i++;
}

function jugadorHaceJugada(ev) {
    if (turnoJugador && !this.textContent) { // Solo juega si la casilla está vacía
        this.textContent = 'X'; /* Marcar como jugada del jugador */
        this.style.fontSize = '60px';  // Hacer la X más grande
        this.style.color = 'white';    // Poner la X en blanco
        this.removeEventListener("click", jugadorHaceJugada); /* Desactivar el click después de jugar */
        if (verificarGanador('X')) {
            mostrarMensaje('¡El Jugador ha ganado!');
            desactivarTablero();
        } else {
            turnoJugador = false; /* Cambiar al turno del oponente */
            oponenteHaceJugada();
        }
    }
}

/* Evento para las casillas del tablero */
miarray.forEach(caja => {
    caja.addEventListener("click", jugadorHaceJugada);
});

function oponenteHaceJugada() {
    /* Verifico que las casillas estén disponibles */
    let casillasDisponibles = miarray.filter(caja => !caja.textContent);

    /* Si hay casillas disponibles, la computadora hace su jugada */
    if (casillasDisponibles.length > 0) {
        let indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
        let cajaElegida = casillasDisponibles[indiceAleatorio];
        cajaElegida.textContent = 'O'; /* Marca como jugada del oponente */
        cajaElegida.style.fontSize = '60px';  // Hacer la O más grande
        cajaElegida.style.color = 'white';    // Poner la O en blanco
        if (verificarGanador('O')) {
            mostrarMensaje('¡La Computadora ha ganado!');
            desactivarTablero();
        } else {
            turnoJugador = true;
        }
    }
}

/* Verificar si hay un ganador */
function verificarGanador(simbolo) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    return combinacionesGanadoras.some(combinacion => {
        return combinacion.every(index => miarray[index].textContent === simbolo);
    });
}

/* Desactiva todo el tablero después de que alguien gane */
function desactivarTablero() {
    miarray.forEach(caja => {
        caja.removeEventListener("click", jugadorHaceJugada);
        caja.removeEventListener("click", oponenteHaceJugada);
    });
}

/* Función para mostrar el mensaje de ganador */
function mostrarMensaje(mensaje) {
   /* Crear un contenedor para mostrar el mensaje */
    let mensajeElemento = document.createElement("div");
    mensajeElemento.id = "mensaje";
    mensajeElemento.style.position = "absolute";
    mensajeElemento.style.top = "50%";
    mensajeElemento.style.left = "50%";
    mensajeElemento.style.transform = "translate(-50%, -50%)";
    mensajeElemento.style.padding = "20px";
    mensajeElemento.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    mensajeElemento.style.color = "#fff";
    mensajeElemento.style.fontSize = "24px";
    mensajeElemento.style.textAlign = "center";
    mensajeElemento.style.borderRadius = "10px";
    mensajeElemento.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
    mensajeElemento.innerHTML = mensaje;

    document.body.appendChild(mensajeElemento);
}

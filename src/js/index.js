let i = 1;
let miarray = [];
let turnoJugador = true; /* Controla si es el turno del jugador */

/* Recuperar datos guardados desde el localStorage */
let contCompuPerdidas = parseInt(localStorage.getItem("compuPerdidas")) || 0;
let contCompuGanadas = parseInt(localStorage.getItem("compuGanadas")) || 0;
let contUsuPerdidas = parseInt(localStorage.getItem("usuPerdidas")) || 0;
let contUsuGanadas = parseInt(localStorage.getItem("usuGanadas")) || 0;

const usuGanadas = document.getElementById("usuGanadas");
const usuPerdidas = document.getElementById("usuPerdidas");
const compuGanadas = document.getElementById("compuGanadas");
const compuPerdidas = document.getElementById("compuPerdidas");

// Inicializar los contadores con los valores guardados
usuGanadas.textContent = "Victorias: " + contUsuGanadas;
usuPerdidas.textContent = "Derrotas: " + contUsuPerdidas;
compuGanadas.textContent = "Victorias: " + contCompuGanadas;
compuPerdidas.textContent = "Derrotas: " + contCompuPerdidas;

while (i <= 9) {
    let caja = document.getElementById("g" + i);
    miarray.push(caja);
    i++;
}

function jugadorHaceJugada(ev) {
    // Verificar si la casilla está vacía y no está bloqueada
    if (!this.textContent) {
        let simbolo = turnoJugador ? 'X' : 'O';  // Turno alternado entre 'X' y 'O'
        this.textContent = simbolo;

        this.style.fontSize = '60px';  // Hacer la X o la O más grande
        this.style.color = 'white';    // Poner la X o la O en blanco
        this.removeEventListener("click", jugadorHaceJugada);

        if (verificarGanador(simbolo)) {
            mostrarMensaje(simbolo === 'X' ? "Ganaste como X :)" : "Ganaste como O :)");
            desactivarTablero();
            if (simbolo === 'X') {
                contUsuGanadas++;
                contCompuPerdidas++;
            } else {
                contUsuPerdidas++;
                contCompuGanadas++;
            }
            // Guardar los datos en localStorage
            localStorage.setItem("usuGanadas", contUsuGanadas);
            localStorage.setItem("compuPerdidas", contCompuPerdidas);
            localStorage.setItem("usuPerdidas", contUsuPerdidas);
            localStorage.setItem("compuGanadas", contCompuGanadas);
            usuGanadas.textContent = "Victorias: " + contUsuGanadas;
            compuPerdidas.textContent = "Derrotas: " + contCompuPerdidas;
            usuPerdidas.textContent = "Derrotas: " + contUsuPerdidas;
            compuGanadas.textContent = "Victorias: " + contCompuGanadas;
        } else {
            turnoJugador = !turnoJugador;  // Cambiar de turno entre 'X' y 'O'
            if (!turnoJugador) {
                oponenteHaceJugada(); // Si es el turno de la computadora, hace su jugada
            }
        }
    }
}

miarray.forEach(caja => {
    caja.addEventListener("click", jugadorHaceJugada);
});

function oponenteHaceJugada() {
    if (document.getElementById("cbx-53").checked) {
        // Si el checkbox cbx-53 está activado, no hace jugadas la computadora
        return;
    }

    const usarMinimax = document.getElementById("cbx-52").checked;
    let casillasDisponibles = miarray.filter(caja => !caja.textContent);
    if (casillasDisponibles.length > 0) {
        let cajaElegida;
        if (usarMinimax) {
            cajaElegida = obtenerMejorJugada(casillasDisponibles);
        } else {
            // Jugada aleatoria si el checkbox no está activado
            let indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
            cajaElegida = casillasDisponibles[indiceAleatorio];
        }
        cajaElegida.textContent = 'O'; /* Marca como jugada del oponente */
        cajaElegida.style.fontSize = '60px';  // Hacer la O más grande
        cajaElegida.style.color = 'white';    // Poner la O en blanco
        if (verificarGanador('O')) {
            mostrarMensaje("Compu ganó, USTED NO SIRVE :(");
            desactivarTablero();
            contUsuPerdidas++;
            contCompuGanadas++;
            // Guardar los datos en localStorage
            localStorage.setItem("usuPerdidas", contUsuPerdidas);
            localStorage.setItem("compuGanadas", contCompuGanadas);
            usuPerdidas.textContent = "Derrotas: " + contUsuPerdidas;
            compuGanadas.textContent = "Victorias: " + contCompuGanadas;
        }else{
            turnoJugador = true;
        }
    }else{
        mostrarMensaje("Empate, no hay ganadores");
    }
}

/* Verificar si hay un ganador */
function verificarGanador(simbolo) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return combinacionesGanadoras.some(combinacion => {
        return combinacion.every(index => miarray[index].textContent === simbolo);
    });
}

function desactivarTablero() {
    miarray.forEach(caja => {
        caja.removeEventListener("click", jugadorHaceJugada);
    });
}

function mostrarMensaje(mensaje) {
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

function reiniciarJuego() {
    miarray.forEach(caja => {
        caja.textContent = '';
        caja.style.fontSize = 'initial';
        caja.style.color = 'initial';
        caja.addEventListener("click", jugadorHaceJugada);
    });

    turnoJugador = true;
    let mensajeElemento = document.getElementById("mensaje");
    if (mensajeElemento) {
        mensajeElemento.remove();
    }
}

document.getElementById("reiniciarBtn").addEventListener("click", reiniciarJuego);

function obtenerMejorJugada(casillasDisponibles) {
    let mejorPuntaje = -Infinity;
    let mejorJugada = null;

    for (let i = 0; i < casillasDisponibles.length; i++) {
        let jugada = casillasDisponibles[i];
        jugada.textContent = 'O'; // Probar la jugada para el oponente

        let puntaje = minimax(miarray, false); // Evaluar el puntaje con Minimax
        jugada.textContent = ''; // Revertir la jugada

        if (puntaje > mejorPuntaje) {
            mejorPuntaje = puntaje;
            mejorJugada = jugada;
        }
    }

    return mejorJugada;
}

function minimax(tablero, esMaximizando) {
    let ganador = verificarGanador('O');
    if (ganador) return 1;
    ganador = verificarGanador('X');
    if (ganador) return -1;

    let casillasDisponibles = tablero.filter(caja => !caja.textContent);
    if (casillasDisponibles.length === 0) return 0;

    if (esMaximizando) {
        let mejorPuntaje = -Infinity;
        for (let i = 0; i < casillasDisponibles.length; i++) {
            let jugada = casillasDisponibles[i];
            jugada.textContent = 'O'; // Simula la jugada del oponente

            let puntaje = minimax(tablero, false);
            jugada.textContent = ''; // Revierte la jugada

            mejorPuntaje = Math.max(puntaje, mejorPuntaje);
        }
        return mejorPuntaje;
    } else {
        let mejorPuntaje = Infinity;
        for (let i = 0; i < casillasDisponibles.length; i++) {
            let jugada = casillasDisponibles[i];
            jugada.textContent = 'X'; // Simula la jugada del jugador

            let puntaje = minimax(tablero, true);
            jugada.textContent = ''; // Revierte la jugada

            mejorPuntaje = Math.min(puntaje, mejorPuntaje);
        }
        return mejorPuntaje;
    }
}wd20

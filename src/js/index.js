let i = 1;
let lista= [];
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

/* Inicializar los contadores con los valores guardados */
usuGanadas.textContent = "Victorias: " + contUsuGanadas;
usuPerdidas.textContent = "Derrotas: " + contUsuPerdidas;
compuGanadas.textContent = "Victorias: " + contCompuGanadas;
compuPerdidas.textContent = "Derrotas: " + contCompuPerdidas;



/* while (i <= 9) {
    let caja = document.createElement("g" + i);
    if (caja)
    lista.push(caja);
    i++;
} */
while (i <= 9) {
    let caja = document.getElementById("g" + i);  // Obtén el elemento del DOM real
    if (caja) {  // Verifica que el elemento exista antes de agregarlo
        lista.push(caja);
    }
    i++;
}

const reiniciarCont=document.getElementById("reiniciarCont")

reiniciarCont.addEventListener("click",()=>{
    localStorage.clear();
    usuGanadas.textContent = "Victorias: 0";
    usuPerdidas.textContent = "Derrotas: 0";
    compuGanadas.textContent = "Victorias: 0";
    compuPerdidas.textContent = "Derrotas: 0";
    contCompuPerdidas = 0;
    contCompuGanadas = 0;
    contUsuPerdidas = 0;
    contUsuGanadas = 0;
    reiniciarJuego();
})


function jugadorHaceJugada() {
    /* Verificar si la casilla está vacía y no está bloqueada */
    if (!this.textContent) {
        let simbolo = turnoJugador ? 'X' : 'O';  /* Turno alternado entre 'X' y 'O' */
        this.textContent = simbolo;
        this.style.fontSize = '60px';  /* Hacer la X o la O más grande */
        this.style.color = 'white';    /* Poner la X o la O en blanco */
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
            /* Guardar los datos en localStorage como el conntador de la pagina */
            localStorage.setItem("usuGanadas", contUsuGanadas);
            localStorage.setItem("compuPerdidas", contCompuPerdidas);
            localStorage.setItem("usuPerdidas", contUsuPerdidas);
            localStorage.setItem("compuGanadas", contCompuGanadas);
            usuGanadas.textContent = "Victorias: " + contUsuGanadas;
            compuPerdidas.textContent = "Derrotas: " + contCompuPerdidas;
            usuPerdidas.textContent = "Derrotas: " + contUsuPerdidas;
            compuGanadas.textContent = "Victorias: " + contCompuGanadas;
        } else {
            turnoJugador = !turnoJugador;  /* Cambiar de turno entre 'X' y 'O' */
            if (!turnoJugador) {
                oponenteHaceJugada(); /* Si es el turno de la computadora, hace su jugada */
            }
        }
    }
}



lista.forEach(caja => {
    caja.addEventListener("click", jugadorHaceJugada);
});



function oponenteHaceJugada() {
    if (document.getElementById("cbx-53").checked) {
        /*  Si el checkbox cbx-53 está activado, no hace jugadas la computadora */
        return;
    }
    const usarMinimax = document.getElementById("cbx-52").checked;
    let casillasDisponibles = lista.filter(caja => !caja.textContent);
    if (casillasDisponibles.length > 0) {
        let cajaElegida;
        if (usarMinimax) {
            cajaElegida = obtenerMejorJugada(casillasDisponibles);
        } else {
            /* Jugada aleatoria si el checkbox no está activado */
            let indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
            cajaElegida = casillasDisponibles[indiceAleatorio];
        }
        cajaElegida.textContent = 'O'; /* Marca como jugada del oponente */
        if (verificarGanador('O')) {
            mostrarMensaje("Compu ganó, USTED NO SIRVE :(");
            desactivarTablero();
            contUsuPerdidas++;
            contCompuGanadas++;
            /* Guardar los datos en localStorage */
            localStorage.setItem("usuPerdidas", contUsuPerdidas);
            localStorage.setItem("compuGanadas", contCompuGanadas);
            usuPerdidas.textContent = "Derrotas: " + contUsuPerdidas;
            compuGanadas.textContent = "Victorias: " + contCompuGanadas;
        }else{
            turnoJugador = true;
        }
    }
}





/* Verificar si hay un ganador */
function verificarGanador(simbolo) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    /* .some es un metodo que comprueba si al menos un elemento del array/lista
        cumple con la condicion implementada por la funcion proporcionada*/
    return combinacionesGanadoras.some(combinacion => {
        /* .every metodo iterativo . recorre los elementos dados en la matriz de izq a derec
        hasta que lo encuentre y devuelv un false*/
        return combinacion.every(index => lista[index].textContent === simbolo);
    });
}

function desactivarTablero() {
    lista.forEach(caja => {
        caja.removeEventListener("click", jugadorHaceJugada);
    });
}
function mostrarMensaje(mensaje) {
    let mensajeElemento = document.createElement("div");
    mensajeElemento.id = "mensaje";
    mensajeElemento.innerHTML = mensaje;
    document.body.appendChild(mensajeElemento);
}
function reiniciarJuego() {
    lista.forEach(caja => {
        caja.textContent = '';
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
        jugada.textContent = 'O'; /*  Probar la jugada para el oponente */
        let puntaje = minimax(lista, false); /*  Evaluar el puntaje con Minimax */
        jugada.textContent = ''; /*  Revertir la jugada */
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
            jugada.textContent = 'O'; /*  Simula la jugada del oponente */
            let puntaje = minimax(tablero, false);
            jugada.textContent = ''; /*  Revierte la jugada */
            mejorPuntaje = Math.max(puntaje, mejorPuntaje);
        }
        return mejorPuntaje;
    } else {
        let mejorPuntaje = Infinity;
        for (let i = 0; i < casillasDisponibles.length; i++) {
            let jugada = casillasDisponibles[i];
            jugada.textContent = 'X'; /*  Simula la jugada del jugador */
            let puntaje = minimax(tablero, true);
            jugada.textContent = ''; /* Revierte la jugada */
            mejorPuntaje = Math.min(puntaje, mejorPuntaje);
        }
        return mejorPuntaje;
    }
}

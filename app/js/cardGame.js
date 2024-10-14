let turno=Number(0);

function getRandomPathImg(){
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
        return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;
}


let jugadores=[];

const Tipo = {
    BOMBA:'BOMBA',
    PUNTOS:'PUNTOS',
    DESACTIVAR:'DESACTIVAR',
    NOTURN:'NOTURN',
}

class Jugador {
    constructor(nombre) {
        this.nombre=nombre;
        this.cartas=[];
        this.eliminado=false;
    };

    getNommbre(){
        return this.nombre;
    }
    //Este metodo devuelve el numero de cartas
    contarCartas(){
        return this.cartas.length;
    };

    //Este metodo añade una carta al array
    addCarta(carta){
        this.cartas.push(carta);
    };

    //Este método sirve para comprobar si ese jugador puede jugar
    puedeJugar(){
        return !this.eliminado;
    };

    //Cuenta los puntos del jugador
    puntosJugador(){
        let puntos =Number(0);
        this.cartas.forEach(element =>{
            puntos+=Number(element.getValor());
        });
        return puntos;
    };

    //Cuenta las cartas de pasar turno
    cuantasPasarTurno(){
        let cantidadPasar =Number(0);
        this.cartas.forEach(element =>{
            if(element.tipo === Tipo.NOTURN){
                cantidadPasar++;
            }
        });
        return cantidadPasar;
    };

    //Comprobamos si podemos pasar turno
    puedePasarTurno(){
        let puedePasar= false;
        this.cartas.forEach(element =>{
            if(element.tipo === Tipo.NOTURN){
                puedePasar=true;
            }
        });
        return puedePasar;
    };

    //Borramos la primera carta de pasar turno que encontremos
    quitarPasarTurno(){
        for (let i = 0; i < this.cartas.length; i++) {
            if(this.cartas[i].tipo === Tipo.NOTURN){
                this.cartas.splice(i,1);
                break;
            }
        }
    };

    //Cuentas cartas de desactivar se tienen
    cuantasDesactivar(){
        let cantidadDesac =Number(0);
        this.cartas.forEach(element =>{
            if(element.tipo === Tipo.DESACTIVAR ){
                cantidadDesac++;
            }
        });
        return cantidadDesac;
    };

    //Comprobamos si podemos desactivar una bomba
    puedeDesactivar(){
        let puedeDesac= false;
        this.cartas.forEach(element =>{
            if(element.tipo === Tipo.DESACTIVAR){
                puedeDesac=true;
            }
        });
        return puedeDesac;
    };

    //Borramos la primera carta de pasar desactivar que encontremos
    quitarDesactivar(){
        for (let i = 0; i < this.cartas.length; i++) {
            if(this.cartas[i].tipo === Tipo.DESACTIVAR){
                this.cartas.splice(i,1);
                break;
            }
        }
    };

    //Metodo para cambiar el booleano de eliminado para indicar que el jugador no puede jugar
    marcarEliminado(){
        this.eliminado=true;
    };

}

class Carta {
    constructor(tipo,valor) {
        this.tipo=tipo;
        this.valor=valor;
        
    };

    getValor(){
        return Number(this.valor);
    };
}

class Deck {
    constructor() {
        this.cartas=[];
    }

    init() {
        for (let index = 0; index < 60; index++) {
            if(index<6){
                this.cartas.push(new Carta(Tipo.BOMBA,0));
            }else if (index<12) {
                this.cartas.push(new Carta(Tipo.DESACTIVAR,0));
            } else if(index<22) {
                this.cartas.push(new Carta(Tipo.NOTURN,0));
            }else {
                let ran = Math.floor(Math.random()*10);
                this.cartas.push(new Carta(Tipo.PUNTOS,ran));
            }
            
        }
    };

    mezclar() {
        for (let i = this.cartas.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
        }
    };

    //Este método elemina la ultima carta y la devuelve como parametro
    quitarCarta(){
        let aQuitar= this.cartas[this.cartas.length-1];
        this.cartas.pop();
        return aQuitar;
    };

    //Comprueba si el array de cartas está vacio
    cartasVacio(){
        if(this.cartas.length === 0){
            return true;
        }else{
            return false;
        }
    };

}

Juego= new Deck();

Juego.init();

Juego.mezclar();

J1 = new Jugador("J1");
J2 = new Jugador("J2");
J3 = new Jugador("J3");

jugadores.push(J1,J2,J3);

function jugadorON() {
    for (let i = 0; i < jugadores.length; i++) {
        if (i===turno) {
            document.getElementById('J'+ (i+1) +'name').className = 'turnoON';
        }else{
            document.getElementById('J'+ (i+1) +'name').className = 'turnoOFF';
        }
    }    
}

jugadorON();

document.getElementById('imgCartaRobada').setAttribute('src',getRandomPathImg());
let btnRobar=document.getElementById('btnRobar');
btnRobar.onclick= robarCarta;
let btnPasar=document.getElementById('btnPasar');
btnPasar.onclick=pasarTurno;

function robarCarta() {
    hanGanado();
        //Primero se comprueba si el jugador puede jugar
        //Si no puede jugar se pasa el turno directamente al siguiente jugador
        if(jugadores[turno].puedeJugar()){
            var cartaAnadir = Juego.quitarCarta();
            var imgRobada= document.getElementById('imgCartaRobada');
            //Hacemos un switch para mostrar el tipo de carta correcta
            imgRobada.setAttribute('src','');
            switch (cartaAnadir.tipo) {
                case Tipo.BOMBA:
                    imgRobada.setAttribute('src','./img/bomba/bomba.png');
                    break;
                case Tipo.DESACTIVAR:
                    imgRobada.setAttribute('src','./img/herramienta/herramienta.png');
                    break;
                case Tipo.NOTURN:
                    imgRobada.setAttribute('src','./img/pasarTurno/pasarTurno.png');
                    break;
                case Tipo.PUNTOS:
                    imgRobada.setAttribute('src',getRandomPathImg());
                    break;
            } 


            //Comprobamos si la carta que queremos añadir es una bomba
            //Si no es una carta hacemos la lógica del código de manera normal
            if(cartaAnadir.tipo === Tipo.BOMBA){
                //Comprobamos si el jugador la puede desactivar
                //Si la puede desactivar le quitamos una carta de desactivar al jugador
                //En caso contrario lo eliminamos
                if(jugadores[turno].puedeDesactivar()){
                    jugadores[turno].quitarDesactivar();
                    document.getElementById('J'+ (turno+1) +'NumCartas').textContent= '⚪️ Número de cartas: ' + jugadores[turno].contarCartas();
                    document.getElementById('J'+ (turno+1) +'Desactivacion').textContent= '⚪️ Cartas desactivación:  ' + jugadores[turno].cuantasDesactivar();
                    cambiarTurno();
                }else{
                    jugadores[turno].marcarEliminado();
                    cambiarTurno();
                }
            }else{
                jugadores[turno].addCarta(cartaAnadir);
                document.getElementById('J'+ (turno+1) +'Puntos').textContent= '⚪️ Puntos totales: ' + jugadores[turno].puntosJugador();
                document.getElementById('J'+ (turno+1) +'NumCartas').textContent= '⚪️ Número de cartas: ' + jugadores[turno].contarCartas();
                document.getElementById('J'+ (turno+1) +'saltoTurno').textContent= '⚪️ Cartas salto turno: ' + jugadores[turno].cuantasPasarTurno();
                document.getElementById('J'+ (turno+1) +'Desactivacion').textContent= '⚪️ Cartas desactivación:  ' + jugadores[turno].cuantasDesactivar();
                cambiarTurno();
            }
        }else{
            cambiarTurno();
        }    
}

function pasarTurno() {
    //Si se puede pasar turno se pasa turno y se quita una carta de saltar turno
    if (jugadores[turno].puedePasarTurno()) {
        jugadores[turno].quitarPasarTurno();
        document.getElementById('J'+ (turno+1) +'NumCartas').textContent= '⚪️ Número de cartas: ' + jugadores[turno].contarCartas();
        document.getElementById('J'+ (turno+1) +'saltoTurno').textContent= '⚪️ Cartas salto turno: ' + jugadores[turno].cuantasPasarTurno();
        turno++;
        if (turno === jugadores.length) {
            turno = 0;
        }
        jugadorON();
    }
}


function cambiarTurno() {
    turno++;
    if (turno === jugadores.length) {
        turno = 0;
    }
    jugadorON();
}

function hanGanado() {
    let perdedores= Number(0);
    let ganador = null;
    for (let i = 0; i < jugadores.length; i++) {
        if(!jugadores[i].puedeJugar()){
            perdedores++;
        }else{
            ganador = jugadores[i];
        }
    }
    if(perdedores ===2){
        //Si hay 2 perdedores entonces el que no ha perdido es el ganado.
        alert("Ha ganado el " + ganador.getNommbre());
        btnRobar.textContent = "REINICIAR";
        btnRobar.onclick = function() {
            robarCarta(); 
            location.reload();  
        };
    }else if(Juego.cartasVacio()){
        //Ahora comprobamos si el array de cartas está vaccio
        //Si está vació gana el jugador que tenga más puntos
        alert("Ha ganado el jugador con más puntos :" +obtenerJugadorConMasPuntos().getNommbre());
        btnRobar.textContent = "REINICIAR";
        btnRobar.onclick = function() {
            robarCarta(); 
            location.reload();  
        };
    }
}

function obtenerJugadorConMasPuntos() {

    //Establecemos como jugador con más puntos al primero y luego vamos cambiando
    let jugadorConMasPuntos = jugadores[0]; 
    let maxPuntos = jugadorConMasPuntos.puntosJugador();

    // Recorremos para comprobar quien tiene más puntos
    for (let i = 1; i < jugadores.length; i++) {
        let puntosActuales = jugadores[i].puntosJugador();
        if (puntosActuales > maxPuntos) {
            maxPuntos = puntosActuales;
            jugadorConMasPuntos = jugadores[i];
        }
    }

    return jugadorConMasPuntos;
}

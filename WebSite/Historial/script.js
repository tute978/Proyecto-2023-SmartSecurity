let variable;

document.getElementById('overlay').addEventListener('click', (overlay) => {
    const objeto = document.getElementById(overlay);
    Ocultar(variable.find(x => x.isOn === true));
});

function Ocultar(jotason) {
    const elemento = document.getElementById(jotason.id);
    console.log(elemento)
    const overlay = document.getElementById("overlay");
    

    if (jotason.isOn) {
        overlay.style.pointerEvents="none";
        elemento.style.pointerEvents = "none";
        elemento.style.opacity = 0;
        jotason.isOn = !jotason.isOn;
    } else {
        overlay.style.pointerEvents="auto";
        elemento.classList.remove("invisible");
        elemento.style.pointerEvents = "auto";
        elemento.style.opacity = 1;
        jotason.isOn = !jotason.isOn;
    }
}

// document.addEventListener('blur', () => {
//     variable.forEach(element => {
//         document.getElementById(element.id).style.pointerEvents = "none";
//         document.getElementById(element.id).style.opacity = 0;
//         element.isOn = false;
//     });
// }, true);

let info;

async function hola() {
    info = await fetch('')
    info.json()

}



const registro = (id, hora, description) => {
    return `
    <div class="historial__registro" id="historial${id}">
        <div class="historial__registro__info">
            <div class="registro__texto">
                <div class="historial__registro__hora">
                    <span class="parrafo">${hora}</span>
                </div>

                <div class="historial__registro__accion">
                    <span class="parrafo">${description}</span>
                </div>
            </div>

            <div class="historial__registro__iconos">
                <div class="historial__registro__imagen">
                    <img src="../Images/Camara registro historial.png" alt="Camara registro historial">
                </div>

                <div class="historial__registro__opciones">
                    <button dataid="${id}" class="historial__registro__opciones__boton"><img src="../Images/Opciones registro historial.png" alt=""></button>

                    <div class="input invisible" id="button${id}">
                        <button class="value descargar">
                            <img src="../Images/icono descargar.png" alt="">                           
                            Descargar
                        </button>
                        <button class="value eliminar" dataid="${id}" onclick="console.log('hola')">
                            <img src="../Images/Icono tacho de basura.png" alt="">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="historial__registro__linea">
            
        </div>
    </div>`
}

const updateClick = () => {
    Array.from(document.getElementsByClassName('historial__registro__opciones__boton')).forEach((element) => {
        const id = element.getAttribute("dataid");

        console.log(element);

        element.addEventListener("click", (e) => {
            Ocultar(variable.find(x => x.id == `button${id}`));
        });
    });
    console.log("AAAAAAA")
}

const ocultarVariable = () => {
    let array = []
    Array.from(document.getElementsByClassName('historial__registro__opciones__boton')).forEach(element => {
        const id = element.getAttribute("dataid");

        array.push({
            id: `button${id}`,
            isOn: false
        })
    });
    return array;
};


/*
Averiguar la manera de hacer un array con lo que venga del fetch
Aprender como crear nuevos registros y meterle la informacion del fetch


Cosas que me dice chami que haga:
- Fetch on informacion que me puede legar a llegar
-
*/

function agregaEvento() {
    Array.from(document.getElementsByClassName('eliminar')).forEach(element => {
        console.log(element);
        console.log("aaaa");
        element.addEventListener("click", () => {
            console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
            const id = element.getAttribute("dataid");

            const node = document.getElementById(`historial${id}`);
            if (node.parentNode) {
                node.parentNode.removeChild(node)
            }
        });
    });
}


document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById("historial").innerHTML = registro(1, "13:50", "Hola");
    document.getElementById("historial").innerHTML += registro(2, "14:50", "Hello");
    document.getElementById("historial").innerHTML += registro(3, "14:50", "Shalom");
    document.getElementById("historial").innerHTML += registro(4, "14:50", "Chiao");
    document.getElementById("historial").innerHTML += registro(5, "14:50", "Bonasera");

    variable = ocultarVariable();
    console.log(variable);
    agregaEvento();
    updateClick();
});


//Hacer un overlay invisible desde html que este arriba de todo el css con z index 
//pero abajo del pop up, cuando se aprieta cualquier boton del pop up hacer que se 
//corra lo que quiero que haga y despues al final se llame a la funcion ocultar, 
//si se clickea el overlay tambien llamar a la funcion ocultar y ocultarse a si mismo
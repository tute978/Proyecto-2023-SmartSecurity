import { changeProfileImports, sendRefreshToken } from '../Functions/auth.js';

changeProfileImports();

let accessToken = sessionStorage.getItem('accessToken');
let variable;

document.getElementById('overlay').addEventListener('click', (overlay) => {
    const objeto = document.getElementById(overlay);
    Ocultar(variable.find(x => x.isOn === true));
});

function Ocultar(jotason) {
    const elemento = document.getElementById(jotason.id);
    
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

        element.addEventListener("click", () => {
            const id = element.getAttribute("dataid");

            const node = document.getElementById(`historial${id}`);
            if (node.parentNode) {
                node.parentNode.removeChild(node)
                document.getElementById("overlay").style.pointerEvents = "none";
                //fetch que mande el id del registro y lo elimine
            }
        });
    });
}








document.addEventListener("DOMContentLoaded", async () => {
    let result = await fetch('http://localhost:3000/hist/register', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    if(result.status != 200){
        sendRefreshToken();
        location.href("./");
    }

    result = await result.json();

    for(let i = 0; i < result.length; i++){ 
        let hora = result[i].hour;
        let descripcion = result[i].description;
        let id = result[i].id;

        document.getElementById("historial").innerHTML += registro(id, hora, descripcion);
    }

    variable = ocultarVariable();
    agregaEvento();
    updateClick();
});







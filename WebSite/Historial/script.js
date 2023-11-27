import { changeProfileImports} from '../Functions/auth.js';

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
                        <button class="value eliminar" dataid="${id}"">
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

        element.addEventListener("click", (e) => {
            Ocultar(variable.find(x => x.id == `button${id}`));
        });
    });
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




async function agregaEvento() {
    Array.from(document.getElementsByClassName('eliminar')).forEach(element => {

        element.addEventListener("click", () => {
            const id = element.getAttribute("dataid");

            const node = document.getElementById(`historial${id}`);
            if (node.parentNode) {
                node.parentNode.removeChild(node)
                document.getElementById("overlay").style.pointerEvents = "none";
                eliminarRegistro(id);
            }
        });
    });
}

async function eliminarRegistro(id){
    let res = await fetch('http://localhost:3000/hist/register/delete', {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            id: id
        })
    })
}






document.addEventListener("DOMContentLoaded", async () => {
    let result = await fetch('http://localhost:3000/hist/register', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    let hora;
    let descripcion;
    let id;


    result = await result.json();

    for(let i = 0; i < result.length; i++){ 
        hora = result[i].hour;
        descripcion = result[i].description;
        id = result[i].id;

        document.getElementById("historial").innerHTML += registro(id, hora, descripcion);
    }

    variable = ocultarVariable();
    agregaEvento();
    updateClick();
});







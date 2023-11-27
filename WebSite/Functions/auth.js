async function changeProfilePic(accessToken, div, callback){

    const result = await fetch('http://localhost:3000/login', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    
    if(result.status != 200) return;

    const data = await result.json();
    let mail = data.email;
    mail = mail.toUpperCase();

    div.innerHTML = profilePic(mail[0]);

    callback();
}

const profilePic = (letra) => {
    return `
    <div class="perfil" id="perfil__user">
            <span class="perfil__letra">${letra}</span>
        </div>  `
}

function intercalar(a){
    if(a.style.opacity == 0){
        overlay.style.pointerEvents = "auto";
        a.style.opacity = 1;
        a.style.pointerEvents = "auto";
    }
    else{
        overlay.style.pointerEvents = "none";
        a.style.opacity = 0;
        a.style.pointerEvents = "none";
    }
}

export function changeProfileImports() {
    const accessToken = sessionStorage.getItem('accessToken');

    const miDiv = document.getElementById("foto-de-perfil");
    const overlay = document.getElementById('overlay');
    const opciones = document.getElementById("opciones__perfil");
    const opciones__cerrarSesion = document.getElementById("opciones__cerrar-sesion");
    const opciones__eliminarCuenta = document.getElementById("opciones__eliminar-cuenta");

    document.addEventListener("DOMContentLoaded", changeProfilePic(accessToken, miDiv, () => {
        const perfil_user = document.getElementById('perfil__user');

        perfil_user.addEventListener("click", () => {
            intercalar(opciones);
        });
        
        overlay.addEventListener("click", () => {
            overlay.style.pointerEvents = "none";
            opciones.style.opacity = 0;
            opciones.style.pointerEvents = "none";
        });

        opciones__eliminarCuenta.addEventListener("click", () =>{
            location.href("../Delete-Account/")
        });
        opciones__cerrarSesion.addEventListener("click", () => {
            //elimino el refresh token para que la unica manera de iniciar sesion sea iniciando desde cero, 
            //tambien redirige a la página principal
            console.log('fortnite clip');
        });
    }));
}


export async function sendRefreshToken(){
    let result = await fetch('http://localhost:3000/token', {
        method: "GET",
        credentials: 'include'
    });

    if(result.status != 200){
        location.href("../Inicio/")
    }

    result = await result.json();
    sessionStorage.setItem('accessToken', result);
}
//ejecutar cada vez que pida informacion y el access token 
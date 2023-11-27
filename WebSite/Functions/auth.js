async function changeProfilePic(accessToken, div, callback){

    const result = await fetch('http://localhost:3000/login', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    
    if(result.status != 200) {
        sendRefreshToken(true);
        return;
    }

    const data = await result.json();
    let mail = data.email;
    mail = mail.toUpperCase();

    div.innerHTML = profilePic(mail[0]);

    let navbar_camara = document.getElementById("navbar__camara");
    let navbar_historial = document.getElementById("navbar__historial");
    let footer_camara = document.getElementById("footer_camara");
    let footer_historial = document.getElementById("footer_historial");
    
    navbar_camara.href="../Camara/";
    navbar_historial.href="../Historial/";
    footer_camara.href="../Camara/";
    footer_historial.href="../Historial/";

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
            location.href = "../Delete-Account/";
        });
        opciones__cerrarSesion.addEventListener("click", async () => {
            let resultado = await fetch('http://localhost:3000/logout', {
                method: "DELETE",
                credentials: 'include'
            });
            sessionStorage.removeItem('accessToken');
            if(resultado.status != 200){
                console.log("ERROR MUTANTE")
            }

            location.href="../Inicio/"
        });
    }));
}


export async function sendRefreshToken(reloadPage){
    let result = await fetch('http://localhost:3000/token', {
        method: "GET",
        credentials: 'include'
    });

    
    result = await result.json();
    sessionStorage.setItem('accessToken', result);

    if(reloadPage){
        document.location.reload();
    }
}
//ejecutar cada vez que pida informacion y el access token 
let accesToken = sessionStorage.getItem('accessToken');

let miDiv = document.getElementById("foto-de-perfil");

async function changeProfilePic(){

    const result = await fetch('http://localhost:3000/login', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accesToken}`
        }
    })
    
    if(result.status != 200) return;
    
    const data = await result.json();
    let mail = data.email;
    mail = mail.toUpperCase();

    if (accesToken != null){
        miDiv.innerHTML = profilePic(mail[0]);
    }

    const perfil_user = document.getElementById("perfil_user");
    perfil_user.addEventListener("click", () => {
        intercalar(opciones);
    });

    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click", () => {
        intercalar(opciones);
    });
}

//overlay.addEventListener('click',intercalar(opciones));

document.addEventListener("DOMContentLoaded", changeProfilePic())

const profilePic = (letra) => {
    return `
    <div class="perfil" id="perfil_user">
            <span class="perfil__letra">${letra}</span>
        </div>  `
}

let opciones = document.getElementById("opciones__perfil");
opciones.style.opacity = 0;
opciones.style.pointerEvents = "none";




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

function moveToRegister(){
    location.href = "../Register-Page/";
}

const eliminarCuenta = document.getElementById("opciones__eliminar-cuenta");

eliminarCuenta.addEventListener('click', () => {
    location.href = "../Delete-Account";
});
import { sendRefreshToken} from '../Functions/auth.js';

var checkbox = document.getElementById("seguro");
let form = document.getElementById("delete-account-form");
let password = document.getElementById("password").value;
let miDiv = document.getElementById("delete-account__p");
let accessToken = sessionStorage.getItem('accessToken');
let isOn = false;
let boton_eliminar = document.getElementById("boton-eliminar");


boton_eliminar.addEventListener('click',validarCheckbox);

checkbox.addEventListener('change', () =>{
    var checked = checkbox.checked;
    if(checked){
        miDiv.innerHTML = "¿Estas seguro de que quieres eliminar tu cuenta?";
    }
});

function validarCheckbox(){
    var checked = checkbox.checked;
    if (checked){
        miDiv.innerHTML = "¿Estas seguro de que quieres eliminar tu cuenta?";
        isOn = true;
    }
    else{
        miDiv.innerHTML = "Contraseña o Checkbox Incompletos";
        isOn = false;
    }
}

async function deleteAccount(e){
    e.preventDefault();
    if(isOn){
        const result = await fetch('http://localhost:3000/deleteAccount', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "Applcation/json"
            },
            body: JSON.stringify({
                password: e.target[0].value
            })
        });

        if(result.status != 200){
            //location.reload();
            console.log(result.status);
        }
    }
    else{
        console.log("mariquita");
    }
    console.log("neymar");
}



form.addEventListener('submit', deleteAccount);

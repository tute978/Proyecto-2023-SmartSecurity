var checkbox = document.getElementById("seguro");
console.log(checkbox);
let form = document.getElementById("delete-account-form");
let password = document.getElementById("password").value;
let miDiv = document.getElementsByClassName("delete-account__p");
let accessToken = sessionStorage.getItem('accessToken');
let isOn = false;


checkbox.addEventListener('change',validarCheckbox,false);

function validarCheckbox(){
    var checked = checkbox.checked;
    if (checked){
        console.log("el checkbox esta seleccionado");
        isOn = true;
    }
    else{
        console.log("el checkbox no esta seleccionado");
        isOn = false;
    }
}

async function deleteAccount(e){
    e.preventDefault();
    if(isOn){
        const result = await fetch('http://localhost:3000/deleteAccount', {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "Applcation/json"
            },
            body: JSON.stringify({
                password: e.target[0].value
            })
        });
        console.log(password);
    }
}








// async function deleteForm(e) {
//     e.preventDefault();
        // if(checkboxMarcado){
        //     console.log("siquiriquitum")
        //     const result = await fetch('http://localhost:3000/deleteAccount', {
        //         method: "DELETE",
        //         headers: {
        //             "Authorization": `Bearer ${accessToken}`,
        //             "Content-Type": "Applcation/json"
        //         },
        //         body: JSON.stringify({
        //             password: e.target[0].value
        //         })
        //     });
        //     console.log("asdfghjkljhgfdfghjkijhgf");
        //     console.log(result.status)
        //     if(result.status){

//             }
//         }
//         else{
//         /* cambio un div por otro que diga cual es el error */
//             console.log("contra o check inco");
//             miDiv.innerHTML("Contraseña o Checkbox Incompletos");
//         }
// }

form.addEventListener('submit', deleteAccount);

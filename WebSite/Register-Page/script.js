const registerForm = document.getElementById("registerForm")




async function registerFormFunc(e){
    e.preventDefault();
    const res = await fetch('http://localhost:3000/register', {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            name: e.target[0].value,
            surname: e.target[1].value,
            email: e.target[2].value,
            password: e.target[3].value,
            confirmPassword: e.target[4].value
        })
    });
        // .then(res => res.json())
        // .thenc(data => console.log(data))
        // .catch(error => console.log(error));

    const data = await res.json();
    console.log(data)
    

    if(data.success){
        console.log("SIIIISSIIIISISIS");
        location.href="../Inicio/"
        sessionStorage.setItem('accessToken', data.accessToken);
    }
    else{
        let mensaje = data.message;
        let miDiv = document.getElementById("error");
        console.log("NONONONNNONOOONONON");
        console.log(miDiv)
        miDiv.innerHTML = mensaje;
        scrollToTop();
    }
}
registerForm.addEventListener("submit", registerFormFunc)

function btnLogin(a){
    location.href=a;
}

const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Hace que el desplazamiento sea suave
    });
  };
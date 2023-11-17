const loginForm = document.getElementById("loginForm")
async function loginFormFunc(e){
    e.preventDefault();
    const res = await fetch('http://localhost:3000/login', {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"     
        },
        body: JSON.stringify({
            email: e.target[0].value,
            password: e.target[1].value
        })
    });
        // .then(res => res.json())
        // .then(data => console.log(data))
        // .catch(error => console.log(error));

    const data = await res.json();
    console.log(data);
    let mensajeError = document.getElementById("mensaje-de-error");
    console.log(mensajeError);
    mensajeError.innerHTML = data.message;
    scrollToTop();

    if(data.success){
        console.log(data)
        sessionStorage.setItem('accessToken', data.accessToken);
        location.href="../Inicio/";
    }
}
loginForm.addEventListener("submit", loginFormFunc)

function btnRegister(a){
    location.href=a;
}

const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Hace que el desplazamiento sea suave
    });
  };
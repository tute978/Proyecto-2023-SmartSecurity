const loginForm = document.getElementById("loginForm")
async function loginFormFunc(e){
    e.preventDefault();
    const res = await fetch('http://localhost:3000/users', {
        method: "POST",
        body: JSON.stringify({
            email: e.target[0].value,
            password: e.target[1].value
        })
    });
        // .then(res => res.json())
        // .then(data => console.log(data))
        // .catch(error => console.log(error));
    const data = await res.json();
    console.log(data)
}
loginForm.addEventListener("submit", loginFormFunc)
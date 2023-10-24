let variable = false;
const array = ['1', '2', '3'];

array.forEach(element => {
    document.getElementById(element).style.pointerEvents = "none";
});

function Ocultar(id) {
    const elemento = document.getElementById(id);

    if (variable) {
        elemento.style.opacity = 0;
        elemento.style.pointerEvents = "none";
        variable = false;
    } else {
        elemento.style.opacity = 1;
        elemento.style.pointerEvents = "auto";
        variable = true;
    }
}

document.addEventListener('blur', () => {
    array.forEach(element => {
        document.getElementById(element).style.pointerEvents = "none";
        document.getElementById(element).style.opacity = 0;
        variable = false;
    });
}, true);
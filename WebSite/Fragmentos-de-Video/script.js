import {changeProfileImports} from '../Functions/auth.js';
changeProfileImports();

let id = sessionStorage.getItem('videoID');
let accessToken = sessionStorage.getItem('accessToken');
let source = document.getElementById('video__sourceID');


async function getFileName(id){
    const res = await fetch('http://localhost:3000/hist/register/video', {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            id: id
        })
    });

    const data = await res.json();
    const video = data.videoName;
    return video;
}

document.addEventListener('DOMContentLoaded',async () => {
    let source = document.getElementById('video__sourceID');
    source.src = `http://localhost/Proyecto-2023-SmartSecurity/CameraFiles/${await getFileName(id)}`;
});
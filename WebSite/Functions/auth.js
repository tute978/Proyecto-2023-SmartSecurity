async function checkAccessToken(accessToken){
    const result = await fetch('http://localhost:3000/login', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accesToken}`
        }
    })
    
    if(result.status != 200) return false;
    else return true;
}

module.exports = {checkAccessToken};
async function performHTTPRequest(url){
    let response = await fetch(url);
    if(response.status != 200) {
        throw new Error("Server Error");
    }
    let plain_text = await response.text();

    return plain_text;
}
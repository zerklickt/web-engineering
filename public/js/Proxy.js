function urlViaApiProxy(url ){
    return "http://" + location.host + "/api-proxy/?" + url;
}

function urlViaProxy(url){
    return "http://" + location.host + "/proxy/?" + url;
}
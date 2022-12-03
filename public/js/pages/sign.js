//parts of this code are from stackoverflow.com (altered)
var canvas;
var context;
var isInBounds = false;
var cWidth = 0, cHeight = 0;
var prevX = 0, prevY = 0;
var currX = 0, currY = 0;
var flag = false, dot_flag = false;

var canDownload = false, isCleared = true;

//adapt canvas size when screen size changes
window.addEventListener("resize", function (event){
    context.canvas.width = document.getElementById('sign-field').offsetWidth;
    context.canvas.height = document.getElementById('sign-field').offsetHeight;
});

window.onload = function(){
    canvas = document.getElementById('sign-field');
    context = canvas.getContext('2d');
    context.canvas.width = 850;  //default canvas size
    context.canvas.height = 350; //

    cHeight = canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
    cWidth = canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left;

    //handle mouse events
    canvas.addEventListener("mousemove", function (e) {
        process('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        process('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        process('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        process('out', e)
    }, false);

    //handle touch events
    canvas.addEventListener("touchstart", function(e){
        processTouch('down', e);
    }, false);
    canvas.addEventListener("touchend", function(e){
        processTouch('up', e);
    }, false);
    canvas.addEventListener("touchmove", function(e){
        processTouch('move', e);
    }, false);
}

function process(action, e){
    if (action == 'down') {
        isCleared = false;
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.getBoundingClientRect().left;
        currY = e.clientY - canvas.getBoundingClientRect().top;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            context.beginPath();
            context.fillStyle = "black";
            context.fillRect(currX, currY, 2, 2);
            context.closePath();
            dot_flag = false;
        }
    }
    if (action == 'up' || action == "out") {
        flag = false;
    }
    if (action == 'move') {
        if (flag) {
            isCleared = false;
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.getBoundingClientRect().left;
            currY = e.clientY - canvas.getBoundingClientRect().top;
            draw();
        }
    }
}

function processTouch(action, e){
    if (action == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.offsetX;
        currY = e.offsetY;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            context.beginPath();
            context.fillStyle = "black";
            context.fillRect(currX, currY, 2, 2);
            context.closePath();
            dot_flag = false;
        }
    }
    if (action == 'up' || action == "out") {
        flag = false;
    }
    if (action == 'move') {
        if (flag) {
            isCleared = false;
            prevX = currX;
            prevY = currY;
            currX = e.touches['0'].clientX - canvas.getBoundingClientRect().left;
            currY = e.touches['0'].clientY - canvas.getBoundingClientRect().top;
            draw();
        }
    }
}

function draw() {
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currX, currY);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
}

function resetCanvas() {
    context.clearRect(0, 0, 850, 350);
    isCleared = true;
    canDownload = false;
}

function showPopup(){
    document.getElementById('popup').style.display = 'flex';
    document.querySelector("html").style.overflow = "hidden";
    document.querySelector("body").style.overflow = "hidden";
    //adapt canvas size to size on screen
    context.canvas.width = document.getElementById('sign-field').offsetWidth;
    context.canvas.height = document.getElementById('sign-field').offsetHeight;
}

function closePopup(){
    document.getElementById('popup').style.display = 'none';
    document.querySelector("html").style.overflow = "auto";
    document.querySelector("body").style.overflow = "auto";
}

function cancel(){
    resetCanvas();
    closePopup();
}

//shows image on page
function displayImg(){
    var dataURL = canvas.toDataURL("image/png");
    document.getElementById('img-out').setAttribute("src", dataURL);
    document.getElementById('img-out').style.display = 'block';
    canDownload = true;
}

//downloads image to computer
function exportImg(){
    //code from stackoverflow.com  (question #11112321)
    if(!canDownload){
        alert("Es wurde keine Unterschrift erstellt!");
        return;
    }
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'signature.png');
    canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    });
}

//displays signature in a new browser tab
function viewInBrowser(){
    if(!canDownload){
        alert("Es wurde keine Unterschrift erstellt!");
        return;
    }
    var dataURL = canvas.toDataURL("image/png");
    var newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
    window.open(canvas.toDataURL('image/png'));
}
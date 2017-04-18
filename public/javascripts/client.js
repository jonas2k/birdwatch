window.onload = function() {
    var sensorButton = document.getElementById("sensorButton");

    sensorButton.onclick = () => {

        swapColor(sensorButton);
        //TODO: toogle event listener in app.js
        //http://stackoverflow.com/questions/14951251/how-to-call-node-js-server-side-method-from-javascript
    };
}

function swapColor(sensorButton) {
    if(sensorButton.classList.contains("btn-danger")) {
            sensorButton.classList.remove("btn-danger");
            sensorButton.classList.add("btn-success");
        } else if(sensorButton.classList.contains("btn-success")) {
            sensorButton.classList.remove("btn-success");
            sensorButton.classList.add("btn-danger");
        }
}
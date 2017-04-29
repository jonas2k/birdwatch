window.addEventListener('load', () => {
    socket = io();

    var sensorButton = document.getElementById("sensorButton");

    sensorButton.onclick = () => {
        socket.emit("ToggleSensors");
        swapColor(sensorButton);
    };
    
    $('#shutDown').click(() => {
        socket.emit("ShutDown");
    });

})

function swapColor(sensorButton) {
    if (sensorButton.classList.contains("btn-danger")) {
        sensorButton.classList.remove("btn-danger");
        sensorButton.classList.add("btn-success");
    } else if (sensorButton.classList.contains("btn-success")) {
        sensorButton.classList.remove("btn-success");
        sensorButton.classList.add("btn-danger");
    }
} 

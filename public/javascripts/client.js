window.onload = function () {
    var socket = io();

    socket.on("connect", () => {
        socket.emit("getWatcherState");
        socket.on("returnWatcherState", (state) => {
            state.watcherState ? setSensorButtonActive() : setSensorButtonInactive();
        })
    });

    var sensorButton = document.getElementById("sensorButton");

    sensorButton.onclick = () => {
        socket.emit("ToggleSensors");
        swapColor(sensorButton);
    };
}

function setSensorButtonActive() {
    if (sensorButton.classList.contains("btn-danger")) {
        sensorButton.classList.remove("btn-danger");
        sensorButton.classList.add("btn-success");
    }
}

function setSensorButtonInactive() {
    if (sensorButton.classList.contains("btn-success")) {
        sensorButton.classList.remove("btn-success");
        sensorButton.classList.add("btn-danger");
    }
}

function swapColor(sensorButton) {
    if (sensorButton.classList.contains("btn-danger")) {
        sensorButton.classList.remove("btn-danger");
        sensorButton.classList.add("btn-success");
    } else if (sensorButton.classList.contains("btn-success")) {
        sensorButton.classList.remove("btn-success");
        sensorButton.classList.add("btn-danger");
    }
}
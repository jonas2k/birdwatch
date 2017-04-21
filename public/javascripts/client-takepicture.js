window.addEventListener('load', () => {
    var savePictureButton = document.getElementById("savePictureButton");
    var liveViewButton = document.getElementById("liveViewButton");
    var pictureViewDiv = document.getElementById("pictureViewDiv");
    var pictureViewAnchor = document.getElementById("pictureViewAnchor");
    var pictureViewImg = document.getElementById("pictureViewImg");

    savePictureButton.onclick = () => {
        socket.emit("savePicture");
    };

    liveViewButton.onclick = () => {
        socket.emit("liveView");
    };

    socket.on("savePictureReturn", (data) => {
        var imagePath = "/photos/" + data.filename;
        pictureViewAnchor.href = imagePath;
        pictureViewImg.src = imagePath;
        $(pictureViewDiv).removeClass('hidden');
    });
})
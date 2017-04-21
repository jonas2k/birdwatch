window.addEventListener('load', () => {
    socket.on("RefreshGalleryView", () => {
        window.location.reload(true);
    })
});
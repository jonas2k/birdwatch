window.addEventListener('load', () => {
    socket.on("RefreshGalleryView", (images) => {
        $('#gallery-container').empty();
        $.each(images, (index, value) => {
            $('<img />').attr({
                src: value
            }).appendTo($('<a />').attr({
                href: value,
                class: "thumbnail"
            }).appendTo($('<div />').attr({
                class: 'col-sm-2 col-md-3 col-lg-3'
            }).appendTo($('#gallery-container'))));
        });
    });
});
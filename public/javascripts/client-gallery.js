window.addEventListener('load', () => {

    socket.on("RefreshGalleryView", (images) => {
        $('#gallery-container').empty();
        $.each(images, (index, value) => {
            $('#gallery-container').append(
                $('<div />').attr({ class: 'col-sm-2 col-md-3 col-lg-3 text-center' }).append(
                    $('<a />').attr({ href: value, class: "thumbnail nomargin" }).append(
                        $('<img />').attr({ src: value })
                    )
                ).append(
                    $('<button />').attr({ id: value, value: value, class: "btn btn-xs twitterbutton", "data-image": value, "data-toggle": "modal", "data-target": "#tweetConfirmation" }).append(
                        $('<img />').attr({ class: "twitterbuttonimage", src: "images/twitter.png" })
                    )
                    )
            )
        });
        setupModal();
    });
    setupModal();
});

function setupModal() {
    $("#tweetConfirmation").on('show.bs.modal', function (event) {
        var image = $(event.relatedTarget).data('image');
        $(this).find('#modalSendButton').off("click").click(function () {
            var message = $(this).parent().prev().find('#tweetText').val();
            socket.emit("tweetPic", { image: image, message: message });
        });
    });

    socket.on("TweetReturn", function (data) {
        if (data) {
            $('#tweetSuccessLink').attr({ href: data });
            $('#tweetSuccess').modal();
        } else {
            $('#tweetFailure').modal();
        }
    });
}
$(document).ready(function() {
    $("#scan-qr-button").click(function() {
        $("#scanner-div").removeClass("d-none");
        $("#home-page-options").addClass("d-none");
        $('#reader').html5_qrcode(function(data) {
                $('#result').html(data);
                $("#reader").addClass("d-none");
                $("#loading-icon").removeClass("d-none");
                $("barcode-msg").addClass("d-none");
            },
            function(error) {
                // $('#error').html("Scanning...");
            },
            function(videoError) {
                $('#error').html("Camera error.");
            }
        );
    });
});

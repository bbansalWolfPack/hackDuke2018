$(document).ready(function() {
    $("#scan-qr-button").click(function() {
        $("#scanner-div").removeClass("hide");
        $("#home-page-options").addClass("hide");
        $('#reader').html5_qrcode(function(data) {
                $('#result').html(data);
                $("#reader").hide();
                $("#loading-icon").show();
                $("barcode-msg").hide();
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

$(document).ready(function() {
    $("#scan-qr-button").click(function() {
        $("#scanner-div").removeClass("d-none");
        $("#home-page-options").addClass("d-none");
        $('#reader').html5_qrcode(function(data) {
          let userEmail = data;
          $("#scanner-div").addClass("d-none");
          $( "#scan-tab" ).removeClass("active");
          $( "#scan-tab" ).addClass("disabled");
          $( "#select-tab" ).removeClass("disabled");
          $('#select-tab a[href="#select"]').tab('show');
          $('#select-tab').click();
          $.ajax({
            url: "https://hackduke2018server.appspot.com/userDetails",
            type: "get",
            data: {
              userEmail
            },
            success: function(response) {
              let displayName = `User: ${response.firstName} ${response.lastName}`;
              let goGreenScoreDisplayText = `Go Green Score: ${response.goGreenScore}`;
              let totalVisitsDisplayText = `Total Visits till date: ${response.totalVisits}`;
              let visitsWithEBill = `Total eco-friendly visits: ${response.eBillVisits}`;
              let visitsWithPaperBill;
              let paperBillVisits = response.totalVisits - response.eBillVisits;
              if (paperBillVisits > 0) {
                visitsWithPaperBill =  `Total non-eco-friendly visits: ${paperBillVisits}`;
              }
              console.log("User information retrieved succesfully");
              setTimeout(function () {
                $("#loading-div").addClass("d-none");
                $("#user-info-div" ).removeClass("d-none");
                $("#user-info-header").text(displayName);
                $("#user-info-details1").text(goGreenScoreDisplayText);
                $("#user-info-details2").text(totalVisitsDisplayText);
                $("#user-info-details3").text(visitsWithEBill);
              }, 3000);
            },
            error: function(xhr) {
              console.log("failed to get user information");
            }
          });
        },
        function(error) {
          // $('#error').html("Scanning...");
        },
        function(videoError) {
          $('#error').html("Camera error.");
        }
      );
    });

    $("#enter-email-button").click(function() {
      $("#email-div").removeClass("d-none");
      $("#home-page-options").addClass("d-none");
    });

    $("#email-submit").click(function() {
      var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      if($('#exampleInputEmail').length && $('#exampleInputEmail').val().length && testEmail.test($('#exampleInputEmail').val())) {
        let givenEmail = $("#exampleInputEmail").val();
        $("#email-div").addClass("d-none");
        $( "#scan-tab" ).removeClass("active");
        $( "#scan-tab" ).addClass("disabled");
        $( "#select-tab" ).removeClass("disabled");
        $('#select-tab a[href="#select"]').tab('show');
        $('#select-tab').click();

        $.ajax({
          url: "https://hackduke2018server.appspot.com/userDetails",
          type: "get",
          data: {
            userEmail: givenEmail
          },
          success: function(response) {
            if (response) {
              $('#select-email-div').removeClass('d-none');
              $("#email-loading-div").addClass("d-none");
              let displayName = `User: ${response.firstName} ${response.lastName}`;
              let goGreenScoreDisplayText = `Go Green Score: ${response.goGreenScore}`;
              let totalVisitsDisplayText = `Total Visits till date: ${response.totalVisits}`;
              let visitsWithEBill = `Total eco-friendly visits: ${response.eBillVisits}`;
              let visitsWithPaperBill;
              let paperBillVisits = response.totalVisits - response.eBillVisits;
              if (paperBillVisits > 0) {
                visitsWithPaperBill =  `Total non-eco-friendly visits: ${paperBillVisits}`;
              }
              console.log("User information retrieved succesfully");
              setTimeout(function () {
                $("#loading-div").addClass("d-none");
                $("#user-info-div" ).removeClass("d-none");
                $("#user-info-header").text(displayName);
                $("#user-info-details1").text(goGreenScoreDisplayText);
                $("#user-info-details2").text(totalVisitsDisplayText);
                $("#user-info-details3").text(visitsWithEBill);
              }, 3000);
            } else {
              $('#select-scan-div').addClass('d-none');
              $('#select-email-div').removeClass('d-none');
              setTimeout(function () {
                $("#email-loading-div").addClass("d-none");
                $('#user-email-entered-info-div').removeClass('d-none');
              }, 3000);
            }
          },
          error: function(xhr) {
            console.log("failed to get user information");
          }
        });
      }
    })
});


// $.ajax({url: "https://hackduke2018server.appspot.com/userDetails", success: function(result){
//   let userEmail = result.email;
//   let userScore = result.goGreenScore;
//  }});

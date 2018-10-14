var putData = {
  "firstName": "User",
  "oldScore": 50,
  "updateUser": true
};

var currentUserData = {
  "currentScore": 50,
  "currentTotalVisits": 0,
  "currentEBillVisits": 0
};
var donationAmount=0;

$(document).ready(function() {
  $.ajax({
    cache: false,
  });
    $("#scan-qr-button").click(function() {
        $("#scanner-div").removeClass("d-none");
        $("#home-page-options").addClass("d-none");
        $('#reader').html5_qrcode(function(data) {
          let userEmail = data;
          $.ajax({
            url: "https://hackduke2018serverbackup.appspot.com/userDetails",
            type: "get",
            data: {
              userEmail
            },
            success: function(response) {
              console.log(response);
              if (response) {
                $("#scanner-div").addClass("d-none");
                $( "#scan-tab" ).removeClass("active");
                $( "#scan-tab" ).addClass("disabled");
                $( "#select-tab" ).removeClass("disabled");
                $('#select-tab a[href="#select"]').tab('show');
                $('#select-tab').click();
                putData.userEmail =  userEmail;
                putData.firstName = response.firstName;
                putData.oldScore = response.goGreenScore;
                currentUserData = {
                  "currentScore": response.goGreenScore,
                  "currentTotalVisits": response.totalVisits,
                  "currentEBillVisits": response.eBillVisits
                }
                let displayName = `User: ${response.firstName} ${response.lastName}`;
                let goGreenScoreDisplayText = `Go Green Score: ${response.goGreenScore}`;
                let totalVisitsDisplayText = `Total Visits till date: ${response.totalVisits}`;
                let visitsWithEBill = `Total eco-friendly visits: ${response.eBillVisits}`;
                console.log("User information retrieved succesfully");
                setTimeout(function () {
                  $("#loading-div").addClass("d-none");
                  $("#user-info-div" ).removeClass("d-none");
                  $('#common-ngo-info').removeClass('d-none');
                  $("#user-info-header").text(displayName);
                  $("#user-info-details1").text(goGreenScoreDisplayText);
                  $("#user-info-details2").text(totalVisitsDisplayText);
                  $("#user-info-details3").text(visitsWithEBill);
                }, 3000);
              } else {
                alert("Invalid QR Code, please try email option and proceed ahead");
                location.reload();
              }
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
        putData.userEmail = givenEmail;
        let URL = "https://hackduke2018serverbackup.appspot.com/userDetails"
        console.log(URL);

        $.ajax({
          url: URL,
          type: "get",
          data: {
            userEmail: givenEmail
          },
          success: function(response) {
            if (response) {
              putData.email = response.email;
              putData.firstName = response.firstName;
              putData.oldScore = response.goGreenScore;
              currentUserData = {
                "currentScore": response.goGreenScore,
                "currentTotalVisits": response.totalVisits,
                "currentEBillVisits": response.eBillVisits
              }
              $('#select-email-div').removeClass('d-none');
              $("#email-loading-div").addClass("d-none");
              let displayName = `User: ${response.firstName} ${response.lastName}`;
              let goGreenScoreDisplayText = `Go Green Score: ${response.goGreenScore}`;
              let totalVisitsDisplayText = `Total Visits till date: ${response.totalVisits}`;
              let visitsWithEBill = `Total eco-friendly visits: ${response.eBillVisits}`;
              console.log("User information retrieved succesfully");
              setTimeout(function () {
                $("#loading-div").addClass("d-none");
                $("#user-info-div" ).removeClass("d-none");
                $('#common-ngo-info').removeClass('d-none');
                $("#user-info-header").text(displayName);
                $("#user-info-details1").text(goGreenScoreDisplayText);
                $("#user-info-details2").text(totalVisitsDisplayText);
                $("#user-info-details3").text(visitsWithEBill);
              }, 3000);
            } else {
              putData.updateUser = false;
              $('#select-scan-div').addClass('d-none');
              $('#select-email-div').removeClass('d-none');
              setTimeout(function () {
                $("#email-loading-div").addClass("d-none");
                $('#user-email-entered-info-div').removeClass('d-none');
                $('#common-ngo-info').removeClass('d-none');
              }, 3000);
            }
          },
          error: function(xhr) {
            console.log("failed to get user information");
          }
        });
      }
    });

    $('#email-receipt-button').click(function() {
      let totalVisits = currentUserData.currentTotalVisits + 1;
      let totalEBillVisits = currentUserData.currentTotalVisits + 1
      let paperBillVisits = totalVisits - totalEBillVisits;
      let newScore = 50 + (Math.log(totalVisits) / Math.log(2)) + 3 * (Math.log(totalEBillVisits) / Math.log(2)) - (paperBillVisits/2);
      putData.newScore = Math.round(newScore * 100) / 100;
      putData.eBill = true;
      $('#checkout-info').addClass("d-none");
      $('#sending-email-div').removeClass("d-none");
      $('#finish-paragraph-text-message').text('Sending you an e-copy of your bill');

      $.ajax({
        url: 'https://hackduke2018serverbackup.appspot.com/updateUser',
        data: putData,
        type: 'POST',
        success: function(response) {
          if (response) {
            setTimeout(function () {
              $('#sending-email-div').addClass("d-none");
              $('#success-modal').removeClass('d-none');
              $('#thank-you-message').text('Thank you for shopping with us and for protecting mother nature!');
            }, 2000);

            setTimeout(function() {
              location.reload();
            }, 5500);
          }
        }
      });
    });

    $('#print-receipt-button').click(function() {
      let totalVisits = currentUserData.currentTotalVisits + 1;
      let totalEBillVisits = currentUserData.currentTotalVisits;
      let paperBillVisits = totalVisits - totalEBillVisits;
      let newScore = 50 + (Math.log(totalVisits) / Math.log(2)) + 3 * (Math.log(totalEBillVisits) / Math.log(2)) - 3 * (paperBillVisits/2);
      putData.newScore = Math.round(newScore * 100) / 100;
      putData.eBill = false;
      console.log(putData);
      $('#checkout-info').addClass("d-none");
      $('#printing-bill-div').removeClass("d-none");
      $('#finish-paragraph-text-message-printing').text('Printing your receipt, please wait!');

      $.ajax({
        url: 'https://hackduke2018serverbackup.appspot.com/updateUser',
        data: putData,
        type: 'POST',
        success: function(response) {
          if (response) {
            setTimeout(function () {
              $('#printing-bill-div').addClass("d-none");
              $('#success-modal').removeClass('d-none');
              $('#thank-you-message').text('Thank you for shopping with us.');
            }, 2000);

            setTimeout(function() {
              location.reload();
            }, 5500);
          }
        }
      });
    });

    $('#ngo-list').change(function(e) {
       let selectedNgoCategory = $('#ngo-list option:selected').text();
       let ngoApiURL = "https://api.data.charitynavigator.org/v2/Organizations?app_id=11c35b83&app_key=f000f0d35d35033f3a9c7e15ed57f15b&pageSize=4&search=".concat(selectedNgoCategory).concat("&rated=true&minRating=3");
       $.ajax({
         url: ngoApiURL,
         type: 'get',
         success: function(response) {
           $('#ngo-checkbox-list').removeClass('d-none');
           // $('#common-ngo-section').removeClass('d-none');
           response.forEach((charity, index) => {
             let ngoSelected = `ngo${index}`;
             $(`#${ngoSelected}`).text(charity.charityName);
             $(`#${ngoSelected}`).attr("href", charity.websiteURL);
           })
         },
         error: function(xhr) {
           console.log("failed to get ngo information");
         }
       });
    });

    $('#donate-and-proceed').click(function() {
      if ($("#ngo-list").val() === null) {
        alert("Please select a charity or continue using skip button");
      } else {
        donationAmount = 80;
        $('#user-email-entered-info-div').addClass('d-none');
        $('#user-info-div').addClass('d-none');
        $('#common-ngo-info').addClass('d-none');
        $( "#select-tab" ).removeClass("active");
        $('#checkout-info').removeClass("d-none");
        $("#select-tab" ).addClass("disabled");
        $("#checkout-tab" ).removeClass("disabled");
        $('#donation-amount-display').text(`Amount Donated: $0.${donationAmount}`);
        if (currentUserData.currentTotalVisits === 0) {
          // new user so score will not increase but can decrease
          let totalVisits = currentUserData.currentTotalVisits + 1;
          let eBillVisitsGoingNotGreen = currentUserData.currentEBillVisits;
          let paperBillVisitsGoingNotGreen = totalVisits - eBillVisitsGoingNotGreen;
          let newScoreNotGoingGreen = 50 + (Math.log(totalVisits) / Math.log(2)) - 3 * (paperBillVisitsGoingNotGreen/2);
          $('#current-score-display').text(`Your Current Go Green score is: ${currentUserData.currentScore}`);
          $('#non-green-affects-text').text(`Selecting a printed copy will decrease your Go Green score to: ${newScoreNotGoingGreen}`);

        } else {
          let totalVisits = currentUserData.currentTotalVisits + 1;
          let eBillVisitsGoingGreen = currentUserData.currentEBillVisits + 1
          let eBillVisitsGoingNotGreen = currentUserData.currentEBillVisits;
          let paperBillVisitsGoingGreen = totalVisits - eBillVisitsGoingGreen;
          let paperBillVisitsGoingNotGreen = totalVisits - eBillVisitsGoingNotGreen;
          $('#current-score-display').text(`Your Current Go Green score is: ${currentUserData.currentScore}`);
          let newScoreGoingGreen = 50 + (Math.log(totalVisits) / Math.log(2)) + 3 * (Math.log(eBillVisitsGoingGreen) / Math.log(2)) - 3 * (paperBillVisitsGoingGreen/2);
          let newScoreNotGoingGreen = 50 + (Math.log(totalVisits) / Math.log(2)) + 3 * (Math.log(eBillVisitsGoingNotGreen) / Math.log(2)) - 3 * (paperBillVisitsGoingNotGreen/2);
          $('#go-green-benefit-text').text(`Selecting an e-copy will increase your Go Green score to: ${newScoreGoingGreen}`);
          $('#non-green-affects-text').text(`Selecting a printed copy will decrease your Go Green score to: ${newScoreNotGoingGreen}`);
        }
        $('#checkout-tab a[href="#checkout"]').tab('show');
        $('#checkout-tab').click();
      }
    });

    $('#skip-and-proceed').click(function() {
      $('#user-email-entered-info-div').addClass('d-none');
      $('#user-info-div').addClass('d-none');
      $('#common-ngo-info').addClass('d-none');
      $( "#select-tab" ).removeClass("active");
      $('#checkout-info').removeClass("d-none");
      $("#select-tab" ).addClass("disabled");
      $("#checkout-tab" ).removeClass("disabled");
      if (currentUserData.currentTotalVisits === 0) {
        // new user so score will not increase but can decrease
        let totalVisits = currentUserData.currentTotalVisits + 1;
        let eBillVisitsGoingNotGreen = currentUserData.currentEBillVisits;
        let paperBillVisitsGoingNotGreen = totalVisits - eBillVisitsGoingNotGreen;
        let newScoreNotGoingGreen = 50 + (Math.log(totalVisits) / Math.log(2)) - 3 * (paperBillVisitsGoingNotGreen/2);
        $('#current-score-display').text(`Your Current Go Green score is: ${currentUserData.currentScore}`);
        $('#non-green-affects-text').text(`Selecting a printed copy will decrease your Go Green score to: ${newScoreNotGoingGreen}`);

      } else {
        let totalVisits = currentUserData.currentTotalVisits + 1;
        let eBillVisitsGoingGreen = currentUserData.currentEBillVisits + 1
        let eBillVisitsGoingNotGreen = currentUserData.currentEBillVisits;
        let paperBillVisitsGoingGreen = totalVisits - eBillVisitsGoingGreen;
        let paperBillVisitsGoingNotGreen = totalVisits - eBillVisitsGoingNotGreen;
        $('#current-score-display').text(`Your Current Go Green score is: ${currentUserData.currentScore}`);
        let newScoreGoingGreen = 50 + (Math.log(totalVisits) / Math.log(2)) + 3 * (Math.log(eBillVisitsGoingGreen) / Math.log(2)) - 3 * (paperBillVisitsGoingGreen/2);
        let newScoreNotGoingGreen = 50 + (Math.log(totalVisits) / Math.log(2)) + 3 * (Math.log(eBillVisitsGoingNotGreen) / Math.log(2)) - 3 * (paperBillVisitsGoingNotGreen/2);
        $('#go-green-benefit-text').text(`Selecting an e-copy will increase your Go Green score to: ${newScoreGoingGreen}`);
        $('#non-green-affects-text').text(`Selecting a printed copy will decrease your Go Green score to: ${newScoreNotGoingGreen}`);
      }
      $('#checkout-tab a[href="#checkout"]').tab('show');
      $('#checkout-tab').click();
    });


});

//
// $.ajax({
//   url: 'http://localhost:3000/updateUser',
//   data: putData,
//   type: 'POST',
//   success: function(response) {
//     alert('Load was performed.');
//   }
// });

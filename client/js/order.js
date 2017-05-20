$(document).ready(function() {
    const socket = io();
    
    console.log("ready!");
    var startButton = document.getElementById("welcomeBut");
    
    $.ajax({
        url: "/isOpen",
        type: "post",
        success: function(response) {
            console.log("response recieved: " + response);
            checkStatus(response);
        }
    });
    
    socket.on("restaurantStatus", function(status) {
       console.log("status recieved: " + status);
       checkStatus(status); 
    });
    
    function checkStatus(status) {
        console.log("checking: " + status);
        if(status == true) {
            restaurantOpen();
        }
        else if (status == false) {
            restaurantClose();
        }
        else {
            console.log("error");
        }
    }
    function restaurantOpen() {
        startButton.innerHTML = "Click Here to Start Ordering";
        startButton.href = "/order";
    }
    function restaurantClose() {
        startButton.innerHTML = "We're sorry, but we are closed. Please try again later!";
        startButton.href = "null";
    }
});
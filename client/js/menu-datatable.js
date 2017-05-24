var dataSet = [];
var menuItems = [];
var time = new Date();
var categoryName = ["Main", "Side", "Drink"];
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
$('#tableUpdateTime').html("Last Update: " + time.toLocaleString("en-us",options));

$('#menuTable').html("Updating..");

function init() {
    $.ajax({
        url: "/menu-items",
        type: "POST",
        success: function(response) {
            for (let i = 0; i < response.length; i++){
                var text;
                if(response[i].active == true) {
                    text = "Enabled";
                } else if (response[i].active == false) {
                    text = "Disabled";
                } else {
                    console.log("Error");
                }
                let item = [];
                item.push(response[i].name);
                item.push(categoryName[parseInt(response[i].category) - 1]);
                item.push(response[i].description);
                item.push(response[i].kitchen_station_id);
                item.push(response[i].price);
                item.push("<button class='active' id='" + text + "'>" + text + "</button>");
                menuItems.push(item);
            }
            dataSet = menuItems;
        },
        async: true
    });
    
    setTimeout(function() {
        $('#menuTable').html("");
        $('#menuTable').DataTable({
            data: dataSet,
            columns: [
                {title: 'Name'},
                {title: 'Category'},
                {title: 'Description'},
                {title: 'Cook Station'},
                {title: 'Price'},
                {button: ''}
            ],
            lengthMenu: [[5, 10, -1], [5, 10, "All"]]
        });
        
    }, 1000);
}
$(document).ready(function(){
    init();
    
    $('#menuTable').on( 'draw.dt', function () {
        var active = document.getElementsByClassName("active");
        for(i = 0; i < active.length; i++) {
            active[i].addEventListener("click", function() {
                this.disabled = true;
                console.log("working");
                var temp = this;
                var item = this.parentNode.parentNode.childNodes[0].innerHTML;
                var isEnabled = this.innerHTML;
                if(isEnabled == "Disable?") {
                    isEnabled = true;
                } else if (isEnabled == "Enable?") {
                    isEnabled = false;
                }
                $.ajax({
                    url: "/admin/itemStatus",
                    type: "post",
                    data: {
                        item: item,
                        status: isEnabled
                    },
                    success: function(response) {
                        
                        console.log(response);
                        
                        var text;
                        if(response.status == true) {
                            text = "Enabled";
                            console.log(text)
                        } else if (response.status == false) {
                            text = "Disabled";
                            console.log(text)
                        } else {
                            console.log("Error");
                        }
                        console.log(this);
                        temp.disabled = false;
                        temp.id =  text;
                        temp.innerHTML = text;
                        
                        $.ajax({
                           url: "/updateMenu-items",
                            type: "post",
                            data: {
                                item: response.item,
                                status: response.status
                            },
                            success: function(response) {
                                console.log(response);
                            }
                        });
                        
                        for(i = 0; i < dataSet.length; i++) {
                            if(dataSet[i][0] == response.item) {
                                console.log(dataSet);
                                console.log("doing this");
                                dataSet[i][5] = "<button class='active' id='" + text + "'>" + text + "</button>"
                                menuItems[i][5] = "<button class='active' id='" + text + "'>" + text + "</button>"
                            }
                        }
                    }
                });
                showModal("Success!", "Item updated", 1);
            });
            
            active[i].addEventListener("mouseover", function() {
                if(this.innerHTML == "Enabled") {
                    this.innerHTML = "Disable?";
                } else if (this.innerHTML == "Disabled") {
                    this.innerHTML = "Enable?";
                }
            });
            active[i].addEventListener("mouseout", function() {
                if(this.innerHTML == "Disable?") {
                    this.innerHTML = "Enabled";
                } else if (this.innerHTML == "Enable?") {
                    this.innerHTML = "Disabled";
                }
            });
        }
    });
    
    
});
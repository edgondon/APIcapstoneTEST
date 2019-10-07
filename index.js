'use strict';

function checkValue(inputValue) {
  let outputValue = inputValue;
  if (inputValue == "") {
      outputValue = 0;
  }
  if (inputValue == undefined) {
      outputValue = 0;
  }
  if (inputValue == null) {
      outputValue = 0;
  }
  return outputValue;
}

function checkText(inputText) {
  let outputText = inputText;
  if (inputText == undefined) {
      outputText = "";
  }
  if (inputText == null) {
      outputText = "";
  }
  return outputText;
}

function checkURL(inputURL) {
  let outputURL = inputURL;
  if (inputURL == undefined) {
      outputURL = "/";
  }
  if (inputURL == null) {
      outputURL = "/";
  }
  return outputURL;
}






function initMap(json) {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10
    });
    let infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            longlat.push(pos);    
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


let longlat = [];
let addressGo = [];

function showEvents(json) {
    let nums = Math.min(json.page.size, json.page.totalElements);
    for(var i=0; i<nums; i++) {
      let output = "";
      if(json._embedded.events[i]._embedded.venues[0].state === undefined) {
        output = "no state";
      }
      else {
        output = json._embedded.events[i]._embedded.venues[0].state.stateCode;
          }
      $("#events").append(`<p>${checkText(json._embedded.events[i].name)}</p>
            <p>Date of Event: ${checkText(json._embedded.events[i].dates.start.localDate)}</p>
            <p>Distance in Miles: ${checkValue(json._embedded.events[i].distance)}</p>
            <p>Address: ${checkText(json._embedded.events[i]._embedded.venues[0].address.line1)}, ${checkText(json._embedded.events[i]._embedded.venues[0].city.name)}, ${checkText(output)}, ${checkValue(json._embedded.events[i]._embedded.venues[0].postalCode)}</p>
            <form id="form2">
            <input type="radio" id="start" class="helper" name="startaddress" value="${checkText(json._embedded.events[i]._embedded.venues[0].address.line1)}, ${checkText(json._embedded.events[i]._embedded.venues[0].city.name)}, ${checkText(json._embedded.events[i]._embedded.venues[0].state.stateCode)}, ${checkValue(json._embedded.events[i]._embedded.venues[0].postalCode)}">Get Directions</input>
            <button type="button" for="startaddress" onclick="displayRadioValue()"> 
                Submit 
            </button> 
            </form>
            <a href="${checkURL(json._embedded.events[i].url)}" target="_blank">Link for Tickets</a>
            `);
      
    }
  }






function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


// establish date range for search criteria - upon initial load of page (default values)
  function datesinConsole() {
    let now = new Date();
    let month = (now.getMonth() + 1);               
    let day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    let today = now.getFullYear() + '-' + month + '-' + day;
    console.log(today);

    let month2 = (now.getMonth() + 2);
    let today2 = now.getFullYear() + '-' + month2 + '-' + day;
    console.log(today2);


$('#form1').append(`
<label for="Radius">Enter Radius of Search in Miles</label>
<input type="number" id="radiuss" name="Radius" min="1" max="100" value="25" required>
<label for="State">FIRST DATE IN RANGE YYYY-MM-DD</label>
<input type="date" id="alpha" name="State" value="${today}" required>
<label for="numSearch">SECOND DATE IN RANGE YYYY-MM-DD</label>
<input type="date" id="omega" name="numSearch" value="${today2}">
<input type="submit"  value="Submit Request">`);

  
};


function infosubmit (alpha, omega, radiuss) {
    
    console.log(longlat);
    console.log(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&latlong=${longlat[0].lat},${longlat[0].lng}&unit=miles&radius=${radiuss}&startDateTime=${alpha}T08:00:00Z&endDateTime=${omega}T07:59:00Z&size=190`);
     $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?apikey=xBC9IrvS6UOYGWmTT1OSvOSVKpalT8XA&latlong=${longlat[0].lat},${longlat[0].lng}&unit=miles&radius=${radiuss}&startDateTime=${alpha}T08:00:00Z&endDateTime=${omega}T07:59:00Z&size=190`,
        async:true,
        dataType: "json",
        success: function(json) {
                    console.log(json);
                    let e = document.getElementById("events");
                    e.innerHTML = json.page.totalElements + " events found.";
                    showEvents(json);
                    
                 },
        error: function(xhr, status, err) {
                    console.log(err);
                 }
      }); 



}

function initMap2() {
    
    let directionsRenderer = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('right-panel'));


    if (document.getElementById('floating-panel')==null) {

    let control = document.getElementById('floating-panel');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
    else {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    }  

  }

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    let start = `${longlat[0].lat},${longlat[0].lng}`;
    console.log(`${addressGo}`);
    let end = `${addressGo}`;
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

function displayRadioValue() { 
    
  addressGo.length = 0;
    $('#right-panel').empty();
    let ele = $('.helper:checked').val(); 
    addressGo.push(ele);    
    console.log(ele);
    $('#events').addClass('hidden');
    initMap2();

    } 














function watchEnter() {
    datesinConsole();
    $('#form1').submit(event => {
        event.preventDefault();
        $('#right-panel').empty();
        $('.results').empty();
// each time user submits form on top of page the three values below are reset accordingly:
        let alpha = $('#alpha').val();
        let omega = $('#omega').val();
        let radiuss = $('#radiuss').val();
        addressGo.length = 0;
        
        
        $('#map').removeClass('hidden');
        $('#events').removeClass('hidden');
        infosubmit(alpha, omega, radiuss);
        
        console.log('hello');
        
    });

}

$(watchEnter);
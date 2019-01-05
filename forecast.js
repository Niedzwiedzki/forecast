document.addEventListener("DOMContentLoaded", function(){

    //variables for selection fields
    var countrySelection = document.getElementById("country");
    var citiesSelection = document.getElementById("cities");
    var checkButton = document.getElementById("check");
    
    //variables for selection table and index to interate through dates    
    var forecastTable = document.getElementById("tableHeader");
    
    //value of the selected country
    var valueCountry;
    
    //variables for table ith temperatures
    var rows = document.querySelectorAll(".forecastTable.temp")
    var weather = document.querySelectorAll(".icon")
    var hourIndex;
    
    //variables for dates in table header
    var headers = document.querySelectorAll('.days')
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    //pressure
    var pressure = 0;
    var pressureDisplay = document.getElementById("pressure")
                                                  
    //variable with data display
    var data = document.querySelectorAll('.weather')

    //variables to switch the columns on mobile devices
    nextArrow = document.getElementById("next");
    previousArrow = document.getElementById("previous");
    weekColumns = document.querySelectorAll(".week");
    dayIndex = 0;
    
    //function to fetch the weather data and request variable
    var spot;
    var fetchData = function(request){
        console.log('http://openweathermap.org/data/2.5/forecast?' + request + '&appid=b6907d289e10d714a6e88b30761fae22');
        fetch('http://openweathermap.org/data/2.5/forecast?' + request + '&appid=b6907d289e10d714a6e88b30761fae22')
            .then(response => response.json())
            .then((data) => {
            var forecast = data;
            
                var hour = forecast.list[0].dt_txt.replace(/\d{4}-\d{2}-\d{2} /, '');
                
                //checking what is the first hour in the json file in order to start filling the row in the correct place 
                if(hour == "00:00:00"){
                    hourIndex = 0;
                } else if (hour == "03:00:00"){
                    hourIndex = 1;
                } else if (hour == "06:00:00"){
                    hourIndex = 2;
                } else if (hour == "09:00:00"){
                    hourIndex = 3;
                } else if (hour == "12:00:00"){
                    hourIndex = 4;
                } else if (hour == "15:00:00"){
                    hourIndex = 5;
                } else if (hour == "18:00:00"){
                    hourIndex = 6;
                } else if (hour == "21:00:00"){
                    hourIndex = 7;
                }
            
                
                //filling the forecast table with temperatures and icons and adding pressures
            for(var i = 0; i < forecast.list.length; i++){                
                rows[i + hourIndex].innerText = Math.round(forecast.list[i].main.temp) + "°C";
                weather[i + hourIndex].src = 'icons/' + forecast.list[i].weather[0].icon + '.png';
                weather[i + hourIndex].style.display = 'inline';
                pressure += forecast.list[i].main.pressure;
                }
            
            pressure /= 40;
            pressureDisplay.innerText = Math.round(pressure) + ' hPa';
            pressure = 0;        
            });
    }
    
    //function which gets the geolocation and fetch the weathe data and header variable
    var yourLocation = document.getElementById('geolocation');
    navigator.geolocation.getCurrentPosition(function(position) {
        spot = "lat=" + Math.round(position.coords.latitude) + "&lon=" + Math.round(position.coords.longitude);
        fetchData(spot);
    });
        

    
    //event trigerred once the country is selected
    countrySelection.addEventListener("click", function(){
            
            //ckecking if the value of the country isn't the same as before
            if(countrySelection.value != valueCountry && countrySelection.value != ""){
                
                //changing the value of selected country
                valueCountry = this.value;
                
                //displaying citi selection
                citiesSelection.disabled = false;
                citiesSelection.style.backgroundColor = 'transparent';

                
                //hiding the check button - check cannot be done since the city isn't selected
                checkButton.style.backgroundColor = 'lightgray';
                checkButton.disabled = true;
                
                //deleting the options from previous choice
                while (citiesSelection.firstChild) {
                    citiesSelection.removeChild(citiesSelection.firstChild);
                }
                
                //creating the placeholder for city selection
               var selection = document.createElement("option");
                selection.innerText = "Select your city";
                selection.disabled = true;
                selection.selected = true;
                selection.value = "";
                citiesSelection.appendChild(selection);
                
                //loop which adds matching options to the city selection. The same country is the condition. 
                for(var i = 0; i < cities.length; i++){
                    if(cities[i].countryID == valueCountry){
                        var option = document.createElement("option");
                        option.innerText = cities[i].city;
                        option.value = cities[i].cityID;
                        citiesSelection.appendChild(option);
                    }
                }
                
            }
        })
    
    //checking if the city was selected
    citiesSelection.addEventListener("click", function(){
        if(citiesSelection.value != ""){
            checkButton.style.backgroundColor = 'transparent';
            checkButton.disabled = false;
        }
    })
    
    
    //filling headers of table with week days
    for(var i = 0; i<headers.length; i++){
        if (d.getDay() + i < 7){
            var dayNumber = weekday[d.getDay() + i];
        } else {
            var dayNumber = weekday[d.getDay() + i - 7];
        }
        headers[i].innerText = dayNumber;
    }
       
    //check weather button: displaying all wheather data
    checkButton.addEventListener("click", function(){
        
        //setting the first column to be visible in mobile view
        dayIndex=0;
        for (var i = 0; i < weekColumns.length; i++){
            if(i == dayIndex){
                weekColumns[i].classList.remove("notDisplayed");
            } else {
                weekColumns[i].classList.add("notDisplayed");
            }
        }
        
        //cleaning cells from data from previous research
        for (var i = 0; i < rows.length; i++){
            rows[i].innerText = "";
            weather[i].src = "";
        }
            
        //geting json file with forecast
        spot = "id=" + citiesSelection.value;
        fetchData(spot);
        
        //hiding the 'your location' header
        yourLocation.style.visibility = "hidden";
    })

    
    //swith the visible day in mobile device view - next
    nextArrow.addEventListener("click", function(){
        weekColumns[dayIndex].classList.add("notDisplayed");
        if(dayIndex < 5){
            dayIndex +=1;
        } else {
            dayIndex = 0;
        }
        weekColumns[dayIndex].classList.remove("notDisplayed");
    })

    //swith the visible day in mobile device view - previous
    previousArrow.addEventListener("click", function(){
        weekColumns[dayIndex].classList.add("notDisplayed");
        if(dayIndex > 0){
            dayIndex -=1;
        } else {
            dayIndex = 5;
        }
        weekColumns[dayIndex].classList.remove("notDisplayed");
    })
        
})

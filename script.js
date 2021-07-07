$(document).ready(function(){
    $("#form-submit").submit(function(event){
        performSearch(event)
    })
});
function performSearch(event) {
    event.preventDefault();
    var request; 
   
    request = $.ajax({
         url: "api.openweathermap.org/data/2.5/weather?",
         tpye: "get",
         data: {
             q: $("#city").val(),
             appid : "d37e271ed749a6e729f670537daa3e62",
             units: "standard",
         }
    });

    request.done(function(response){
        formatSearch(response)
    })
}

function formatSearch(jsonObject) {
    let city_name = jsonObject.name; 
    let city_weather = jsonObject.weather[0].main;
    let city_tempature = jsonObject.main.temp;
    let city_conditions= jsonObject.main.conditions;
    let city_humidity = jsonObject.main.humidity;
    let city_wind_speed= jsonObject.main.wind_speed;
    let city_uv_index= jsonObject.main.uvindex; 

        $('city-name').text(city_name);
        $('city-weater').text(city_weather);
        $('city-temp').text(city_tempature);
        $('city-conditions').text(city_conditions);
        $('city-humidity').text(city_humidity);
        $('city-wind-speed').text(city_wind_speed);
        $('city-uv-index').text(city_uv_index);
}
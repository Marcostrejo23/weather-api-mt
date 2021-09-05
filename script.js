$(document).ready(function () {
    var date = moment().format("YYYY-MM-DD")
    console.log(date);
    function storedCity() {
        $('.previous-cities').empty()
        let recentCity = JSON.parse(localStorage.getItem('cities')) || []
        for (var i = 0; i < recentCity.length; i++) {
            while (recentCity.length > 5) {
               let last5 = recentCity.length - 5;
               let index = 0;
                recentCity.splice(index, last5);
                index++
            }
           let newCity = $('<li>')
            newCity.addClass("list-group-item");
            newCity.text(recentCity[i].name)
            $('.previous-cities').append(newCity);
        }
    }
    storedCity()

    $(".button").on("click", function (event) {
        event.preventDefault();
        let city = $('.form-control').val()
        let listedCities = [];

        let recentCity = JSON.parse(localStorage.getItem('cities')) || []
        $('.previous-cities').val(recentCity);
        let savedCity = {
            name: city
        };
        recentCity.push(savedCity);
        localStorage.setItem('cities', JSON.stringify(recentCity));

        storedCity()
        search(city);
    })
    $('.previous-cities').on('click', "li", function (event) {
        event.preventDefault();
        let city = $(this).text()
        search(city);
    })
    function search(city) {
        $(".five").show()
        let queryURLOne = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid:d37e271ed749a6e729f670537daa3e62'
        $.when(
            $.ajax({
                url: queryURLOne,
                method: "GET"
            })).then(function (response) {
                let latitude = response.coord.lat;
                let longititude = response.coord.lon;
                let queryURLTwo = 'https://api.openweathermap.org/data/2.5/uvi?appid=d37e271ed749a6e729f670537daa3e62&lat=' + latitude + '&lon=' + longititude;
                $.ajax({
                    url: queryURLTwo,
                    method: "GET"
                }).then(function (responseTwo) {
                        $('.city-name').empty();
                        let cityName = response.name;
                        let temp = (response.main.temp - 273.15) * 9 / 5 + 32
                        let fahrenheit = $('<p>')
                        let humidity = $('<p>');
                        let windSpeed = response.wind.speed * 2.236936;
                        let imperialWindSpeed = $('<p>');
                        let indexEl = $('<span>');
                        indexEl.text("UV Index: ");
                        let indexNumber = parseFloat(responseTwo.value)
                        let indexNumberEl = $('<span>');
                        indexNumberEl.text(indexNumber);
                        indexNumberEl.attr('id', 'index-number');
                        if (indexNumber <= 2) {
                            indexNumberEl.addClass('d-inline p-2 bg-success text-white')
                        } else if (indexNumber >= 3 && indexNumber <= 7) {
                            indexNumberEl.addClass('d-inline p-2 bg-warning text-white')
                        } else {
                            indexNumberEl.addClass('d-inline p-2 bg-danger text-white')
                        }
                        let todaysWeather = response.weather[0].icon;
                        fahrenheit.text("Temperature: " + temp.toFixed(1) + "°F")
                        humidity.text("Humidity: " + response.main.humidity + '%')
                        imperialWindSpeed.text("Wind Speed: " + windSpeed.toFixed(1) + " MPH")
                        let weatherIcon = 'https://openweathermap.org/img/wn/' + todaysWeather + ".png";
                        let displayIcon = $('<img>')
                        displayIcon.attr('src', weatherIcon);
                        $('.city-name').append(cityName + ": " + date);
                        $('.city-name').append(displayIcon);
                        $('.city-name').append(fahrenheit);
                        $('.city-name').append(humidity);
                        $('.city-name').append(imperialWindSpeed);
                        $('.city-name').append(indexEl);
                        $('.city-name').append(indexNumberEl);
                    })

                let queryURLThree = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=d37e271ed749a6e729f670537daa3e62'
                $.ajax({
                    url: queryURLThree,
                    method: "GET"
                }).then(function (responseThree) {
                        $('#1').empty();
                        $('#2').empty();
                        $('#3').empty();
                        $('#4').empty();
                        $('#5').empty();
                        let dayOne = $('<h6>');
                        let dayTwo = $('<h6>');
                        let dayThree = $('<h6>');
                        let dayFour = $('<h6>');
                        let dayFive = $('<h6>');
                        dayOne.text(moment(date).add(1, 'days').format("MMM Do YY"));
                        dayTwo.text(moment(date).add(2, 'days').format("MMM Do YY"));
                        dayThree.text(moment(date).add(3, 'days').format("MMM Do YY"));
                        dayFour.text(moment(date).add(4, 'days').format("MMM Do YY"));
                        dayFive.text(moment(date).add(5, 'days').format("MMM Do YY"));
                        $('#1').append(dayOne);
                        $('#2').append(dayTwo);
                        $('#3').append(dayThree);
                        $('#4').append(dayFour);
                        $('#5').append(dayFive);
                        let j = 1
                        for (var i = 0; i < responseThree.list.length; i++) {
                            if (responseThree.list[i].dt_txt.indexOf("12:00:00") !== -1 &&
                                responseThree.list[i].dt_txt.indexOf("15:00:00") !== -1 ||
                                responseThree.list[i].dt_txt.indexOf("18:00:00") !== -1) {
                                let selector = "#" + j;
                                let forecastTempOne = (responseThree.list[i].main.temp_max - 273.15) * 9 / 5 + 32
                                let forecastFahrenheitOne = $('<p>');
                                let forecastHumidityOne = $('<p>');
                                let forecastWeatherOne = responseThree.list[i].weather[0].icon;
                                let weatherIconOne = 'https://openweathermap.org/img/wn/' + forecastWeatherOne + ".png";
                                let displayIconOne = $('<img>')
                                displayIconOne.attr('src', weatherIconOne);
                                forecastFahrenheitOne.text("Temp: " + forecastTempOne.toFixed(1) + "°F");
                                forecastHumidityOne.text("Humidity: " + responseThree.list[i].main.humidity + '%');
                                $(selector).append(forecastFahrenheitOne);
                                $(selector).append(forecastHumidityOne);
                                $(selector).append(displayIconOne);
                                j++;
                            }
                        }
                    })
            })
    }
});
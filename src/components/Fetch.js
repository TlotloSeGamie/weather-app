import React, { useState } from 'react';

const FetchWeather = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=fe9a214daa542ac38cf93efa22dbf3fb&units=metric`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched weather:', data);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      fetchWeather();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <div className='weather'>
        <h2><b>Weather Forecast Searcher</b></h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search city"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick} style={{ marginLeft: '10px' }}>🔍</button>
      </div>
      {weatherData && (
        <div className='container'>
        <b><h3>Weather in {weatherData.name}</h3>
            <div className='first'>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels like: {weatherData.main.feels_like}°C</p>
            </div>
            <div className='second'>
            <p>Weather: {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
            <div className='third'>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            <p>Sunrise: {formatTime(weatherData.sys.sunrise)}</p>
            </div>
            <div className='sun'>
            <p>Sunset: {formatTime(weatherData.sys.sunset)}</p>
            </div>
      </b>
    </div>
      )}
    </div>
  );
};

export default FetchWeather;

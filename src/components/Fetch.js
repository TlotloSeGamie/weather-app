import React, { useState, useEffect } from 'react';

const FetchWeather = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);

  const fetchWeather = async (lat, lon) => {
    try {
      const weatherResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fe9a214daa542ac38cf93efa22dbf3fb&units=metric`
      );
      const forecastResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fe9a214daa542ac38cf93efa22dbf3fb&units=metric`
      );
      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();
      setWeatherData(weatherData);
      setForecastData(forecastData);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const fetchNearbyPlaces = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=10&radius=1200&appid=fe9a214daa542ac38cf93efa22dbf3fb&units=metric`
      );
      const data = await response.json();
      const filteredPlaces = data.list.filter(
        (place) => place.coord.lat !== lat || place.coord.lon !== lon
      );
      setNearbyPlaces(filteredPlaces);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      fetchWeatherByCity(searchTerm);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fe9a214daa542ac38cf93efa22dbf3fb&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      fetchForecast(city);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=fe9a214daa542ac38cf93efa22dbf3fb&units=metric`
      );
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
          fetchNearbyPlaces(latitude, longitude);
        },
        (error) => {
          setLocationError('Unable to retrieve your location.');
        }
      );
    }
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const toggleModal = (index) => {
    setModalOpen(modalOpen === index ? null : index);
  };

  return (
    <div className='App'>
      <h2>Weather Forecast Searcher</h2>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search city"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick}>🔍</button>
      </div>
      {locationError && <p>{locationError}</p>}
      {weatherData && (
        <div className='weather'>
          <h3>Weather in {weatherData.name}</h3>
          <div className='weather-card'>
            <div className='info'>
              <p><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
              <p><strong>Feels like:</strong> {weatherData.main.feels_like}°C</p>
              <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
              <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
              <p><strong>Sunrise:</strong> {formatTime(weatherData.sys.sunrise)}</p>
              <p><strong>Sunset:</strong> {formatTime(weatherData.sys.sunset)}</p>
            </div>
          </div>
        </div>
      )}
      {forecastData && (
        <div className='forecast'>
          <h3>5-Day Forecast</h3>
          <div className='forecast-items'>
            {forecastData.list.slice(0, 5).map((item, index) => (
              <div key={index} className='forecast-item'>
                <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p><strong>Temp:</strong> {item.main.temp}°C</p>
                <p><strong>Weather:</strong> {item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {nearbyPlaces.length > 0 && (
        <div className='nearby-places'>
          <h3>Nearby Places (within 1200km)</h3>
          <div className='nearby-places-list'>
            {nearbyPlaces.map((place, index) => (
              <div key={index} className='nearby-place'>
                <button onClick={() => toggleModal(index)}>
                  Weather in {place.name}
                </button>
                {modalOpen === index && (
                  <div className='modal'>
                    <div className='modal-content'>
                      <span className='close' onClick={() => toggleModal(index)}>&times;</span>
                      <h3>Weather in {place.name}</h3>
                      <div className='weather-card'>
                        <div className='info'>
                          <p><strong>Temperature:</strong> {place.main.temp}°C</p>
                          <p><strong>Feels like:</strong> {place.main.feels_like}°C</p>
                          <p><strong>Weather:</strong> {place.weather[0].description}</p>
                          <p><strong>Humidity:</strong> {place.main.humidity}%</p>
                          <p><strong>Wind Speed:</strong> {place.wind.speed} m/s</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchWeather;

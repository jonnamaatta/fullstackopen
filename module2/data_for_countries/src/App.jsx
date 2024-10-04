import React, { useState, useEffect } from 'react';
import { fetchWithTimeout } from './services/apiHelpers';

const WeatherInfo = ({ country }) => {

  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`;

  const [weatherData, setWeatherData] = useState({});
  
  useEffect(() => {
    let mounted = true;

    const fetchWeather = async () => {
      try {
        const response = await fetchWithTimeout(api_url);
        const data = await response.json();
        console.log(data)
        if (mounted) {
          setWeatherData(data);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    fetchWeather();

    return () => {
      mounted = false;
    };
  }, [api_url]);
  
  const temperatureInCelsius = weatherData.main?.temp - 273.15;
  const weatherIcon = weatherData.weather?.[0].icon;

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>temperature {temperatureInCelsius.toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt={weatherData.weather?.[0].description} />      
      <p>wind {weatherData.wind?.speed} m/s</p>
    </div>
  )
}


const CountryInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area} km²</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <WeatherInfo country={country} />
    </div>
  );
};


const CountryFinder = ({ onInputChange }) => {
  return (
    <div className='countryFinder'>
      <p style={{ display: 'inline-block', marginRight: '10px' }}>Find countries:</p>
      <input
        type="text"
        placeholder="Type a country ..."
        onChange={(e) => onInputChange(e.target.value)} 
      />
    </div>
  );
};


const CountryList = ({ inputValue }) => {
  const [countries, setCountries] = useState([]); 
  const [filteredCountries, setFilteredCountries] = useState([]); 
  const [selectedCountry, setSelectedCountry] = useState(null); 

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetchWithTimeout("https://studies.cs.helsinki.fi/restcountries/api/all")
        const data = await response.json();
        setCountries(data); 
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries(); 
  }, []);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredCountries([]); 
    } else {
      const results = countries.filter(country =>
        country.name.common.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCountries(results);
    }
  }, [inputValue, countries]); 

  const handleShowCountry = (country) => {
    setSelectedCountry(country); 
  };

  return (
    <div className='countryList'>
      {inputValue.trim() === '' ? (
        <p>please enter a country name</p> 
      ) : filteredCountries.length > 10 ? (
        <p>too many matches, specify another filter!</p> 
      ) : filteredCountries.length === 1 ? (
        <CountryInfo country={filteredCountries[0]} />
      ) : filteredCountries.length > 0 ? (
        <div>
          {filteredCountries.map((country) => (
            <div key={country.name.common} style={{ display: 'flex', alignItems: 'center', marginRight: '5px 0' }}>
              <p style={{ marginRight: '10px' }}>{country.name.common}</p>
              <button onClick={() => handleShowCountry(country)}>Show</button> 
            </div>
          ))}
          {selectedCountry && <CountryInfo country={selectedCountry} />} 
        </div>
      ) : (
        <p>no countries found :/</p> 
      )}
    </div>
  );
};


const App = () => {

  const [inputValue, setInputValue] = useState(''); 

  const handleInputChange = (value) => {
    setInputValue(value); 
  };

  return (
    <>
      <CountryFinder onInputChange={handleInputChange} />
      <CountryList inputValue={inputValue} />
    </>
  );
};

export default App;

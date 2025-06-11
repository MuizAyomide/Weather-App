import React, { useState, useEffect } from 'react';
import axios from 'axios';

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  dt_txt?: string;
};

type ForecastItem = {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
};

const App = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [city, setCity] = useState('Madrid');
  const [searchInput, setSearchInput] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY; 

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Current weather
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
      );
      
      // Forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`
      );
      
      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data.list.slice(0, 20)); // Next 6 periods (24 hours)
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city, units]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
    }
  };

  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long' });
  };

  return (
      <div className='bg-gray-900'>
    <div className=' m-auto max-w-500 min-h-screen px-4 md:px-20 pt-10 text-white flex flex-col gap-6'>

      <div className='flex flex-row md:flex-row gap-4 items-center'>
        <div className='font-bold bg-blue-900 px-5 py-2 rounded'>Forecast°</div>
        <form onSubmit={handleSearch} className='w-full'>
          <input
            className='bg-gray-800 w-full outline-none border-none rounded px-5 py-2 text-sm text-gray-100'
            type="text"
            placeholder='Search for cities'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <button 
          onClick={toggleUnits}
          className='bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition'
        >
          °{units === 'metric' ? 'C' : 'F'}
        </button>
      </div>

      {loading && <div className='text-center py-10'>Loading...</div>}
      {error && <div className='text-red-500 text-center py-4'>{error}</div>}

      {weatherData && (
        <>
          <div className='flex flex-row md:flex-row justify-between items-center bg-gray-800 rounded-lg p-6'>
            <div className='flex flex-col gap-4'>
              <div className='text-3xl font-semibold'>{weatherData.name}</div>
              <div className='text-4xl font-bold'>
                {Math.round(weatherData.main.temp)}°
                {units === 'metric' ? 'C' : 'F'}
              </div>
              <div className='text-gray-300 capitalize'>
                {weatherData.weather[0].description}
              </div>
              <div>Humidity: {weatherData.main.humidity}%</div>
            </div>
            <div>
              <img 
                className='w-32 h-32'
                src={getWeatherIcon(weatherData.weather[0].icon)} 
                alt={weatherData.weather[0].description} 
              />
            </div>
          </div>

          <div className='bg-gray-800 rounded-lg p-6'>
            <h1 className='text-sm text-gray-400 mb-4'>TODAY'S FORECAST</h1>
            <div className='flex overflow-x-auto gap-4 py-2'>
              {forecastData.map((item, index) => (
                <div key={index} className='flex flex-col items-center gap-2 min-w-[100px]'>
                  <div className='text-sm font-semibold'>
                    {item.dt_txt ? formatTime(item.dt_txt) : 'Now'}
                  </div>
                  <img 
                    className='w-12 h-12'
                    src={getWeatherIcon(item.weather[0].icon)} 
                    alt="weather icon" 
                  />
                  <div className='font-semibold'>
                    {Math.round(item.main.temp)}°
                    {units === 'metric' ? 'C' : 'F'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-gray-800 rounded-lg p-6'>
            <h1 className='text-sm text-gray-400 mb-4'>WEEKLY FORECAST</h1>
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
              {forecastData
                .filter((_, index) => index % 8 === 0) // Daily forecast
                .slice(0, 5) // Next 5 days
                .map((item, index) => (
                  <div key={index} className='flex flex-col items-center gap-2 p-3 bg-gray-700 rounded'>
                    <div className='font-medium'>
                      {item.dt_txt ? formatDay(item.dt_txt) : 'Today'}
                    </div>
                    <img 
                      className='w-10 h-10'
                      src={getWeatherIcon(item.weather[0].icon)} 
                      alt="weather icon" 
                    />
                    <div>
                      {Math.round(item.main.temp)}°
                      {units === 'metric' ? 'C' : 'F'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
      </div>

  );
};

export default App;
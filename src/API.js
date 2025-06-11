async function fetchWeather(location) {
  try {
    setLoading(true);
    setError(null);
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${env.API_KEY}&units=metric`
    );
    
    setWeatherData(processWeatherData(response.data));
    console.log(response.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch weather');
  } finally {
    setLoading(false);
  }
}
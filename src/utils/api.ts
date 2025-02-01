export async function fetchWeatherData(city: string) {
  const apiKey = process.env.WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  return {
    temperature: data.main.temp,
    conditions: data.weather[0].description
  };
}
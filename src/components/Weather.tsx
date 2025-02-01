'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { WeatherData, WeatherError } from '@/types/weather';
import { useRouter, useSearchParams } from 'next/navigation';

interface ForecastData extends WeatherData {
  date: string;
}

interface PlaceSuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

const getWeatherIcon = (description: string) => {
  const icons: { [key: string]: string } = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '☁️',
    'shower rain': '🌧️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '🌨️',
    'mist': '🌫️',
    'overcast clouds': '☁️',
    'light rain': '🌦️',
    'moderate rain': '🌧️',
    'heavy rain': '⛈️',
    'drizzle': '🌧️',
  };

  return icons[description.toLowerCase()] || '🌡️';
};

export default function Weather() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const getCurrentLocationWeather = () => {
    setLocationLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const [weatherResponse, forecastResponse] = await Promise.all([
              fetch(`/api/weather/coordinates?lat=${latitude}&lon=${longitude}`),
              fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`)
            ]);

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            if (!weatherResponse.ok) {
              throw new Error(weatherData.message || 'Failed to fetch weather data');
            }

            setWeather(weatherData as WeatherData);
            setForecast(forecastData as ForecastData[]);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch location weather');
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please search for a city instead.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please search for a city instead.');
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    // If city is in URL, fetch its weather
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setCity(cityParam);
      fetchWeather(cityParam);
    }
  }, [searchParams]);

  // Add useEffect to fetch location weather on mount
  useEffect(() => {
    getCurrentLocationWeather();
  }, []); // Empty dependency array means this runs once on mount

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]);

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(cityName)}`),
        fetch(`/api/weather/forecast?city=${encodeURIComponent(cityName)}`)
      ]);

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (!weatherResponse.ok) {
        throw new Error((weatherData as WeatherError).message || 'Failed to fetch weather data');
      }

      setWeather(weatherData as WeatherData);
      setForecast(forecastData as ForecastData[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?city=${encodeURIComponent(city)}`);
    await fetchWeather(city);
  };

  const handleShare = async () => {
    if (!weather) return;

    const shareData = {
      title: 'Weather Information',
      text: `Check out the weather in ${weather.cityName}: ${weather.temperature}°C, ${weather.description}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSearchInput = async (searchText: string) => {
    setCity(searchText);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchText.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the API call
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/places/suggestions?search=${encodeURIComponent(searchText)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message);
        }

        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    }, 300);
  };

  const handleSuggestionClick = async (suggestion: PlaceSuggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    router.push(`?city=${encodeURIComponent(suggestion.name)}`);
    await fetchWeather(suggestion.name);
  };

  return (
    <Suspense>
    <div className="max-w-4xl mx-auto bg-sky-100 dark:bg-gray-800 rounded-lg shadow-lg p-6 text-gray-900 dark:text-white">
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => city.length >= 2 && setShowSuggestions(true)}
              placeholder="Enter city name"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.name}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{suggestion.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={getCurrentLocationWeather}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {locationLoading ? 'Detecting Location...' : 'Use Current Location'}
        </button>
      </div>

      {locationLoading && !weather && (
        <div className="text-center p-4">
          <p>Detecting your location...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg mb-4">
          {error}
        </div>
      )}

      {weather && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{weather.cityName}</h2>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Share
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-300">Temperature</p>
                <p className="text-xl font-semibold">
                  <span className="mr-2">🌡️</span>{weather.temperature}°C
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-300">Humidity</p>
                <p className="text-xl font-semibold">
                  <span className="mr-2">💧</span>{weather.humidity}%
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-300">Wind Speed</p>
                <p className="text-xl font-semibold">
                  <span className="mr-2">🌬️</span>{weather.windSpeed} m/s
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-300">Condition</p>
                <p className="text-xl font-semibold capitalize">
                  <span className="mr-2">{getWeatherIcon(weather.description)}</span>
                  {weather.description}
                </p>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Section with Icons */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-sm font-semibold mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className="text-3xl mb-2">{getWeatherIcon(day.description)}</div>
                  <p className="text-lg font-bold">{day.temperature}°C</p>
                  <p className="text-sm capitalize">{day.description}</p>
                  <p className="text-sm">
                    <span className="mr-1">💧</span>{day.humidity}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </Suspense>
  );
} 
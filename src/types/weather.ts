export interface WeatherData {
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

export interface WeatherError {
  message: string;
} 
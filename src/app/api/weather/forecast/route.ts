import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  let apiUrl: string;

  if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  } else if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else {
    return NextResponse.json({ message: 'City or coordinates required' }, { status: 400 });
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch forecast data');
    }

    // Process and format the forecast data
    const processedForecast = data.list
      .filter((_: any, index: number) => index % 8 === 0) // Get one reading per day
      .slice(0, 7) // Get 7 days
      .map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString(),
        temperature: Math.round(day.main.temp),
        humidity: day.main.humidity,
        description: day.weather[0].description,
        windSpeed: day.wind.speed
      }));

    return NextResponse.json(processedForecast);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch forecast' },
      { status: 500 }
    );
  }
} 
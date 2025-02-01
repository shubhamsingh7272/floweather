import { NextRequest, NextResponse } from "next/server";

function validateCity(city: string | null): city is string {
  return typeof city === 'string' && city.trim().length > 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    if (!validateCity(city)) {
      return NextResponse.json(
        { message: "Invalid city name" },
        { status: 400 }
      );
    }

    // Log environment variable
    console.log('API Key:', process.env.OPENWEATHER_API_KEY);

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=80f4241973366432d616a6bc3dc87e02&units=metric`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    const data = await response.json();

    // Log the response for debugging
    console.log('OpenWeather API Response:', {
      status: response.status,
      data: data,
      url: apiUrl
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "City not found" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      description: data.weather[0].description,
      cityName: data.name,
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { message: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
} 
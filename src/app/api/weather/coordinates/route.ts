import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Location not found" },
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
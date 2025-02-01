import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  if (!search) {
    return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const limit = 5; 

  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(search)}&limit=${limit}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data = await response.json();
    
    
    const suggestions = data.map((place: any) => ({
      name: place.name,
      state: place.state,
      country: place.country,
      lat: place.lat,
      lon: place.lon
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
} 
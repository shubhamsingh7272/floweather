# Floweather

> - View the assignment Hosted on Vercel: [visit Vercel Link](https://floweather-neon.vercel.app/)
> - GitHub Repository Link: [Open GitHub Repository](https://github.com/shubhamsingh7272/floweather)

## Features

- Real-time weather information using OpenWeatherMap API
- Location-based weather data using coordinates
- City search with autocomplete suggestions
- Detailed weather information including:
  - Current Temperature
  - Feels Like Temperature
  - Humidity
  - Wind Speed
  - Visibility
  - Weather Description
  - Date and Time
  - City Name
  - Weather Icon
- Weather data sharing functionality
- Responsive design with gradient colors
- Comprehensive error handling
- Unit and integration tests

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel
- **API**: OpenWeatherMap API

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/shubhamsingh7272/floweather
cd floweather
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenWeatherMap API key:
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
```

You can obtain an API key from [OpenWeatherMap API website](https://openweathermap.org/current)

## Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Testing
```bash
# Run all tests
npm run test
```

## Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── places/        # Places API endpoints
│   │   └── weather/       # Weather API endpoints
│   └── page.tsx           # Main page component
├── __tests__/             # Test files
│   ├── integration/       # Integration tests
│   └── unit/             # Unit tests
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Error Handling

- Frontend error state management
- Backend error handling with try/catch blocks
- User-friendly error messages
- Input validation

## Testing Coverage

- Unit tests for WeatherData component
- Backend API testing
- Integration tests for complete weather flow
- Test utilities for mocking router and search params

## Contact

For any queries or suggestions, please reach out:
- Email: shubham.s21@iiits.in
- GitHub: [shubhamsingh7272]([https://github.com/shubhamsingh7272](https://github.com/shubhamsingh7272))

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap API](https://openweathermap.org/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

import { fetchWeatherData } from '@/utils/api'

describe('Weather API Integration', () => {
  const mockApiKey = process.env.WEATHER_API_KEY || 'test-key'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('successfully fetches weather data', async () => {
    const mockWeatherData = {
      main: { temp: 20 },
      weather: [{ description: 'sunny' }]
    }

    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    })
    global.fetch = mockFetch

    const data = await fetchWeatherData('London')
    
    expect(data).toEqual({
      temperature: 20,
      conditions: 'sunny'
    })
  })

  it('handles API errors gracefully', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    })
    global.fetch = mockFetch

    await expect(fetchWeatherData('InvalidCity'))
      .rejects
      .toThrow('Failed to fetch weather data')
  })
}) 
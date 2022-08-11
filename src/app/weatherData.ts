export interface CurrentWeatherResponse{

    current: CurrentWeatherData;
  
  }
  
  export interface CurrentWeatherData{
  
    temperature: number;
    humidity: number;
    precip: number;
    pressure: number;
    feelslike: number;
  
  }
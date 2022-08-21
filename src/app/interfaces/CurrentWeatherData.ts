export interface CurrentWeatherData{

    last_updated: string;

    temp_c: number;
    temp_f: number;

    feelslike_c: number;
    feelslike_f: number;

    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;

    pressure_mb: number;
    pressure_in: number;

    precip_mm: number;
    precip_in: number;

    humidity: number;

    cloud: number;

    uv: number;

    temperature: number; //Will contain temp_c or temp_f depending on users preference. (To avoid lots of conditionals in template mark-up)
    feelslike: number; //Will contain feelslike_c or feelslike_f depending on users preference. (To avoid lots of conditionals in template mark-up)

}
import { WeatherSymbols } from "../objects/ASCIISymbols";

//A helper class to try and boil down the complex descriptions of the weather from WeatherAPI, into something I can use to
//measure and parameterize the weather scene construction
class WeatherCondition{

    type: WeatherType
    strength: WeatherStrength;

    weatherASCII: string;

    constructor(type: WeatherType, strength: WeatherStrength, ascii: string){
        this.type = type;
        this.strength = strength;
        this.weatherASCII = ascii;
    }

}

enum WeatherType{

    Sunny = 0,
    Cloudy,
    Mist,
    Rain,
    Snow,
    Hail,
    Fog

}

enum WeatherStrength{

    Weak = 0,
    Medium = 1,
    Strong = 2,
    VeryStrong = 3

}

//Map weather condition code to a WeatherCondition that I feel best encapsulates what that weather is and can be represented as in this app
//Ex: Blizzard can just be Type=Snow Strength=Strong, Partly Cloud: Type=Cloudy Strength=Weak, etc.
const weatherCodeMap: Map<number, WeatherCondition> = new Map<number, WeatherCondition>(
    [
        [1000, new WeatherCondition(WeatherType.Sunny, WeatherStrength.Medium, WeatherSymbols.sunny)],         //Sunny
        [1003, new WeatherCondition(WeatherType.Cloudy, WeatherStrength.Weak, WeatherSymbols.partlyCloudy)],   //Partly Cloudy
        [1006, new WeatherCondition(WeatherType.Cloudy, WeatherStrength.Medium, WeatherSymbols.cloudy)],       //Cloudy
        [1009, new WeatherCondition(WeatherType.Cloudy, WeatherStrength.Strong, WeatherSymbols.cloudy)],       //Overcast
        [1030, new WeatherCondition(WeatherType.Mist, WeatherStrength.Medium, WeatherSymbols.mist)],
        [1063, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.rainy)],
        [1066, new WeatherCondition(WeatherType.Snow, WeatherStrength.Weak, WeatherSymbols.snow)],
        [1069, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.snow)],
        [1072, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.rainy)],
        [1087, new WeatherCondition(WeatherType.Cloudy, WeatherStrength.Strong, WeatherSymbols.thundery)],
        [1114, new WeatherCondition(WeatherType.Snow, WeatherStrength.Medium, WeatherSymbols.snow)],
        [1117, new WeatherCondition(WeatherType.Snow, WeatherStrength.VeryStrong, WeatherSymbols.blizzard)],
        [1135, new WeatherCondition(WeatherType.Fog, WeatherStrength.Medium, WeatherSymbols.mist)],
        [1147, new WeatherCondition(WeatherType.Fog, WeatherStrength.Medium, WeatherSymbols.mist)],
        [1150, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.lightrainy)],
        [1153, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.lightrainy)],
        [1168, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.rainy)],
        [1171, new WeatherCondition(WeatherType.Rain, WeatherStrength.Strong, WeatherSymbols.rainy)],
        [1180, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.lightrainy)],
        [1183, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.lightrainy)],
        [1186, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.rainy)],
        [1189, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.rainy)],
        [1192, new WeatherCondition(WeatherType.Rain, WeatherStrength.Strong, WeatherSymbols.rainy)],
        [1195, new WeatherCondition(WeatherType.Rain, WeatherStrength.Strong, WeatherSymbols.rainy)],
        [1198, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.lightrainy)],
        [1201, new WeatherCondition(WeatherType.Rain, WeatherStrength.Strong, WeatherSymbols.rainy)],
        [1204, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.sleet)],
        [1207, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.sleet)],
        [1210, new WeatherCondition(WeatherType.Snow, WeatherStrength.Weak, WeatherSymbols.snow)],
        [1213, new WeatherCondition(WeatherType.Snow, WeatherStrength.Weak, WeatherSymbols.snow)],
        [1216, new WeatherCondition(WeatherType.Snow, WeatherStrength.Medium, WeatherSymbols.snow)],
        [1219, new WeatherCondition(WeatherType.Snow, WeatherStrength.Medium, WeatherSymbols.snow)],
        [1222, new WeatherCondition(WeatherType.Snow, WeatherStrength.Strong, WeatherSymbols.snow)],
        [1225, new WeatherCondition(WeatherType.Snow, WeatherStrength.Strong, WeatherSymbols.snow)],
        [1237, new WeatherCondition(WeatherType.Hail, WeatherStrength.Medium, WeatherSymbols.hail)],
        [1240, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.rainy)],
        [1243, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.rainy)],
        [1246, new WeatherCondition(WeatherType.Rain, WeatherStrength.VeryStrong, WeatherSymbols.torrentialRain)],
        [1249, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.sleet)],
        [1252, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.sleet)],
        [1255, new WeatherCondition(WeatherType.Snow, WeatherStrength.Weak, WeatherSymbols.snow)],
        [1258, new WeatherCondition(WeatherType.Snow, WeatherStrength.Medium, WeatherSymbols.snow)],
        [1261, new WeatherCondition(WeatherType.Hail, WeatherStrength.Weak, WeatherSymbols.hail)],
        [1264, new WeatherCondition(WeatherType.Hail, WeatherStrength.Medium, WeatherSymbols.hail)],
        [1273, new WeatherCondition(WeatherType.Rain, WeatherStrength.Weak, WeatherSymbols.thunderstorm)],
        [1276, new WeatherCondition(WeatherType.Rain, WeatherStrength.Medium, WeatherSymbols.thunderstorm)],
        [1279, new WeatherCondition(WeatherType.Snow, WeatherStrength.Weak, WeatherSymbols.thunderstorm)],
        [1282, new WeatherCondition(WeatherType.Snow, WeatherStrength.Medium, WeatherSymbols.thunderstorm)],

    ]
);

const unknownWeather = new WeatherCondition(WeatherType.Sunny, WeatherStrength.Medium, WeatherSymbols.unknown);

//Returns the proper Weather ASCII art for the given weather code
export function GetWeatherArt(conditionCode: number): string{

    const weatherCondition = weatherCodeMap.get(conditionCode);
    if(weatherCondition){
        return weatherCondition.weatherASCII;
    }

    return unknownWeather.weatherASCII;

}

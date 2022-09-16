import * as Three from "three";

import WeatherData from "./WeatherData";

//Encapsulate three js scene handling into one spot
//Handle the composition of the scene based on weather information
class WeatherScene{

    private scene: Three.Scene;

    constructor(weatherData: WeatherData){

        this.scene = new Three.Scene();
        this.scene.background = new Three.Color(0x000000);

        //Construct scene based on data from weatherData
        //Ex: if uv index is really high, scale the rays of the sun to be bigger and move faster
        //: spawn amount of raindrops appropriate for how much its supposed to rain

    }

    getScene(): Three.Scene{
        return this.scene;
    }

}


export default WeatherScene
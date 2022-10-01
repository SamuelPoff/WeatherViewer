interface Animatable{

    enabled: boolean;

    Animate(totalElapsedTime: number, deltaTime: number): void;

}

export default Animatable;
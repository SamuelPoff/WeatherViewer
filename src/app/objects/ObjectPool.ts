
//Use as a sort of factory object
//Sends back an instance of the type given but recycles already destroyed instances
class ObjectPool<T>{

    //User defined callback that returns a new instance of T, since this object has no clue how T needs to be defined
    //Or if it has an empty constructor to use as a baseline.
    private instanceCreationCallback: ()=>T;

    private instancePool: T[] = [];
    private instanceState: boolean[] = [];

    private maxInstances: number = 32;
    private indexStack: number[] = [];

    constructor(maxInstances: number, creationCallback: ()=>T){
        this.maxInstances = maxInstances;
        this.instanceCreationCallback = creationCallback;
    }

    //Adds the given object to the instance pool
    //Typically just used only during setup to give the initial pool of instances
    Fill(inst: T){

        if(this.instancePool.length < this.maxInstances){
            this.instancePool.push(inst);
            this.instanceState.push(false);
            this.indexStack.push(this.instancePool.length-1);
        }

    }

    //Gets a currently available instance of T and does bookeeping on state data
    //If none are free, returns null
    //Optional callback function can set up the state of the returned instance
    Get(callback?: (instance: T) => void): T | null{

        //There are no available instances so create a new one if maxInstances hasnt been reached
        if(this.indexStack.length <= 0){

            if(this.indexStack.length >= this.maxInstances){
                console.log(`Attempted to get instance from ObjectPool but it has reached its maximum instance count`);
                return null;
            }

            const inst = this.instanceCreationCallback();
            this.instancePool.push(inst);
            this.instanceState.push(true);

            if(callback){
                //Note: Potentially inefficient since this callback could likely just reset data that the object already sets in its constructor
                //meaning this would just be wasted time. Although the user could just account for this by not passing in this callback as long
                //as I added a required instanceCreationCallback to this method. Ill just wait on that and leave this here for if I feel like it
                callback(inst);
            }

            return inst;

        }

        //Grab the first available instance based on the indexStack
        let index = this.GetNextIndex();
        this.instanceState[index] = true;

        let inst = this.instancePool[index];
        if(callback){
            callback(inst);
        }
        

        return inst;

    }

    //Returns an instance to the pool and does bookeeping on all state data
    //User of object pool is obviously required to call this for this to work properly
    Return(index: number): void{

        this.instanceState[index] = false;
        this.indexStack.push(index);

    }


    ReturnInst(inst: T): void{


        let i = 0;
        while(i < this.instancePool.length){
            let instance = this.instancePool[i];

            if(instance === inst){
                this.instanceState[i] = false;
                this.indexStack.push(i);
                return;
            }

            ++i;
        }

        console.log("Tried to return instance that didnt exist");

    }

    private GetNextIndex(): number{

        let index = this.indexStack.pop()
        if(index){
            return index;
        }else{
            return 0;
        }
        

    }

    GetMaxInstances(): number{
        return this.maxInstances;
    }

    GetInstancePool(): T[] {
        return this.instancePool;
    }

}

export default ObjectPool;
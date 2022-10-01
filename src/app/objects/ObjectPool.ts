
//Use as a sort of factory object
//Sends back an instance of the type given but recycles already destroyed instances
class ObjectPool<T>{

    private instancePool: T[] = [];
    private instanceState: boolean[] = [];

    private maxInstances: number = 32;
    private indexStack: number[] = [];

    constructor(maxInstances: number){
        this.maxInstances = maxInstances;
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

        if(this.indexStack.length <= 0){
            return null;
        }

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

        let index = this.instancePool.findIndex((element) => { inst == element});
        if(index <= -1){
            //Instance didnt exist in pool apparently
            console.log("Tried to return instance that did not exist in pool");
            return;
        }

        this.instanceState[index] = false;
        this.indexStack.push(index);

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

}

export default ObjectPool;
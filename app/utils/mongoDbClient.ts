import { MongoClient, ServerApiVersion } from 'mongodb';
import invariant from 'invariant';

invariant(process.env.MONGODB_URI, 'MONGODB_URI is not set in the environment variables.');

const uri: string = process.env.MONGODB_URI;
const client: MongoClient = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1});

/** startup the mongo database connection **/
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/** we possibly don't want to start it from here **/
run().catch((error)=>{
    console.dir(error)
    throw (error)
});

export const collection = async (name: string) => {
    return client.db(name)
}

export const find(query:any){

}

export { client };
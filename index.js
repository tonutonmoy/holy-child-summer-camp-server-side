const express= require('express');
const app = express();

const cors= require('cors');
require('dotenv').config();

const port= process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{

    res.send('hello bd')
})










const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_USER_PASSWORD}@cluster0.andsvfa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();



    const database = client.db("holyChildDb");
    const allUsersCollection = database.collection("allUsers");






  app.post('/allUsers/:email',async(req,res)=>{

     const email=req.params.email;

     const userInformation=req.body;


     const alreadyEmail= await allUsersCollection.findOne({userEmail:email})

    
     
     if(alreadyEmail){

      return res.send({message:'allReady email exists '})
     }
  
     const result= await allUsersCollection.insertOne(userInformation);


     res.send(result)
          
   
  })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.listen(port,()=>{

    console.log(port, 'is running')
})
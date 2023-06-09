const express= require('express');
const app = express();

const cors= require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port= process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{

    res.send('hello bd')
})





const verifyTokenJWT = (req, res, next) => {

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unAuthorization access token' })
  }

  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, function (err, decoded) {


    if (err) {
      return res.status(401).send({ error: true, message: 'unAuthorization access token' })
    }

    req.decoded = decoded;


    next();
  });
}




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
    const allClassesCollection = database.collection("allClasses");





    // create Jwt
    app.post('/jwt', (req, res) => {

      const user = req.body;

      const token = jwt.sign(user, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' })

      res.send(token)
    })



// all users post 
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


  // all classes post 
  app.post('/allClasses/:email',verifyTokenJWT,async(req,res)=>{



    const verifyEmail= req.decoded.email;


     const userEmail= req.params.email;


     if(verifyEmail !== userEmail){

      return res.status(403).send({ error: true, message: ' email not match' })

    
     }

     

    const addAClass=req.body;


    
   


    const result= await allClassesCollection.insertOne(addAClass);

    res.send(result)


  })


  // all classes get

  app.get('/allClasses/:email',verifyTokenJWT,async(req,res)=>{



    const verifyEmail= req.decoded.email;


     const userEmail= req.params.email;


     if(verifyEmail !== userEmail){

      return res.status(403).send({ error: true, message: ' email not match' })

    
     }

     
    const result= await allClassesCollection.find().toArray();

    res.send(result)



  })

  // get by instructor
  app.get('/allClassesByInstructor/:email',verifyTokenJWT,async(req,res)=>{



    const verifyEmail= req.decoded.email;


     const userEmail= req.params.email;


     if(verifyEmail !== userEmail){

      return res.status(403).send({ error: true, message: ' email not match' })

    
     }
     
     const query={ instructorEmail:userEmail}
     
    const result= await allClassesCollection.find(query).toArray();

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
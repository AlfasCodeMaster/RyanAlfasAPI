const express = require('express');
const connect = require('./db');
const { serialize } = require('mongodb');

const router = express.Router();

// Define your routes
router.get('/getEntry', async (req, res) => {
  try {
    // Connect to MongoDB
    const db = await connect();

    // Access a collection
    const temperatureCollection = db.collection('temperature');
    const timeStampCollection = db.collection('timeStamp')
    const humidityCollection = db.collection('humidity')

    // Retrieve data from the collection
    const temperatureEntries = await temperatureCollection.find().sort({ _id: -1 }).limit(10).toArray();
    const timeStampEntries = await timeStampCollection.find().sort({ _id: -1 }).limit(10).toArray();
    const humidityEntries = await humidityCollection.find().sort({ _id: -1 }).limit(10).toArray();

    const entries={
        "temperature":temperatureEntries,
        "humidity":humidityEntries,
        "timeStamp":timeStampEntries
    }
    // Send the response
    res.json(entries);
  } catch (err) {
    console.error('Failed to retrieve temprature entries', err);
    res.status(500).json({ error: 'Failed to retrieve temprature entries' });
  }
});

router.post('/addEntry',async (req, res) => {
    try {
        // Retrieve temperature and time from the request body
        const { temperature,humidity, time } = req.body;
    
        if(!temperature||!humidity||!time){
            return res.json({error:"Temperature, humidity and time  must be included."})
        }
        // Create a data object using the temperature and time
        const temperatureObject = {
          "temperature":temperature,
        };
        const timeStampObject = {
            "time":time,
          };

          const humidityObject = {
            "humidity":humidity,
          };
    
        // Connect to MongoDB
        const db = await connect();
    
        // Access the collection
        const temperatureCollection = db.collection('temperature');
        const timeStampCollection = db.collection('timeStamp')
        const humidityCollection = db.collection('humidity')
    
        // Insert the data object into the collection
        await temperatureCollection.insertOne(temperatureObject);
        await timeStampCollection.insertOne(timeStampObject);
        await humidityCollection.insertOne(humidityObject);
    


        // Send a success response
        res.json({ message: 'Data inserted successfully.' });
      } catch (error) {
        console.error('Failed to insert data', error);
        res.status(500).json({ error: 'Failed to insert data' });
      }
  });


  router.get('/getHumidities', async (req, res) => {
    try {
      // Connect to MongoDB
      const db = await connect();
  
      // Access a collection
      const collection = db.collection('humidity');
  
      // Retrieve data from the collection
      const humidityEntries = await collection.find().sort({ _id: -1 }).limit(10).toArray();
  
      // Send the response
      res.json(humidityEntries);
    } catch (err) {
      console.error('Failed to retrieve humidity entries', err);
      res.status(500).json({ error: 'Failed to retrieve humidity entries' });
    }
  });

  router.post('/changeLight', async (req, res) => {
    try {
      // Retrieve temperature and time from the request body
      const { lightID,state } = req.body;
  
      if(!lightID||state==null){
          return res.json({error:"Light ID and state must be included."})
      }
      // Create a data object using the temperature and time
      const search = {
        "lightID":lightID
      };
      const updateForm = { "$set": {
         "state": state 
        } }
  
      // Connect to MongoDB
      const db = await connect();
  
      // Access the collection
      const lightRoom = db.collection('lightRoom');
      lightRoom.updateOne(search,updateForm)

  
      // Send a success response
      res.json({ message: 'Light state updated successfully.' });
    } catch (error) {
      console.error('Failed to update data', error);
      res.status(500).json({ error: 'Failed to update data' });
    }
  });
  router.post('/changeRGB', async (req, res) => {
    try {
      // Retrieve temperature and time from the request body
      const { red,green,blue } = req.body;
  
      if(!!red||!green||!blue){
          return res.json({error:"Light ID and state must be included."})
      }
      // Create a data object using the temperature and time
      const search = {
        "lightID":4
      };
      const updateForm = { "$set": {
         "red": red,
         "green": green,
         "blue": blue,
        } }
  
      // Connect to MongoDB
      const db = await connect();
  
      // Access the collection
      const lightRoom = db.collection('lightRoom');
      lightRoom.updateOne(search,updateForm)

  
      // Send a success response
      res.json({ message: 'RGB state updated successfully.' });
    } catch (error) {
      console.error('Failed to update data', error);
      res.status(500).json({ error: 'Failed to update data' });
    }
  });

module.exports = router;

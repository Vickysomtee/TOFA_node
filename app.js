require('dotenv')
const http = require("http");

const fetch = require("node-fetch");
const mongoose = require("mongoose");
const nodeCron = require("node-cron");

//mongoose  schema
const Photo = require("./photo.model");


const PORT = process.env.PORT
const dbConnect = process.env.MONGO_URI

// node server setup
const server = http.createServer(async (req, res) => {
  if ((req.url === "/api") & (req.method === "GET")) {
    res.writeHead(200, { "Content-Type": "application/json" });

    res.write("Hii there, Welcome to raw node");

    res.end();
  } else if ((req.url === "/api/photos") & (req.method === "GET")) {
    try {
      //crone job for fetching and storing data every 1 minute
      nodeCron.schedule("*/1 * * * *", async () => {
        
        //fetch request from api
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/photos",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        const photos = JSON.stringify( data );
        for (const photo of data) {
          
          //store fetched data in mongo atlas
          await Photo.insertMany([{
              albumId: photo.albumId,
              id: photo.id,
              title: photo.title,
              url: photo.url,
              thumbnailUrl: photo.thumbnailUrl
            }])
        }
        res.write(photos);
      })
      res.end();
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });

      res.end(JSON.stringify({ message: error.message }));
    }
  }
});

//mongo connection
mongoose
  .connect(dbConnect, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((client) => {
    console.log("Database is Connected");
  })
  .catch((error) => console.log(error));

  //server setup
server.listen(PORT, () => {
  console.log("Server is running");
});

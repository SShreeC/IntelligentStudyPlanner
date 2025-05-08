const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/demoDB",{serverSelectionTimeoutMS:5000});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error",(err)=>{console.log(`MongoDb connection error:${err}`)});
module.exports=mongoose;
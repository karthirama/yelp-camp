const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./model/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() => {
  console.log("Database connected");
});

app.set("view engine",'ejs');
app.set('views',path.join(__dirname,'views'));

app.get("/",(req,res)=>{
    res.render('home')
})

app.get("/campgrounds",async (req,res) =>{
try{
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index',{campgrounds});
}
catch(error){
    console.log("Error occured")
}
});

app.listen(3000,() => {
    console.log("Serving on port 3000");
})
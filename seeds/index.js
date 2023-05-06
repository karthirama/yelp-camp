const mongoose = require('mongoose');
const Campground = require('../model/campground');
const cities = require('./cities');
const { places,descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() => {
  console.log("Database connected");
});

const sample = (array) => {
     return array[Math.floor(Math.random()*array.length)];
}

const seedDb = async () => {
   await Campground.deleteMany({});
   for(let i=0;i<50;i++){
   const random1000 = Math.floor(Math.random()*1000);
   const price = Math.floor(Math.random() * 30 + 10);
   const camp = new Campground({
     location : `${cities[random1000].city},${cities[random1000].state}`,
     title:`${sample(descriptors)} ${sample(places)}`,
     image: "https://source.unsplash.com/random/?camps&1",
     description:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters',
     price 
   });

     await camp.save();
   }
}

seedDb().then(() => {
    mongoose.connection.close();
});
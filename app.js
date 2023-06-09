const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Campground = require('./model/campground');
const campground = require('./model/campground');

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
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
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

app.get("/campgrounds/new",(req,res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds',async(req,res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
});

app.get('/campgrounds/:id',async (req,res) => {
   const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
})

app.get('/campgrounds/:id/edit',async (req,res) => {
    const campground = await Campground.findById(req.params.id);
     res.render('campgrounds/edit',{campground});
 })

 app.put('/campgrounds/:id',async (req,res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`);
 })

 app.delete('/campgrounds/:id',async (req,res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds/');
 });


app.listen(3000,() => {
    console.log("Serving on port 3000");
})
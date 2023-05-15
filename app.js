//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://NayanChourasia:Penguin0410@cluster0.tfutqd9.mongodb.net/todoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
.then(console.log('connecting'))
.catch(err => console.log(`error: ${err}`));

const itemSchema=({
  name: String,
  age: Number
});

const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({
  name:"itachi",
  age: 13
});

const item2 = new Item({
  name:"madara",
  age: 17
});

const item3 = new Item({
  name:"shisui",
  age:15
});

const defaultItems =[item1, item2, item3]


// just to add items in the database 
// Item.insertMany(defaultItems)
// .then(()=>console.log("successfully added items"))
// .catch(err=>console.log(err));

app.get("/", function(req, res) {

  // const day = date.getDate();
  Item.find({})
  .then(function (foundItems) {
    if (foundItems.length === 0) {
      /** Insert Items 1,2 & 3 to todolistDB */
      Item.insertMany(defaultItems)
        .then(function (result) {
          console.log("Sucessfully Added Default Items to DB.");
        })
        .catch(function (err) {
          console.log(err);
        });
        res.redirect("/");
    } else res.render("list", { listTitle: "Today", newListItems: foundItems });
  })
  .catch(function (err) {
    console.log(err);
  });
  });

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save()
  res.redirect("/");

});

app.post("/delete", function(req, res){
const checkedItem = req.body.checkbox;
Item.findByIdAndRemove(checkedItem)
.then(function(){
  if(checkedItem){
    console.log("checked item removed");
    res.redirect("/");
  }
})
.catch(err => console.log(`error: ${err}`));

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

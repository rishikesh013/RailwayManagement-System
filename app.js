const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

app.set("view engine", "ejs");
// app.set('views', __dirname + '/public');
app.use(express.static("/public"));
app.use('/css', express.static(path.resolve(__dirname, "public/css")))
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


mongoose.connect("mongodb://localhost:27017/railwaydb", {
  useNewUrlParser: true,
});

const articleSchema = {
  pnrNo: Number,
  trainNo: Number,
  trainName: String,
  from: String,
  to: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function (req, res) {
  Article.find(function (err, foundarticles) {
    if (!err) {
    res.render("index", {check: foundarticles});
    } else {
      res.send(err);
    }
  });
});

app.get("/", function (req, res) {
    Article.find(function (err, foundarticles) {
      if (!err) {
      res.render("index", {check: foundarticles});
      } else {
        res.send(err);
      }
    });
  });

app.get('/additems', (req, res) =>{
    Article.find(function (err, foundarticles) {
        if (!err) {
        res.render("add", {check: foundarticles});
        } else {
          res.send(err);
        }
      });
});

app.get('/deleteitems', (req, res) =>{
    Article.find(function (err, foundarticles) {
        if (!err) {
        res.render("delete", {check: foundarticles});
        } else {
          res.send(err);
        }
      });
});

app.post("/articles", (req, res) =>{
    const newArticle = new Article({
        pnrNo: req.body.pnrNo,
        trainNo: req.body.trainNo,
        trainName: req.body.trainName,
        from: req.body.from,
        to: req.body.to
    });

    newArticle.save(function(err){
        if (!err){
            res.redirect('/articles');
        } else {
            res.send(err);
        }
    });
});

app.post('/deleteitems', (req, res) =>{
    const itemId = req.body.checkBox;
    Article.findByIdAndRemove(itemId, (err) =>{
        if (err) {
            res.send("Error in deletion")
        }else{
            res.redirect('/articles');
        }
    });
})
app.delete('/articles', (req, res) =>{
    Article.deleteOne(
        {pnrNo: req.body.pnrNo},
        (err)=>{
            if(!err){
                res.redirect('/articles');
            } else {
                res.send("Update failed");
            }
        }
    );
}); 

app.get('/update', (req, res) =>{
    Article.find(function (err, foundarticles) {
        if (!err) {
        res.render("update", {check: foundarticles});
        } else {
          res.send(err);
        }
      });
})

///////////////////////Routing for a specific article /////////////////////////

app.get('/articles/:articleName', (req, res) =>{
    Article.findOne({_id: req.params.articleName}, (err, foundresult) =>{
        if (foundresult){
            res.render('update_add', {check: foundresult});
        } else {
            res.send(err);
        }
    });
});



app.post('/articles/:articleName', (req, res) =>{
    Article.updateOne(
        {_id: req.params.articleName},
        {$set: req.body},
        {overwrite: true},
        (err)=>{
            if(!err){
                res.redirect('/articles');
            } else {
                console.log(req.params.articleName);
                res.send("Update failed!!!");
            }
        }
    );
});

app.delete('/articles/:articleName', (req, res) =>{
    Article.deleteOne(
        {title: req.params.articleName},
        (err)=>{
            if(!err){
                res.send("Successfully updated the content");
            } else {
                res.send("Update failed");
            }
        }
    );
});
app.listen(3000, () => {
  console.log("Hello world at port 3000");
});

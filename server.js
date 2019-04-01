const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

const mastkey = "kick1";
// connect to the database
mongoose.connect('mongodb://localhost:27017/bandlist', {
  useNewUrlParser: true
});

// Create a scheme for bandnames on the list: a name and a vote count
const bandnameSchema = new mongoose.Schema({
    creator: String,
    deletekey: String,
    name: String,
    count: Number,
});
// Create a model for bandnames in the list.
const Bandname = mongoose.model('Bandname', bandnameSchema);

// Create a new bandname on the list: takes a name and a count.
app.post('/api/bandnames', async (req, res) => {
    const bandname = new Bandname({
      creator: req.body.creator,
      deletekey: req.body.deletekey,
      name: req.body.name,
      count: req.body.count,
    });
    try {
      await bandname.save();
      res.send(bandname);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Get a list of all the names on the list
app.get('/api/bandnames', async (req, res) => {
    try {
      let bandnames = await Bandname.find();
      for (i = 0; i < bandnames.length; i++) {
        bandnames[i].deletekey = '';
      }

      res.send(bandnames);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Gets the doc from db, compares provided key
app.delete('/api/bandnames/:id', async (req, res) => {
    try {
        let checkname = await Bandname.findOne({
            _id: req.params.id
        });

        
        if (req.body.key == checkname.deletekey || req.body.key == mastkey) {
            await Bandname.deleteOne({
                _id: req.params.id
            });
            res.sendStatus(200);
        }
        else {
            res.sendStatus(403);
        }
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Add a vote to the name
app.put('/api/bandnames/:id', async (req, res) => {
    try {
        let bandname = await Bandname.findOne({
            _id: req.params.id
        });
        if (req.body.vote == 'plus') {
            bandname.count += 1;
        }
        else {
            bandname.count -= 1;
        }
        bandname.save();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



app.listen(3000, () => console.log('Server listening on port 3000!'));
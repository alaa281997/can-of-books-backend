
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// const jwt = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');

const app = express();
app.use(cors());

const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/books',
  { useNewUrlParser: true, useUnifiedTopology: true }); //deprecation warnings




//  create collections
//  create schema and model
// Schema: determines how the shape of our data will look like (blueprint)
const bookSchema = new mongoose.Schema({
  bookName: String,
  description: String,
  urlImg: String
});

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  books: [bookSchema]
})

// build a model from our schema
// schema: drawing phase
// model: creation phase
const bookModel = mongoose.model('book', bookSchema);
const myOwnerModel = mongoose.model('owner', ownerSchema);



function seedBookCollection() {
    const Tipping1 = new bookModel({
        bookName: 'The Tipping Point',
        description: 'The New Yorker staff writer examines phenomena from shoe sales to crime rates through the lens of epidemiology, reaching his own tipping point, when he became a rock-star intellectual and unleashed a wave of quirky studies of contemporary society. Two decades on, Gladwell is often accused of oversimplification and cherry picking, but his idiosyncratic bestsellers have helped shape 21st-century culture.',
        urlImg: 'https://images-na.ssl-images-amazon.com/images/I/61peRlJRMLL.jpg'
    });
    const Darkmans = new bookModel({
        bookName: 'Darkmans',
        description: 'British fiction’s most anarchic author is as prolific as she is playful, but this freewheeling, visionary epic set around the Thames Gateway is her magnum opus. Barker brings her customary linguistic invention and wild humour to a tale about history’s hold on the present, as contemporary Ashford is haunted by the spirit of a medieval jester.',
        urlImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1432299845l/25581537._SY475_.jpg'
    });
    
    Tipping1.save();
    Darkmans.save();
}
//seedBookCollection();

function seedOwnerCollection() {
    const alaa = new myOwnerModel({
        ownerEmail: 'alaabbas97@gmail.com',
        books: [
            {
              bookName: 'The Tipping Point',
              description: 'The New Yorker staff writer examines phenomena from shoe sales to crime rates through the lens of epidemiology, reaching his own tipping point, when he became a rock-star intellectual and unleashed a wave of quirky studies of contemporary society. Two decades on, Gladwell is often accused of oversimplification and cherry picking, but his idiosyncratic bestsellers have helped shape 21st-century culture.',
              urlImg: 'https://images-na.ssl-images-amazon.com/images/I/61peRlJRMLL.jpg'
            },
            {
              bookName: 'Darkmans',
              description: 'British fiction’s most anarchic author is as prolific as she is playful, but this freewheeling, visionary epic set around the Thames Gateway is her magnum opus. Barker brings her customary linguistic invention and wild humour to a tale about history’s hold on the present, as contemporary Ashford is haunted by the spirit of a medieval jester.',
              urlImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1432299845l/25581537._SY475_.jpg'
            }
        ]
    })

    alaa.save();
}


//seedOwnerCollection();


 app.get('/books',getBooksHandler);

 function getBooksHandler(req, res) {
  let { email } = req.query;
  // let {name} = req.query
  myOwnerModel.find({ ownerEmail: email }, function (err, ownerData) {
    if (err) {
      console.log('did not work')
    } else {
      console.log(ownerData)
      // console.log(ownerData[0])
      // console.log(ownerData[0].books)
      res.send(ownerData[0].books)
    }
  })
}



app.get('/test', (request, response) => {



})

app.listen(PORT, () => console.log(`listening on ${PORT}`));


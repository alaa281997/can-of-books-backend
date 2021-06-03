
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
app.use(cors());

app.use(express.json());


const PORT = process.env.PORT;

mongoose.connect(`${process.env.MONGO_URL}`,
  { useNewUrlParser: true, useUnifiedTopology: true }); 


const bookSchema = new mongoose.Schema({
  bookName: String,
  description: String,
  urlImg: String
});

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  books: [bookSchema]
})

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




app.get('/', homePageHandler);
app.get('/books', getBooksHandler);
app.post('/addBook', addBooksHandler);
app.delete('/deleteBook/:index', deleteBooksHandler);
app.put('/updatebook/:index', updateBookHandler);

function homePageHandler(req, res) {
  res.send('Hello from the homePage')
}



function getBooksHandler(req, res) {
  let { email } = req.query;
  myOwnerModel.find({ ownerEmail: email }, function (err, ownerData) {
    if (err) {
      console.log('did not work')
    } else {
      console.log(ownerData)
      res.send(ownerData[0].books)
    }
  })
}



function addBooksHandler(req, res) {
  console.log(req.body);
  const { bookName, description, urlImg, ownerEmail } = req.body;

  myOwnerModel.find({ ownerEmail: ownerEmail }, (error, ownerData) => {
    if (error) { res.send('not working') }
    else {
      ownerData[0].books.push({
        bookName: bookName,
        description: description,
        urlImg: urlImg,

      })
      ownerData[0].save();

      res.send(ownerData[0].books);

    }

  })
}
function deleteBooksHandler(req, res) {
  let { email } = req.query;
  const index = Number(req.params.index);

  myOwnerModel.find({ ownerEmail: email }, (error, ownerData) => {


    const newBooksArr = ownerData[0].books.filter((book, idx) => {
      if (idx !== index) return book;
    })
    ownerData[0].books = newBooksArr;
    ownerData[0].save();
    res.send(ownerData[0].books)
  })

}


function updateBookHandler(req, res) {

  console.log(req.body);
  console.log(req.params.index);

  const { bookName, description, urlImg, ownerEmail } = req.body;
  const index = Number(req.params.index);

  myOwnerModel.findOne({ ownerEmail: ownerEmail }, (error, ownerData) => {
    console.log(ownerData);
    ownerData.books.splice(index, 1, {
      bookName: bookName,
      description: description,
      urlImg: urlImg,
    })

    ownerData.save();
    console.log(ownerData)
    res.send(ownerData.books)
  })

}

app.get('/test', (request, response) => {



})

app.listen(PORT, () => console.log(`listening on ${PORT}`));


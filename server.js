const express = require('express');
const { animals } = require('./data/animals.json');
const path = require('path')

const PORT = process.env.PORT || 3001;
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incomign Json data
app.use(express.json());
//connects everything in our public folder... style sheet, etc
app.use(express.static('public'));




//called a GET route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//param routes must come AFTER the GET routes
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

  app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });

  // the "/" route brings us to the root of the server! this route is used to create a homepage for a server
  // this routes job is to respond with an HTML page to display in the browswer
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, './public/index.html'));
    });

    //get route for our animals.html
    app.get('/animals', (req, res) => {
        res.sendFile(path.join(__dirname, './public/animals.html'));
    });

    //get route for zookeepers.html
    app.get('/zookeepers', (req, res) => {
        res.sendFile(path.join(__dirname, './public/zookeepers.html'));
      });

//sends user to main page if a non existant url is entered
//ROUTE ORDER MATTERS... this one should come last or it'll overwrite the other routes
      app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, 'public/index.html'));
      })
    
    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`);
    });








    // app.post('/api/animals', (req,res) => {
    //     //req.body is where our incoming content will be
    //     console.log(req.body);
    //     //sends data back to the client
    //     res.json(req.body);
    // });
 
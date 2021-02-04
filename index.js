const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');
const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(() => {
    // console.log('importing the "Asian Glazed Chicken Thighs" ')
    // console.log('data', data[0])

    // Insert data
    let importRecipe = Recipe.insertMany(data)
     .then((result) => {
      console.log('data inserted')
      result.forEach((elem) => {console.log(elem.title)
      })
    })
    .catch((error) => {
      console.log('Something wrong with importing recipes')
      console.log(error)
    })

    // Update and delete data + closing connection:
    Promise.all([importRecipe])
      .then(() => {

        // Update an object
        const queryUpdateDur = {title: 'Rigatoni alla Genovese'};
        let updatePromise = Recipe.findOneAndUpdate(queryUpdateDur, {duration:100})        
          .then((result) => {
            console.log('update succesfull:')
            console.log(result)
          })
          .catch(() => {
            console.log('update unsuccesfull')
          })

        // Delete an object
        let deletePromise = Recipe.deleteOne({title:'Carrot Cake'})
          .then((result) => {
            console.log('deletion succesfull:')
            console.log(result)
          })
          .catch((error) => {
            console.log('deletion unsuccesfull:')
            console.log(error)
          })

          // Close connection
          Promise.all([updatePromise, deletePromise])
          .then(() => {
            console.log('Closing connection...')
            mongoose.connection.close()
          })
          .catch(() => {
            console.log('disonnection unsuccesfull')
          })          
      })
      .catch(() => {
        console.log('promise all unsuccesfull')
      })
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/Auth_page', { useNewUrlParser: true,  useUnifiedTopology: true, family: 4, });

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;
const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO, { useNewUrlParser: true,  useUnifiedTopology: true, family: 4, });

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;
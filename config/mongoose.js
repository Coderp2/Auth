const mongoose = require('mongoose');

// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://Codep2:Codep2@cluster0.hnoxbmp.mongodb.net/Auth_page", { useNewUrlParser: true,  useUnifiedTopology: true, family: 4, });
mongoose.connect(process.env.MONGO, { useNewUrlParser: true,  useUnifiedTopology: true, family: 4, });

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;
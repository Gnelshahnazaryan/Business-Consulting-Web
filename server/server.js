var express = require("express");
var path = require("path");
var bodyParser = require("body-parser")
var app = express();
const mongoose = require('mongoose');
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectionString = 'mongodb+srv://gshahnazaryan08:shahnazaryan08@business-consulting-web.wcr3wr6.mongodb.net/Company-Data?retryWrites=true&w=majority&appName=Business-Consulting-Web';

app.use(express.static(path.join( __dirname, '../Public')));

// const filePath = path.join(__dirname, 'Main', 'main.html');

const { ObjectId } = require('mongoose').Types;
const db = mongoose.connection;
db.setMaxListeners(20)

app.get("/", function (req, res) {
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        try {
            let result = await mongoose.connection.db.collection('Company-Data').find().toArray()
            res.sendFile(path.join(__dirname, '../Public/Main/main.html'))

            } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    })
})


app.post("/addInfo", async function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', async () => {
        console.log('Connected to MongoDB!');
        try {
            await mongoose.connection.db.collection('Company-Data').insertOne({
                name: name,
                surname: surname,
                email: email,
                subject: subject,
                message: message
            })
          res.redirect('/')
        } catch (error) {
            console.error('Error retrieving movies:', error);
        } finally {
            mongoose.connection.close();
        }
    })
})


app.listen(3001, function () {
    console.log("Example is running on port 3000");
});
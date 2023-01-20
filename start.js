const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/user');
const session = require('express-session');
const Usercontroller = require('./controller/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const router = express.Router();
const { search, update } = require('./controller/user');
const modelPoints =require('./model/points');
const controllerPoints = require('./controller/points');



const app = express();

dotenv.config({path:'.env'});
const PORT = process.env.PORT||5000;
const databases = process.env.DATABASE||5000;

//connect the mongoose server
mongoose.connect(databases, {
    useNewUrlParser: true
}).then (() =>{
    console.log("Database Connected");
}).catch(()=>{
    console.log("Database Connection Failed");
});

//import routes
//const useRoutes = require('./routes/user');

//log request
app.use(morgan('tiny'));

app.use(cors());

//parse request to body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//set view engine
app.set("view engine","ejs");
app.set(express.static(path.resolve (__dirname+"public")));

//load css
app.use(express.static(path.resolve(__dirname, "public")));


//Add user session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { expires: new Date(253402300000000) }
}));


app.use("*", async (req, res, next) => {
    global.user = false;
    if(req.session.userID && !global.user){
        const user = await User.findById(req.session.userID);
        global.user = user;
    }
    next();
});
    
const authMiddleWare = async(req, res, next) => {
        const user = await User.findById(req.session.userID);
        if(!user){
            return res.redirect('/');
        }
        next();
   
    }
router.route('/newpassword').get(search).post(search)
router.route('/forgotpassword').get(update).post(update);

module.exports = router;
app.get('/', (req, res) => {
    res.render("index", {pagetitle: "Welcome to the Homepage"})
});

app.get('/contactus', (req, res) => {
    res.render("contactus", {pagetitle: "Welcome to the Homepage"})
});

app.get('/aboutus', (req, res) => {
    res.render("aboutus", {pagetitle: "Welcome to the Homepage"})
});


app.get('/login', (req, res) => {
    var Message = req.query.message;
    if(Message){
        res.render("index", {_pageName: "Welcome to the Homepage", errors: {}, message: Message})
    }else{
        res.render("index", {_pageName: "Welcome to the Homepage",  errors: {}, message: null})
    }
   
});
app.post('/login', Usercontroller.login);

app.post('/addPoints', controllerPoints.create);

app.get('/register', async(req, res) => {
    res.render("register", {_pageName: "Register", errors: {}, message: null})
});
app.post('/register', Usercontroller.register);


app.get('/landingpage', (req, res) => {
    res.render('landingpage', { user: global.user })

});

app.post('/landingpage', controllerPoints.create);

app.get('/forgotpassword', (req, res) => {
    res.render("forgotpassword", {pagetitle: "Forgot password"})
});

app.post('/forgotpassword', Usercontroller.search);

app.get('/newpassword', (req, res) => {
    res.render("newpassword", {pagetitle: "Enter new password"})
});

app.post('/newpassword', bodyParser.urlencoded({ extended: true }), Usercontroller.update);

app.get('/updatepassword', (req, res) => {
    res.render("updatepassword", {pagetitle: "Update password"})
});

app.get('/cart', (req, res) => {
    res.render("cart", {pagetitle: "Shopping cart"})
});

app.get("/logout", async (req, res) => {
    req.session.destroy();
    global.user = false;
    res.redirect('/');
});



app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});


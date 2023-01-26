const express = require("express")
const path = require("path")
const hbs = require("hbs")
const app = express()
const LogInCollection = require("./mongo")
const ListCollection = require("./mongo-lists")
const SubscriberCollection = require("./mongo-subscribers")
const cookie = require('cookie')
const cloudflare = require('cloudflare-express');

app.use(cloudflare.restore());

const port = process.env.PORT || 80
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', async (req, res) => {
    let count_owners
    let count_subscribers
    async function count_owners_fun(){
        let count_owners = await LogInCollection.countDocuments({});
        return count_owners
    }
    async function count_subscribers_fun(){
        let count_subscribers = await SubscriberCollection.countDocuments({});
        return count_subscribers
    }
    count_subscribers = await count_subscribers_fun()
    count_owners = await count_owners_fun()
    res.render('home', {user_count: count_owners+count_subscribers})
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/create-list', (req, res) => {
    res.render('create-list')
})

app.get('/:username/:listname', async (req, res, next) => {

    req.cookies = cookie.parse(req.headers.cookie || '');
    const loggedUser = req.cookies.username;
    if (req.params.username!=loggedUser){

    const userlists = await ListCollection.findOne({ username: req.params.username,listname: req.params.listname })
    const checking_username = await LogInCollection.findOne({ username:req.params.username })
    if (userlists && checking_username){
        res.render("subscribetolist", { owner: req.params.username, 
                                        listname: req.params.listname})
    }
    else {
        res.send("No such list exists!!")
    }
    }else{
        const subscriberlist = await SubscriberCollection.find({ owner: req.params.username,listname: req.params.listname })
        res.render("listsubscribers", { owner: req.params.username, 
                                        listname: req.params.listname,
                                        subscribers: subscriberlist})
    }

});


hbs.registerHelper('add', function(a, b) {
    return a + b;
  });

hbs.registerHelper('mod', function(a, b) {
    return a % b;
  });

hbs.registerHelper("eq", function(a, b) {
    return a === b;
});

app.get('/user-home', async (req, res) => {
    req.cookies = cookie.parse(req.headers.cookie || '');
    const loggedUser = req.cookies.username;
    const userdata = await LogInCollection.findOne({ username: loggedUser })
    if (userdata){
    const firstname = userdata.firstname.charAt(0).toUpperCase() + userdata.firstname.slice(1);
    const lastname = userdata.lastname.charAt(0).toUpperCase() + userdata.lastname.slice(1);
    const userlists = await ListCollection.find({ username: loggedUser })
    res.render("user-home", { firstname: firstname, 
                                lastname: lastname,
                                email: userdata.email,
                                username: userdata.username,
                                phone: userdata.phone,
                                lists: userlists })
    }else{
        res.render("user-home")
    }
})


app.post('/signup', async (req, res) => {

    const data = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        password: req.body.password
    }

    const checking_username = await LogInCollection.findOne({ username: req.body.username })
    const checking_email = await LogInCollection.findOne({ email: req.body.email })

    if (checking_email || checking_username){
            res.send("user details already exists")
    }
    else{
        await LogInCollection.insertMany([data])
        res.status(201).render("home", {
            naming: req.body.username
        })
    }
})


app.post('/login', async (req, res) => {
    const check = await LogInCollection.findOne({ username: req.body.username })
    if (check && check.password === req.body.password){
        const userlists = await ListCollection.find({ username: req.body.username })
        const firstname = check.firstname.charAt(0).toUpperCase() + check.firstname.slice(1);
        const lastname = check.lastname.charAt(0).toUpperCase() + check.lastname.slice(1);
        res.status(201).render("user-home", { firstname: firstname, 
                                                lastname: lastname,
                                                email: check.email,
                                                username: check.username,
                                                phone: check.phone,
                                                lists: userlists })
    }
    else{
        res.send("incorrect credentials!")
    }

})

app.post('/create-list', async (req, res) => {

    const data = {
        username: req.body.username,
        email: req.body.email,
        listname: req.body.listname,
        createdAt: new Date()
    }
    console.log(data)
    const check = await ListCollection.findOne({ listname: req.body.listname })
    const userdata = await LogInCollection.findOne({ username: req.body.username })
    if (check && check.email === req.body.email && check.username === req.body.username){
        res.send("list already exists!")
    }
    else{
        await ListCollection.insertMany([data])
        const userlists = await ListCollection.find({ username: req.body.username })
        const firstname = userdata.firstname.charAt(0).toUpperCase() + userdata.firstname.slice(1);
        const lastname = userdata.lastname.charAt(0).toUpperCase() + userdata.lastname.slice(1);
        res.status(201).render("user-home", { firstname: firstname, 
                                                lastname: lastname,
                                                email: userdata.email,
                                                username: userdata.username,
                                                phone: userdata.phone,
                                                lists: userlists })
    }

})

app.post('/subscribe-list', async (req, res) => {
    const check = await SubscriberCollection.findOne({ owner:  req.body.owner,
                                                    listname: req.body.listname,
                                                    subscriber_email: req.body.email})
    if (check){
        res.send("Already subscribed!!!")
    }
    else{
    const data = {
        owner: req.body.owner,
        listname: req.body.listname,
        subscriber_name: req.body.firstname,
        subscriber_email: req.body.email
    }
    console.log(data)
    await SubscriberCollection.insertMany([data])
    res.status(201).redirect("/")
}

})

app.listen(port, () => {
    console.log('port connected');
})
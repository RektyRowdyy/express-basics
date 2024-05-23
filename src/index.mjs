import express from 'express';
import { MockUsers } from './utils/constants.mjs'
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import "./strategies/local-strategies.mjs"

const app = express();

mongoose.connect('mongodb://localhost/express_tutorial')
    .then(() => {
        console.log(`Connected to database!`);
    })
    .catch((err) => {
        console.log(`Error connection to database : ${err}`);
    })

app.use(express.json());
app.use(cookieParser('secret'));
app.use(session({
    secret: 'rekty',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);


//if you don't call the next() method the next middleware / request will not be called!
// const loggingMiddleware = (req,res,next) => {
//     console.log(`${req.method} - ${req.url}`);
//     next();
// }

// //Globally adding middleware
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;


//QUERY PARAMS
// app.get("/api/queryParams", (req,res) => {

//     console.log(req.query);

//     const {query: {filter, value} } = req

//     if(filter && value) {
//         return res.send(
//             MockUsers.filter((user) => user[filter].includes(value))
//         );
//     }

//     return res.send(MockUsers);
// })


app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
})

//Working with Sessions
app.get("/", (req, res) => {

    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;

    // res.cookie('loggedIn',true,{maxAge: 60000 * 60 * 2}) // {2 hrs}
    res.cookie('loggedIn',true,{maxAge: 60000 / 2, signed: true}) // {10 secs}
    res.status(201).send({msg: "Hello"});
});

app.post('/api/auth', (req, res) => {
    const { body: {username, password} } = req;

    const findUser = MockUsers.find((user) => user.username === username);
    if(!findUser) return res.status(401).send({msg: "BAD CREDENTIALS"});

    if(findUser.password !== password) return res.status(401).send({msg: "WRONG PASSWORD"});

    req.session.user = findUser;
    return res.status(200).send(findUser)
})

app.get('/api/auth/status', (req, res) => {

    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    })

    return req.session.user 
    ? res.status(200).send(req.session.user) 
    : res.status(401).send({msg: "NOT AUTHENTICATED"})
})

app.post('/api/cart', (req, res) => {
    if(!req.session.user) return res.sendStatus(401);

    const { body: item } = req;

    const { cart } = req.session;
    if(cart) {
        cart.push(item);
    }
    else {
        req.session.cart = [item];
    }

    return res.status(201).send(item);

})

app.get('/api/cart', (req, res) => {

    if(!req.session.user) return res.sendStatus(401);

    return res.send(req.session.cart ?? []);
})

//Passport.js and Authentication
app.post('/api/auth/passport', passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
})

app.get('/api/auth/passport/status', (req, res) => {
    console.log(`Inside /auth/passport/status endpoint`);
    console.log(req.session);
    
    return req.user ? res.status(200).send(req.user) : res.status(401).send({msg: "NOT AUTHORIZED!"})
})

app.post('/api/auth/passport/logout', (req, res) => {
    if(!req.user) return res.sendStatus(401);

    req.logout((err) => {
        if(err) return res.sendStatus(400);
        return res.sendStatus(200);
    })
})
import express from 'express';
import { MockUsers } from './utils/constants.mjs'
import routes from './routes/index.mjs'

const app = express();

app.use(express.json())

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


app.get("/", (req, res) => {
    res.status(201).send({msg: "Hello"});
});
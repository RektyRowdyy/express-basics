import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { MockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexUserById } from "../middlewares/users.middleware.mjs";
import { UserSchema } from "../models/user.models.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

//BASIC GET REQUESTS
router.get("/api/users", 
    query('filter').isString()
    .notEmpty()
    .isLength({min: 3, max: 10}).withMessage('length not matched'), 
    (req, res) => {

    //Sessions
    console.log(req.sessionID);
    req.sessionStore.get(req.session.id, (err, sessionData) => {

        if(err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);

    })

    // const result = validationResult(req);
    // console.log(result);

    // res.status(201).send(MockUsers)
    });

//ROUTE PARAMS
router.get("/api/users/:id", (req,res) => {
    const parsedId = parseInt(req.params.id)
    if(isNaN(parsedId))
            res.status(400).send("Enter a valid Id")
    else {

        const user = MockUsers.find((user) =>  user.id == parsedId );
        if(!user) 
            res.send(404).send('User does not exist');
        else 
            res.status(201).send(user);
    }
        
});

//POST REQUESTS
//we can use the same request address as this is a different type of request(POST)
router.post('/api/users', 
    checkSchema(createUserValidationSchema),
    (req,res) => {

        var result = validationResult(req);
        console.log(result);

        if(!result.isEmpty())
            return res.status(400).send({errors: result.array()})

        const data = matchedData(req);

        const newUser = { id: MockUsers[MockUsers.length-1].id+1, ...data }
        MockUsers.push(newUser);
        return res.status(201).send(newUser)
});

//PUT REQUESTS
//{updates the data resource with the new data that is passed }
//{if any data field is missed it is ignored and only the new data is send at the resource}
router.put('/api/users/:id',resolveIndexUserById, (req,res) => {
    const { body, findUserIndex } = req;

    MockUsers[findUserIndex] = { id : MockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

//PATCH REQUEST
router.patch('/api/users/:id', resolveIndexUserById, (req, res) => {

    const { body, findUserIndex } = req;

    MockUsers[findUserIndex] = { ... MockUsers[findUserIndex], ...body}
    return res.sendStatus(200);

})

//DELETE REQUEST
//{you typically don't really pass a req body while handling delete requests}
router.delete('/api/users/:id', resolveIndexUserById, (req,res) => {

    const { findUserIndex } = req;

    MockUsers.splice(findUserIndex,1)
    return res.sendStatus(200);
})

//Working with Mongo and Passport.js
router.post('/api/mongo/users', checkSchema(createUserValidationSchema), async (req,res) => {

    const result = validationResult(req);

    if(!result.isEmpty()) return res.status(400).send({errors: result.array()})

    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new UserSchema(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(newUser);
    } catch (error) {
        console.log(error);
        res.sendStatus(401);
    }
});

export default router;
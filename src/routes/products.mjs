import { Router } from "express";

const router = Router();

router.get('/api/products', (req, res) => {
    console.log(req.headers.cookie); // actually first get the cookie
    console.log(req.cookies); // get the cookie in parsed format using the cookie parser package 
    console.log(req.signedCookies); // get the cookies parsed if they are signed
    // if(req.cookies.loggedIn && req.cookies.loggedIn === 'true')
    if(req.signedCookies.loggedIn && req.signedCookies.loggedIn === 'true')
        return res.send([{id: 123, name: "chicken breast", price: 12.99}])
    else
        return res.status(403).send({msg: "sorry you are not loggedIn"})
})

export default router;
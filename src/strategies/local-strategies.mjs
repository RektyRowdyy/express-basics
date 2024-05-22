import passport from "passport";
import { Strategy } from "passport-local";
import { MockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User -> ${id}`);
    try {
        const findUser = MockUsers.find((user) => user.id === id);
        if(!findUser) throw new Error("User Not Found!")
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy((username, password, done) => {
        try {

            console.log(`Username: ${username}`);
            console.log(`Password: ${password}`);
            const findUser = MockUsers.find((user) => user.username === username);
            if(!findUser) 
                throw new Error('User not found')
            if(findUser.password !== password) 
                throw new Error('Invalid Credentials!')

            done(null, findUser);

       } 
       catch(err) {
            done(err, null);
       }
        
    })
)
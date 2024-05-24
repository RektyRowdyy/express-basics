import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUserSchema } from '../models/discordUser.models.mjs'

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    try {
        const findUser = await DiscordUserSchema.findById(id)
        return findUser ? done(null, findUser) : done(null,null);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy ({
        clientID: '1243539080961200249',
        clientSecret: 'REPrh1DiBqAKnhvuchxdScwc5cnbRxoA',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ["identify"]
    }, 
    async (accessToken, refreshToken, profile, done) => {
            let findUser;
            
            try {
                findUser = await DiscordUserSchema.findOne({ discordId: profile.id });
            } catch (error) {
                return done(error, null);
            }
            
            try {
                if(!findUser) {
                    const newUser = new DiscordUserSchema({
                            username: profile.username,
                            discordId: profile.id
                        });
                    const newSavedUser = await newUser.save();
                    return done(null,newUser);
                }
                
                return done(null, findUser);

            } catch (error) {
                console.log(error);
                return done(error, null);
            }
    })
)

//CLIENT ID
//1243539080961200249

//CLIENT SECRET
//REPrh1DiBqAKnhvuchxdScwc5cnbRxoA

//Redirect URL
//http://localhost:3000/api/auth/discord/redirect
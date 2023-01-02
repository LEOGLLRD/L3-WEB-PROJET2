const passport = require("passport");
const { ExtractJwt } = require("passport-jwt/lib");
const { Model } = require("sequelize");
var LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

//On définie une stratégie locale pour le chemin /signup
passport.use('signup', new LocalStrategy(
    {
        emailField: 'email',
        passwordField: 'password'

    },

    async (email, password, done) => {

        try {

            const user = {

                email: email,
                password: password

            }
            return done(null, user);
        } catch (error) {
            done(error);
        }

    }
));


//On définie une stratégie locale pour le chemin /login
passport.use('login', new LocalStrategy(
    {
        pseudoField: 'pseudo',
        passwordField: 'password'
    },
    async (pseudo, password, done) => {

        try {
            const user = {
                pseudo: pseudo,
                password: password
            }

            if (!user) {
                return done(null, false, { message: "User not found !" });
            }

            return done(null, user, { message: "Logged in Successfully !" });
        } catch (error) {
            done(error);
        }

    }
));


//Fonction de verification du Bearer Token
async function authenticateJWT(req, res, next) {
    try {

        //Verification que authorization existe
        const authHeader = req.headers.authorization;

        //Si il y a bien un token
        if (authHeader) {
            //On recupère le token
            const token = authHeader.split(' ')[1];

            //Verification si le token est valide
            await jwt.verify(token, 'TOP_SECRET', (err, decoded) => {

                //Si une erreur on retourne un message indiquant que l'authentification n'est pas authorisée
                if (err) {
                    console.error(err);
                    return res.status(401).send({
                        message: "Unauthorized!",
                    });
                }
                //Sinon on ajoute dans req, les informations de l'utilisateur, ce qui permet de lier le token à l'utilisateur
                else {

                    req.user = decoded.user;
                    //Puis on passe à la suite
                    next();
                }
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(401).send({
            message: "Unauthorized!",
        });
    }
}

module.exports = {authenticateJWT};
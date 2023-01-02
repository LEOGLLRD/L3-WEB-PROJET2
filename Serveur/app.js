require("./auth/auth");
require("./database/database");

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const auth = require('./auth/auth');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
//Définition d'un middleware de verification de token dans le header + spécification de la variable qui gère la route
app.use('/user', auth.authenticateJWT, secureRoute.usersRouter);
//Définition d'un middleware de verification de token dans le header + spécification de la variable qui gère la route
app.use('/astuceAuth', auth.authenticateJWT, secureRoute.astuceAuthRouter);
//Définition d'un middleware de verification de token dans le header + spécification de la variable qui gère la route
app.use('/commentAuth', auth.authenticateJWT, secureRoute.commentAuthRouter);
//Pour toutes les routes de "base", c'est la variable routes, qui gère
app.use('/', routes);


//Gestion des erreurs
app.use(function (err, req, res, next) {

    res.status(err.status || 500);
    res.json({ error: err });

});

//Ecoute du port 3000
app.listen(port, () => {
    console.log('Server started.')
});





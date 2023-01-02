
const db = require("../database/database");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");



/**  
 * Action à réaliser pour l'enregistrement d'un nouvel utilisateur 
 * 
*/
router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {

        //On verifie si l'username ou le mail est déjà attribué à quelqu'un
        //dans la base données. Le await permet d'attendre que la recherche dans 
        //la base de données soit terminée.

        //Si oui
        if (! await db.checkIfUserRegistered(req.body.username, req.body.email)) {

            //On hash le mot de passe
            const hash = await bcrypt.hash(req.body.password, 10);

            //On enregistre le nouveau compte
            await db.Register(req.body.username, req.body.email, req.body.name, req.body.lastname, hash);

            //Et on envoie OK
            return res.json(
                {
                    message: 'OK',

                }
            );

        }

        //Si non
        else {

            //On envoie KO
            return res.json(
                {
                    message: 'KO',

                }
            );

        }

    }

);

/** 
 *  routes pour consulter la listes des astuces disponibles 
 *  tous le mondes dispose à cette accées il suffit donc d'afficher 
 *  les astuces disponibles dans notre base de données 
 *  à l'aide de la méthode getListAstuces
 */
router.get('/astuces',
    async (req, res, next) => {
        try {
            const astuces = await db.getListAstuces();
            return res.json(astuces)
        } catch (error) { console.error(error); res.json({ message: 'An error occured' }) }
    }
)

/**  AFFICHER ASTUCES + COMMENTS
 *   routes pour effectuer un recherche d'une astuce à l'aide d'un mot clé
*    la route nous affichera toutes les astuces qui contiennent notre mot clé
*    ainsi que tout les commentaires liées à notre astuce 
*    nous pourrons donc effectuer une recherche de l'astuce avec autant de spécifité que 
*    nous voulons.
*/
router.post('/astuce/get',
    async (req, res, next) => {
        try {
            let ast = await db.getAstuce(req.body.mot)
            
            if (!ast) {
                res.json({ message: 'astuce not found' })
            }
            
            return res.json(ast);
        } catch (error) { console.error(error); res.json({ message: 'An error occured' }) }
    }
)


/** route pour afficher une seule astuce à l'aide d'un identifiant 
 *  cette route nous servira plus tard lorsque nous voudrons cliquer 
 *  sur une astuce pour l'afficher 
 */
router.get(
    '/astuce/getById',
    async (req, res, next) => {
        try {
            let Astuce = await db.getAstuceById(req.body.IdAstuce)
            let commentaires = await db.getAstuceComments(Astuce.IdAstuce)
            if (!Astuce) {
                res.json({ message: 'Astuce not found !' })
            }
            let result = [Astuce, commentaires]
            return res.json(result);
        } catch (error) { console.error(error); res.json({ message: 'An error occured' }) }
    }
);

/* 
* Action à réaliser pour la connexion nous renverrons un token à l'utilisateur qui sera valide
* pour une durée d'une heure
*/
router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occured.');
                        return next(error);
                    }

                    //On vérifie si un compte existe avec le couple (username, password)
                    // if(checkIfuserIsAdmin(req.body.pseudo)){res.json('you are admin')}
                    //Si oui
                    if (await db.checkIfUsernameAndPasswordMatches(req.body.username, req.body.password)) {

                        //On créer un token et on l'envoie en réponse

                        req.login(
                            user,
                            { session: false },
                            async (error) => {
                                if (error) { return next(error); }

                                const body = { _id: user.id, pseudo: user.pseudo };
                                let Admin = await db.checkIfuserIsAdmin(req.body.username);
                                //On créer un token, et on y lie un id et un pseudo
                                const token = jwt.sign(
                                    { user: body },
                                    'TOP_SECRET',
                                    { expiresIn: '1h' }
                                );
                                return res.json({ token, Admin });
                            }
                        );
                    }

                    //Si non
                    else {

                        //On retourne un message indiquant qu'aucun compte ne correspond
                        return res.json(
                            {
                                message: 'Bad credential/incorect user',
                            }
                        );
                    }
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);


//Permet d'accéder à la variable router en dehors du fichier routes.js
module.exports = router;

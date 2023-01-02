
const express = require('express');
//Routes pour les fonctions 
const astuceAuthRouter = express.Router();
//Routes pour la gestion d'utilisatuer 
const usersRouter = express.Router();
//Routes liées aux chemins /profil
const profilRouter = express.Router();
//Routes liées aux chemins /add-file
const fileRouter = express.Router();

const bcrypt = require("bcrypt");

const commentAuthRouter = express.Router();

const db = require("../database/database");
const fs = require("fs");
const path = require("path");

//Variable permettant de récupérer les informations reçues 
//via body
const bodyParser = require('body-parser');

/** 
 * Route pour la création d'une Astuce reservé à un utilisateur authentifié
*  en renseignant les champs nécessaires comme le titre de l'astuce,l'emplacement
*  de l'image qu'il voudra lui associer etc ..
*  mais aussi nous procédons à une vérification de si l'utilisateur à était déja banni
*  à l'aide de la fonction isBanned ,si c'est le cas l'utilisateur ne pourra pas créer de nouvelle astuce  
*/
astuceAuthRouter.post('/create',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //On récupère l'id associé à l'username du token
            let IdUser = await db.getIdbyUsername(req.user.pseudo);

            //On essaie d'insérer les infos
            let created = await db.createAstuce(
                req.body.titre,
                req.body.titreImg,
                req.body.mainImgPath,
                req.body.tags,
                req.body.objectInfo,
                req.body.imgInfo,
                req.body.astuce,
                IdUser);
            //Si bien inséré OK
            if (created) {
                return res.json({ message: 'OK' });
            }
            //Sinon KO
            return res.json({ message: 'KO' });

            //Si erreur on envoie un message d'erreur
        } catch (error) {
            console.error(error);
            return res.json({
                message: 'An error occured !'
            });
        }
    }
);

astuceAuthRouter.get('/nonApprouvedAstuces',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //Verification si admin
            if(!await db.checkIfuserIsAdmin(req.user.pseudo)){
                return res.json({ message: "You don't have the right to do this !" })
            }

            //On récupère l'id associé à l'username du token
            let result  = await db.getListAstucesNotApproved();
            //Si bien inséré OK
            if (result) {
                return res.json(result);
            }
            //Sinon KO
            else return res.json({ message: 'Nothing found !' });

            //Si erreur on envoie un message d'erreur
        } catch (error) {
            console.error(error);
            return res.json({
                message: 'An error occured !'
            });
        }
    }
);



/** 
 *  route pour la gestion d'utilisateur, 
 *  cette méthode étant réservée à un administrateur nous vérifions d'abord 
 *  les droits d'administrateur à l'aide du token, ensuite   
 *  l'administrateur spécifiera l'action qu'il voudra effectuer 
 *  et sur quels utilisateurs , en remplissant les champs action et Id
 *  cela dit nous devons vérifier si un utilisateur et déja banni avant de lui accorder les 
 *  priviléges administrateur , si ce dernier est banni il ne pourra pas etre promu 
 */
usersRouter.put('/adminManage',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            if (await db.checkIfuserIsAdmin(req.user.pseudo)) {
                let user = await db.getUserById(req.body.id);
                /**switch case pour l'action à effectuer 
                 * bannir debanir ou promouvoir un utilisateur ou lui enlever les privilèges d'adminstrateur,
                 * il suffit d'effectuer une recherche du tuple en question et de modifier son attribut à l'aide de
                 * la fonction update
                 * */
                switch (req.body.action) {
                    case "ban": await user.update({ isBanned: true }, { where: { idUser: req.body.id } }); return res.json({ message: 'user banned' })
                    case "unban": await user.update({ isBanned: false }, { where: { idUser: req.body.id } }); return res.json({ message: 'user unbanned' })
                    case "demote": await user.update({ isAdmin: false }, { where: { idUser: req.body.id } }); return res.json({ message: 'user demoted' })
                    case "promote": {
                        if (user.dataValues.isBanned === true) {
                            return res.json({ message: "The user you're trying to promote, is banned !" });
                        }
                        await user.update({ isAdmin: true }, { where: { idUser: req.body.id } }); return res.json({ message: 'user promoted' })
                    }
                    default: return res.json({ message: 'Action has not been understood, nothing has been done !' })
                }
            }
            else return res.json({ message: "You don't have the rights for these actions !" })
        } catch (error) { console.error(error); return res.json({ message: 'An error occured' }) }
    });


//Route permettant à un utilisateur de récupérer ses astuces
usersRouter.get('/astuces',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //On récupère les astuces de l'utilisateur
            let astuces = await db.getUserAstuce(await db.getIdbyUsername(req.user.pseudo));
            if (astuces) {
                return res.json({ astuces });
            }
            else {
                return res.json({ message: "No astuces found !" });
            }


        } catch (error) { console.error(error); return res.json({ message: 'An error occured' }) }
    });

/** route pour la gestion d'astuces
 *  cette route est réservé à un administrateur 
 *  il est donc important de s'assurer que le token appartient bien à un administrateur 
 *  si l'utilisateur dispose bien des priviléges admin il pourra donc
 *  approuver ou pas une astuce ou meme de la supprimer 
 *  il suffit d'entrer dans le body le param id ainsi que action 
 *  et de spécifier l'action et l'id qu'il voudra executer
 */
astuceAuthRouter.put('/adminManage',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //verification que l'utilisateur est un admin
            if (await db.checkIfuserIsAdmin(req.user.pseudo)) {
                //On recupère le tuple d'id : req.body.Id
                let AST = await db.getAstuceById(req.body.id);

                //Selon la valeur de req.body.action
                switch (req.body.action) {

                    //On passe IsApproved à true
                    case "approve": await AST.update(
                        {
                            isApproved: true
                        },
                        {
                            where: { idAstuce: req.body.id },
                        }
                    );
                        return res.json({ message: 'status approved' })

                    //On passe IsApproved à false
                    case "disapprove": await AST.update(
                        {
                            isApproved: false
                        },
                        {
                            where: { idAstuce: req.body.id },
                        }
                    );
                        return res.json({ message: 'status disapproved' })

                    //On supprime l'astuce
                    case "delete": await AST.destroy({ where: { idAstuce: req.body.id } });
                        return res.json({ message: 'deleted' });

                    //Si req.body.action ne correspond à aucuns, des cas précedents, on ne fait rien    
                    default: return res.json({ message: 'Action has not been understood, nothing has been done !' })


                }

            } else {
                return res.json({ message: "You don't have the right to do this !" })
            }


        } catch (error) {
            console.error(error);
            return res.json({ message: 'An error occured' })
        }
    }
);


/** route pour la gestion d'astuces
 *  cette route est réservé à un administrateur 
 *  il est donc important de s'assurer que le token appartient bien à un administrateur 
 *  si l'utilisateur dispose bien des priviléges admin il pourra donc
 *  approuver ou pas une astuce ou meme de la supprimer 
 *  il suffit d'entrer dans le body le param id ainsi que action 
 *  et de spécifier l'action et l'id qu'il voudra executer
 */
astuceAuthRouter.delete('/delete',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            let astuce = await db.Astuces.findOne({where : {idAstuce : req.body.idAstuce}});
            //Si pas d'astuce qui existe 
            if(!astuce){
                //message d'erreur
                return res.json({ message: 'No astuce exists with this id !' })
            }
            console.log("id : ", await db.getIdbyUsername(req.user.pseudo));
            console.log("astuce iduser : ", astuce.dataValues.idUser);

            if(astuce.dataValues.idUser != await db.getIdbyUsername(req.user.pseudo)){
                return res.json({ message: "You don't have the rights to do delete this astuce !" });
            }

            //On essaie de supprimer
            let del = await db.Astuces.destroy({ where: { idAstuce: req.body.idAstuce } });

            //Si succès
            if (del) {
                //Retourne un message de succès
                return res.json({ message: 'deleted' });

            }
            //Sinon message d'erreur
            else return res.json({ message: "The delete hasn't been applied because of a problem, try again" })

        } catch (error) {
            console.error(error);
            return res.json({ message: 'An error occured' })
        }
    }
);


//Route pour la modification de son profil
usersRouter.put('/modifyProfil',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //On recupère le profil actuel
            let p = await db.getProfilFromPseudo(req.user.pseudo);
            let pseudo;

            //Pour chaque attribut on verifie si va etre changé ou pas
            if (req.body.username == "") {
                pseudo = p.pseudo;
            }
            else {
                //On vérifie si le pseudo est déja utilisé
                if (await db.checkIfPseudoExists(pseudo)) {
                    return res.json({ message: "Pseudo is already used ! " });
                }
                pseudo = req.body.username;
            }
            let email;
            if (req.body.email == "") {
                email = p.email
            }
            else {
                //On verifie si le mail est déja utilisé 
                if (await db.checkIfEmailExists(email)) {
                    return res.json({ message: "Mail is already used ! " });
                }
                email = req.body.email;
            }
            let name;
            if (req.body.name == "") {
                name = p.name;
            }
            else {
                name = req.body.name;
            }
            let lastname;
            if (req.body.lastname == "") {
                lastname = p.lastname;
            }
            else {
                lastname = req.body.lastname;
            }

            //Enfin on vérifie si le mdp va être changé ou pas

            if (req.body.password == "") {

                //On update
                let result = await db.Users.update({
                    email: email,
                    pseudo: pseudo,
                    name: name,
                    lastname: lastname
                },
                    { where: { idUser: await db.getIdbyUsername(req.user.pseudo) } });

                if (result) {

                    return res.json({ message: "The update is now active, you must reconnect !" });
                } else {
                    return res.json({ message: "The update didn't work !" })
                }

            }
            else {

                //On hash le mot de passe
                const hash = await bcrypt.hash(req.body.password, 10);

                //Et on update
                let result = await db.Users.update({
                    email: email,
                    pseudo: pseudo,
                    name: name,
                    lastname: lastname,
                    password: hash

                },
                    { where: { idUser: await db.getIdbyUsername(req.user.pseudo) } });

                if (result) {

                    return res.json({ message: "The update is now active, you must reconnect !" });
                } else {
                    return res.json({ message: "The update didn't work !" })
                }

            }


        } catch (error) {
            console.error(error);
            return res.json({ message: 'An error occured' })
        }
    }
)

astuceAuthRouter.get('/nonApprouvedAstuces',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //Verification si admin
            if(!await db.checkIfuserIsAdmin(req.user.pseudo)){
                return res.json({ message: "You don't have the right to do this !" })
            }

            //On récupère l'id associé à l'username du token
            let result  = await db.getListAstucesNotApproved();
            //Si bien inséré OK
            if (result) {
                return res.json(result);
            }
            //Sinon KO
            else return res.json({ message: 'Nothing found !' });

            //Si erreur on envoie un message d'erreur
        } catch (error) {
            console.error(error);
            return res.json({
                message: 'An error occured !'
            });
        }
    }
);

/** route pour supprimer un commentaire 
*   seul un administrateur peut supprimer un commentaire
*   nous procédons donc à une vérification des droits d'admin
*   à l'aide du token et puis l'administrateur pourra procéder à une suppression
*   en entrant l'ID du commentaire en question  
*/
commentAuthRouter.delete('/adminDelete',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //On verifie que l'utilisateur est administrateur
            if (await db.checkIfuserIsAdmin(req.user.pseudo)) {
                //On recupère le commentaire
                let cmt = await db.getCommentById(req.body.IdCom);
                //Puis on supprime
                await cmt.destroy({ where: { IdComment: req.body.IdCom } });
                return res.json({ message: "comment deleted !" })
            } else return res.json({ message: "You don't have the rights to delete!" })
        } catch (error) {
            console.error(error);
            return res.json({ message: 'An error occured' })
        }
    }
)


/* 
*  route pour la Consultation d'un profil
*  l'utilisateur n'aura qu'a rentrer l'username du profil qu'il souhaite consulter 
*/
usersRouter.post('/profil',
    async (req, res, next) => {

        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //On récupère le profil
            let profil = await db.getProfilFromPseudo(req.body.username);
            //Si le profil existe 
            if (profil) {
                //On le retourne
                return res.json({
                    profil: profil,
                });
            }
            else {
                //Sinon message d'information qu'il n'existe pas
                return res.json({ message: "This profil doesn't exist !" })

            }
        } catch (error) {
            console.error(error); return res.json({ message: 'An error occured' });
        }
    }
);


//Action à réaliser pour la route /users/list  en post
usersRouter.get('/list',
    async (req, res, next) => {


        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //Verification si le token est lié à un compte administrateur
            //Si oui
            if (await db.checkIfuserIsAdmin(req.user.pseudo)) {

                //On récupère tout les profiles utilisateurs
                let result = await db.getAllUsers();
                return res.json(result);
            }

            //Si non
            else {

                //Message qui indique que le compte n'est pas administrateur
                return res.json({

                    message: 'You are not an administrator !'

                });

            }

            //Si une erreur a lieu, on retourne un message d'erreur
        } catch (error) {
            console.error(error);
            return res.json({

                message: 'An error occured !'

            });
        }
    }
);


/** route pour créer un commentaire 
 *  nous vérifions d'abord si l'utilisateur est banni ou non 
 *  pour ensuite pouvoir créer son commentaire 
*/
commentAuthRouter.post('/create',
    async (req, res, next) => {
        try {

            //On vérifie si l'utilisateur est banni ou pas
            if (await db.isBanned(req.user.pseudo)) {
                return res.json({ message: 'you cannot proceed, you are banned !' })
            }

            //On récupère l'id associé à l'username du token
            let idUser = await db.getIdbyUsername(req.user.pseudo);
            console.log("iduser : ", idUser)

            //On essaie d'insérer les infos
            let created = await db.createComment(
                req.body.comment,
                req.body.idAstuce,
                idUser,
                req.user.pseudo
            );
            //Si bien inséré OK
            if (created) {
                return res.json({ message: 'OK' });
            }
            //Sinon KO
            return res.json({ message: 'KO' });

            //Si erreur on envoie un message d'erreur
        } catch (error) {
            console.error(error);
            return res.json({
                message: 'An error occured !'
            });
        }
    }
);
//Permet d'accéder aux différentes variables du fichier secure-routes dans d'autres fichiers
module.exports = { profilRouter, fileRouter, usersRouter, astuceAuthRouter, commentAuthRouter, usersRouter };
const { Sequelize, Op, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");


//Création de la variable de connexion avec les paramètres 
//de connexion du serveur
const sequelize = new Sequelize(

    'progwebserveur',
    'root',
    '',

    {

        host: "127.0.0.1",
        dialect: 'mysql'

    }

);

Connection();

// récuperer toutes les astuces pas approuvées
async function getListAstucesNotApproved() {
    return await Astuces.findAll({where : {isApproved : false}})
}

const Commentaire = sequelize.define('Commentaire', {
    idComment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comment: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    pseudo: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

}
)


// Création de la table astuces 
const Astuces = sequelize.define('Astuces', {
    idAstuce: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titreAst: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    titreIMG: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    imgAst: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    tags: {
        type: DataTypes.STRING(45)
    },
    objectInfo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    imgInfo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    astuce: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})
sequelize.sync().then(() => {
    console.log("table created")
}).catch((err) => {
    console.error(err);
});




//Création de la table users et définition des attributs
const Users = sequelize.define("users", {


    idUser: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    pseudo: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    name: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    lastName: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    password: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },

    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    profilepicture: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
    }

});

Astuces.hasMany(Commentaire, {
    foreignKey: {
        name: "idAstuce",
        allowNull: true
    },
    onDelete: 'CASCADE'
});

Users.hasOne(Astuces, {
    foreignKey: {
        name: "idUser",
        allowNull: false
    },
    onDelete: 'CASCADE'
});

Users.hasMany(Commentaire, {
    foreignKey: {
        name: "idUser",
        allowNull: false
    }
});




//On synchronise la création de la table Users
sequelize.sync().then(() => {
    console.log("Table created successfuly !");

}).catch((error) => {
    console.error("Unable to create table :", error);

});


//Fonction permettant l'enregistrement d'un nouveau compte
function Register(pseudo, email, name, lastname, password) {



    sequelize.sync().then(() => {

        Users.create({
            pseudo: pseudo,
            email: email,
            name: name,
            lastName: lastname,
            password: password

        }).then(res => {
            console.log(res);
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);

        });

    }).catch((error) => {
        console.error("Unable to create record : ", error);

    });

};

async function checkIfPseudoExists(pseudoVar) {
    try {
        let result = await Users.findOne({
            where: {
                [Op.or]: [
                    { pseudo: String(pseudoVar) }
                ],
            },
        });
        if (result) {
            return true;
        } else {
            return false;
        };
    } catch (error) {
        console.log(error);
        return true;
    }
}
async function checkIfEmailExists(emailvar) {
    try {
        let result = await Users.findOne({ where: { [Op.or]: [{ email: emailvar }] } });
        if (result) {
            return true;
        } else {
            return false;
        };
    } catch (error) {
        console.log(error);
        return true;
    }
}

/*Fonction retournant vrai ou faux en fonction de si
le pseudo ou l'username sont déjà utilisés.
*/
async function checkIfUserRegistered(pseudoVar, emailVar) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu, ou
            ayant pour mail celui reçu aussi.
            */
            where: {
                [Op.or]: [
                    { pseudo: String(pseudoVar) },
                    { email: String(emailVar) }
                ],
            },
        });

        //Si un reésultat est trouvé 
        if (result) {
            //On return true
            return true;
        } else {
            //Sinon false
            return false;
        };

        //Si une erreur a lieu, on retourne vrai
        //Cette fonction est utilisée dans la création d'un compte
        //si jamais une erreur a lieu lors de l'appel de cette fonction, pour éviter les problèmes au niveau de la base de données, 
        //on retourne vrai ce qui entrainera l'annulation de la création du compte (pour éviter la création de doublons)
    } catch (error) {
        console.log(error);
        return true;

    }

}

//Fonction verifiant si un compte ayant pour pseudo : pseudoVar 
//et password : passwordVar, existe
async function checkIfUsernameAndPasswordMatches(pseudoVar, passwordVar) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu, ou
            ayant pour mail celui reçu aussi.
            */
            where: {
                pseudo: String(pseudoVar)
            },
        });



        //Si un résultat est trouvé 
        if (result) {

            let match = await bcrypt.compare(passwordVar, result.password);
            if (match) {
                return true;
            }
            return false;
        } else {
            //Sinon false
            return false;
        };


    } catch (error) {
        console.log(error);
        return false;

    }



}

//Fonction retournant le profil utilisateur d'un utilisateur
//en fonction de son pseudo
async function getProfilFromPseudo(pseudo) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu
            */
            where: {
                pseudo: String(pseudo),
            },
        });

        //Si un résultat est trouvé 
        if (result) {
            //On return le profil
            const profil = {

                pseudo: result.pseudo,
                email: result.email,
                name: result.name,
                lastname: result.lastName

            }
            return profil;
        } else {
            //Sinon false
            return null;
        };


    } catch (error) {
        console.log(error);
        return false;

    }


}

//Fonction retournant vrai ou faux si le compte
//associé à pseudoVar est administrateur ou non
async function checkIfuserIsAdmin(pseudoVar) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu, et
            ayant la valeur isAdmin à 1
            */
            where: {
                pseudo: String(pseudoVar),
                isAdmin: 1
            },
        });

        //Si un résultat est trouvé 
        if (result) {
            //On return true
            return true;
        } else {
            //Sinon false
            return false;
        };


    } catch (error) {
        console.log(error);
        return false;

    }

}

//Fonction supprimant le compte ayant pour pseudo : pseudoVar
async function deleteFromPseudo(pseudoVar) {

    try {

        Users.destroy(
            {
                where:
                    { pseudo: pseudoVar }
            })
            //Suppresion du tuples avec pseudo = pseudoVar
            .then(count => {


                if (!count) {
                    return false;
                }
                else return true;

            }).catch((err) => {
                console.error(err);

            });

    } catch (error) {
        console.error(error);
    }


}

//Fonction permettant la connexion à la base de données
function Connection() {

    sequelize.authenticate().then(() => {
        console.log("Connection has been established successfuly !");
    }).catch((error) => {
        console.error("Unable to connect to the database : ", error);
    });

};

//Fonction retournant tout les profiles utilisateurs 
async function getAllUsers() {

    try {
        let result = await Users.findAll({
            attributes: ['idUser','name', 'lastname', 'email', 'pseudo', 'isBanned', 'isAdmin', 'createdAt'],  //On ne récupère que les attributs listés
            raw: true
        }).catch((err) => {
            console.error(err);
            return {};
        });

        return result;

    } catch (error) {
        return {};
    }


}

/** 
 * Fonction permettant de récupérer les astuces qui contiennent le mot clé mot 
*/
async function getAstuce(mot) {

    return await Astuces.findAll(
        {
            where: {
                [Op.or]: {
                    titreAst: { [Op.like]: "%"+mot+"%" },
                    tags: { [Op.like]: "%"+mot+"%" },
                    titreIMG: { [Op.like]: "%"+mot+"%" },
                    objectInfo: { [Op.like]: "%"+mot+"%" },
                    imgInfo: { [Op.like]: "%"+mot+"%" },
                    astuce: { [Op.like]: "%"+mot+"%" }
                }, 
                isApproved : true
            }
            
            ,
            include:{
                model : Commentaire,
                attributes : ['idComment', 'comment','pseudo', 'createdAt','idUser']
                
                
            }
            
        });
}

// récuperer toutes les astuces
async function getListAstuces() {
    return await Astuces.findAll()
}


// récuperer toutes les astuces pas approuvées
async function getListAstucesNotApproved() {
    return await Astuces.findAll({where : {isApproved : false}})
}


//fonction pour récuperer les astuces d'un utilisateur
async function getUserAstuce(id) {
    return await Astuces.findAll({ Where: { idUser: id }, raw: true })
}


//fonction pour récuperer les astuces par un identifiant 
async function getAstuceById(id) {
    return await Astuces.findOne({ Where: { idAstuce: id } })
}
//fonction pour récuperer tous les commentaires d'une astuce 
async function getAstuceComments(id) {
    return await Commentaire.findAll({ attributes: ['comment'] }, { Where: { idAstuce: id } })
}




//Fonction qui créer une astuce 
async function createAstuce(titre, titreImg, mainImgPath, tags, objectInfo, imgInfo, astuce, idUser) {

    return await Astuces.create({

        titreAst: titre,
        titreIMG: titreImg,
        imgAst: mainImgPath,
        tags: tags,
        objectInfo: objectInfo,
        imgInfo: imgInfo,
        astuce: astuce,
        idUser: idUser

    });
};

//Retourne un User par son Id
async function getUserById(id) {

    return await Users.findOne({
        where: { IdUser: id }
    });
}

//Fonction qui créer un commentaire 
async function createComment(comment, IdAstuce, IdUser, pseudo) {

    return await Commentaire.create({

        comment: comment,
        idAstuce: IdAstuce,
        idUser: IdUser,
        pseudo: pseudo
    });

};

//Retourne le statut  du compte (banni ou pas) en fonction de l'username
async function isBanned(username) {
    let user = await Users.findOne({
        attributes: ['isBanned'],
        where: {
            pseudo: username
        }
    });
    return user.dataValues.IsBanned;
}


//Retourne un id en fonction de l'username
async function getIdbyUsername(username) {

    let user = await Users.findOne({
        attributes: ['IdUser'],
        where: {
            pseudo: username
        }
    });
    return user.dataValues.IdUser;
}

//Retourne un tuple de la table commentaire, par son identifiant
async function getCommentById(Id) {
    return await Commentaire.findOne({ Where: { IdComment: Id } })
}



//Permet d'accéder aux différentes variables et fonctions du fichier database dans d'autres fichiers
module.exports = { Register, getUserById, getListAstucesNotApproved, getIdbyUsername, createComment, checkIfUserRegistered, getCommentById, getAllUsers, deleteFromPseudo, checkIfUsernameAndPasswordMatches, getProfilFromPseudo, checkIfuserIsAdmin, sequelize, Sequelize, Users, Astuces, Commentaire, getAstuce, getAstuceById, createAstuce, isBanned, getUserAstuce, getListAstuces, getAstuceComments, checkIfPseudoExists, checkIfEmailExists }; 
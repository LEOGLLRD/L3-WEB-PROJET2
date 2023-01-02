export class User {
    idUsers: number;
    email: string;
    pseudo: string;
    name: string;
    lastName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(idUsers: number,
        email: string,
        pseudo: string,
        name: string,
        lastName: string,
        password: string,
        createdAt: Date,
        updatedAt: Date){
            this.idUsers = idUsers;
            this.email = email;
            this.pseudo = pseudo;
            this.name = name;
            this.lastName = lastName;
            this.password = password;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
}

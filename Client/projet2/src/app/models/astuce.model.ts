export class astuce {
    idAstuce:number;
    titreAstuce:string;
    objectInfo:string;
    description:string;
    createdDate:Date;
    updatedDate:Date;
    snaps:number;
    imageUrl:string;

    constructor(idAstuce: number, titreAstuce: string, objectInfo:string, description: string, imageUrl: string, createdDate: Date, updatedDate: Date, snaps: number){
        this.idAstuce = idAstuce;
        this.titreAstuce = titreAstuce;
        this.objectInfo = objectInfo;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.snaps = snaps;

    }
}
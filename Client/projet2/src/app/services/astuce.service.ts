import { Injectable } from '@angular/core';
import { TokenStorage } from './TokenStorage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AstuceService {

  //Show all astuce of a connect user
  async showMyAstuce(){
    //Transformation du localstorage en token valide
   let token = JSON.parse(this.tokenStorage.getToken());
   token = token.valueOf();
 let headersList = {
   "Authorization": "Bearer "+token['token'],
   "Content-Type": "application/x-www-form-urlencoded"
 }
  
  let bodyContent ;
  
  let response = await fetch("http://localhost:3000/user/astuces", { 
    method: "GET",
    body: bodyContent,
    headers: headersList
  });
  
  if(response){
    
   return response.json();
  }else{
   return null;
   
  }
  
} 
//For delete a astuce by his creator
async deleteAstuce(idAstuce:any){
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBzZXVkbyI6InJvbSJ9LCJpYXQiOjE2NzI0MjM3ODksImV4cCI6MTY3MjQyNzM4OX0.eevNuz4Lany6FWiJdceApf3Ew5G24rYnPittm7Qc_SA",
    "Content-Type": "application/x-www-form-urlencoded"
   }
   
   let bodyContent = "idAstuce="+idAstuce;
   
   let response = await fetch("http://localhost:3000/astuceAuth/delete", { 
     method: "DELETE",
     body: bodyContent,
     headers: headersList
   });
   
   let data = await response.text();
   console.log(data);
}

//For the search bar
async SearchAstuce(userSearch:any){
  let headersList = {

    "Content-Type": "application/x-www-form-urlencoded"
   }
   
   let bodyContent = "mot="+userSearch.barre;
   
   let response = await fetch("http://localhost:3000/astuce/get", { 
     method: "post",
     body: bodyContent,
     headers: headersList
   });

   if(response){
    let data = response.json();
    return data;
   }else{
    return null;
   }
}

//methode pour ajouter une astuce
  async addAstuce(astuce:any){
    
    //Transformation du localstorage en token valide
			let token = JSON.parse(this.tokenStorage.getToken());
			token = token.valueOf();
    let headersList = {
      "Authorization": "Bearer "+token['token'],
      "Content-Type": "application/x-www-form-urlencoded"
    }
     //Titre image a redefinir quand input file sera fonctionel
     let bodyContent = "titre="+astuce.TitreAst+"&titreImg=titreimage&mainImgPath=Path&tags="+astuce.Tags+"&objectInfo="+astuce.ObjectInfo+"&imgInfo="+astuce.ImgInfo+"&astuce="+astuce.Astuce;
     
     let response = await fetch("http://localhost:3000/astuceAuth/create", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     });
     
     let data = await response.text();
     console.log("test"+data);
     if(data.startsWith('{"message":"OK')){
      let message ="Création de votre astuce réussi";
  this.snackBar.open(message,'', {
    duration: 2000,
    verticalPosition: "top", // Allowed values are  'top' | 'bottom'
    horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
  });
  this.router.navigate(['/accueil']);
     }else{
      let message ="Création de votre astuce non valid";
  this.snackBar.open(message,'', {
    duration: 2000,
    verticalPosition: "top", // Allowed values are  'top' | 'bottom'
    horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
  });
     }
  }
  

  constructor(private tokenStorage:TokenStorage,
              private snackBar: MatSnackBar,
              private router: Router,
              private http: HttpClient) { }
}

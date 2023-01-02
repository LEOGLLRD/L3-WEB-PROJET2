import { Injectable } from '@angular/core';
import { TokenStorage } from './TokenStorage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  //for show all astuce non approve
  async showAstuceNonApprove(){
     //Transformation du localstorage en token valide
     let token = JSON.parse(this.tokenStorage.getToken());
     token = token.valueOf();
     let headersList = {
     "Authorization": "Bearer "+token['token'],
     "Content-Type": "application/x-www-form-urlencoded"
     }
        
     
     let bodyContent;
     
     let response = await fetch("localhost:3000/astuceAuth/nonApprouvedAstuces", { 
       method: "GET",
       body: bodyContent,
       headers: headersList
     });
     
     let data = await response.text();
     console.log(data);
     
  }
  //for delete astuce
  async suppAstuce(idAstuce:any){
     //Transformation du localstorage en token valide
let token = JSON.parse(this.tokenStorage.getToken());
token = token.valueOf();
let headersList = {
"Authorization": "Bearer "+token['token'],
"Content-Type": "application/x-www-form-urlencoded"
}
   
   let bodyContent = "id="+idAstuce+"&action=delete";
   
   let response = await fetch("http://localhost:3000/astuceAuth/adminManage", { 
     method: "PUT",
     body: bodyContent,
     headers: headersList
   });
   
   let data = await response.text();
   console.log(data);
   
  }


//for approve astuce
async approveAstuce(idAstuce:any){
 //Transformation du localstorage en token valide
let token = JSON.parse(this.tokenStorage.getToken());
token = token.valueOf();
let headersList = {
"Authorization": "Bearer "+token['token'],
"Content-Type": "application/x-www-form-urlencoded"
}
   
   let bodyContent = "id="+idAstuce+"&action=approve";
   
   let response = await fetch("http://localhost:3000/astuceAuth/adminManage", { 
     method: "PUT",
     body: bodyContent,
     headers: headersList
   });
   
   let data = await response.text();
   console.log(data);
   
}

  //for demote user
  async demoteUser(idUser:any){
//Transformation du localstorage en token valide
let token = JSON.parse(this.tokenStorage.getToken());
token = token.valueOf();
let headersList = {
"Authorization": "Bearer "+token['token'],
"Content-Type": "application/x-www-form-urlencoded"
}

  
  let bodyContent = "id="+idUser+"&action=demote";
  
  let response = await fetch("http://localhost:3000/user/adminManage", { 
    method: "PUT",
    body: bodyContent,
    headers: headersList
  });
  
  let data = await response.text();
  console.log(data);
  
  }
  //promote user
  async promoteUser(idUser:any){
    //Transformation du localstorage en token valide
    let token = JSON.parse(this.tokenStorage.getToken());
    token = token.valueOf();
  let headersList = {
    "Authorization": "Bearer "+token['token'],
    "Content-Type": "application/x-www-form-urlencoded"
  }
   
      
      let bodyContent = "id="+idUser+"&action=promote";
      
      let response = await fetch("http://localhost:3000/user/adminManage", { 
        method: "PUT",
        body: bodyContent,
        headers: headersList
      });
      
      let data = await response.text();
      console.log(data);
      
   }


  //banne user
  async bannedUser(idUser:any){
   //Transformation du localstorage en token valide
   let token = JSON.parse(this.tokenStorage.getToken());
   token = token.valueOf();
 let headersList = {
   "Authorization": "Bearer "+token['token'],
   "Content-Type": "application/x-www-form-urlencoded"
 }
  
     
     let bodyContent = "id="+idUser+"&action=ban";
     
     let response = await fetch("http://localhost:3000/user/adminManage", { 
       method: "PUT",
       body: bodyContent,
       headers: headersList
     });
     
     let data = await response.text();
     console.log(data);
     
  }
  
  //unbanne user
  async unbanUser(idUser:any){
    //Transformation du localstorage en token valide
    let token = JSON.parse(this.tokenStorage.getToken());
    token = token.valueOf();
  let headersList = {
    "Authorization": "Bearer "+token['token'],
    "Content-Type": "application/x-www-form-urlencoded"
  }
   
      
      let bodyContent = "id="+idUser+"&action=unban";
      
      let response = await fetch("http://localhost:3000/user/adminManage", { 
        method: "PUT",
        body: bodyContent,
        headers: headersList
      });
      
      let data = await response.text();
      console.log(data);
      
   }

  async getAllUsersForAdmin() {
    //Transformation du localstorage en token valide
			let token = JSON.parse(this.tokenStorage.getToken());
			token = token.valueOf();
    let headersList = {
      "Authorization": "Bearer "+token['token'],
      "Content-Type": "application/x-www-form-urlencoded"
    }
     
     let bodyContent ;     
     let response = await fetch("http://localhost:3000/user/list", { 
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
  constructor(private tokenStorage:TokenStorage,
              private snackBar: MatSnackBar,
              private router: Router) { }
}

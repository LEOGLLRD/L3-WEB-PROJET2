import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { authServices } from '../services/auth.service';
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../services/TokenStorage.service';
import {Location} from '@angular/common';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatMenuItem } from '@angular/material/menu';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 verify:any;
//Validators for the form
loginForm = new FormGroup({
  username: new FormControl('',Validators.required),
  password: new FormControl('',Validators.compose([Validators.minLength(8), Validators.required])),

})

get username(){return this.loginForm.get('username')}
get password(){return this.loginForm.get('password')}

  constructor(private authService: authServices,
               private tokenStorage: TokenStorage,
               private location: Location,
              private http: HttpClient,
              private AuthServices:authServices,
              private router: Router,
              private snackBar: MatSnackBar
   ) {
    
   }

  ngOnInit(): void {
 //For block if a user is connect and try to relogin
 this.verify = this.tokenStorage.getToken();
 if(this.verify){
   this.router.navigate(['/accueil']);
 }
    }
  
//For the connection
  login(userlogin:any){
    console.log(userlogin)
  this.AuthServices.login(userlogin).subscribe((res:any)=>{
    console.log(res)
    let response = JSON.stringify(res);

    //Compare the result for the alert
if(response.startsWith('{"message"')){
  let message ="erreur de connexion";
  this.snackBar.open(message,'', {
    duration: 2000,
    verticalPosition: "top", // Allowed values are  'top' | 'bottom'
    horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
  });
}else{
  let message = "connecté";
    let token = JSON.stringify(res);

    this.tokenStorage.saveToken(token);
    this.tokenStorage.getToken();  
    this.snackBar.open(message,'', {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'

      //fair un routerLink pour emmener sur le composant d'accueil
    });

    //Verification if user is admin
    //J'oblige le boolean à passer en string, je le met dans un session storage (admin) pour des verif sur d'autres page
    let admin = JSON.stringify(window.sessionStorage.getItem('auth-token')?.endsWith("true}"))
    //Si il user admin, je le redirect vers la bonne page
    sessionStorage.setItem('admin',admin);
    if(admin == "true"){
      this.router.navigate(['/admin']);
      window.location.reload();

    }else{
    this.router.navigate(['/accueil']);
    window.location.reload();
    }
  }
  
  });
}
}
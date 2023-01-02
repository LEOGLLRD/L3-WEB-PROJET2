import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import {ErrorStateMatcher} from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { authServices } from '../services/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatMenuItem } from '@angular/material/menu';
import { TokenStorage } from '../services/TokenStorage.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})


export class RegisterComponent implements OnInit {
verify:any;
  //Validators for the form
  registerForm = new FormGroup({
    username: new FormControl('',Validators.required),
    email : new FormControl('',Validators.compose([Validators.required, Validators.email])),
    name: new FormControl('',Validators.required),
    lastname: new FormControl('',Validators.required),
    password: new FormControl('',Validators.compose([Validators.minLength(8), Validators.required])),

  })
  //Get for message in the html page
  get username(){return this.registerForm.get('username')}
  get email(){return this.registerForm.get('email')}
  get name(){return this.registerForm.get('name')}
  get lastname(){return this.registerForm.get('lastname')}
  get password(){return this.registerForm.get('password')}
  postId: any;
  users: any
  constructor(
    private location: Location,
    private http: HttpClient,
    private AuthServices:authServices,
    private router: Router,
    private snackBar: MatSnackBar,
    private tokenStorage: TokenStorage
  ) {}

 
  goBack(): void {
    this.location.back();
  }
  //When form is send, this method is call
  onClickSubmit(userlogin:any){

    console.log(userlogin)
    this.AuthServices.register(userlogin).subscribe((res:any)=>{
      let response = JSON.stringify(res);
      //Compare the result for the alert
if(response.startsWith('{"message":"OK')){
  let message ="Inscription réussi";
  this.snackBar.open(message,'', {
    duration: 2000,
    verticalPosition: "top", // Allowed values are  'top' | 'bottom'
    horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
  });
  this.router.navigate(['/login']);

}else{
  let message ="Inscription non valid";
  this.snackBar.open(message,'', {
    duration: 2000,
    verticalPosition: "top", // Allowed values are  'top' | 'bottom'
    horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
  });
}
  })
this.router.navigate(['/login']);
  }
  ngOnInit(): void {
//For block if a user is connect and try to relogin
this.verify = this.tokenStorage.getToken();
if(this.verify){
  this.router.navigate(['/accueil']);
}
  
}
}
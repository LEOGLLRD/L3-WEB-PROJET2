import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, NgModel } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetProfileService } from '../services/get-profile.service';
import { BehaviorSubject } from 'rxjs';
import { TokenStorage } from '../services/TokenStorage.service';
import { Router } from  '@angular/router';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  verify:any;
  postId: any;
  users: any;

  //Validators for the form

  editProfilForm = new FormGroup({
    name: new FormControl('',Validators.required),
    lastName: new FormControl('', Validators.required),
    pseudo: new FormControl('', Validators.required),
    email : new FormControl('',Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('',Validators.compose([Validators.minLength(8), Validators.required])),


  })
  get name(){return this.editProfilForm.get('name')}
  get lastName(){return this.editProfilForm.get('lastName')}
  get pseudo(){return this.editProfilForm.get('pseudo')}
  get email(){return this.editProfilForm.get('email')}
  get password(){return this.editProfilForm.get('password')}

  constructor(
    private location: Location,
    private http: HttpClient,
		private GetProfileService: GetProfileService,
    private tokenStorage: TokenStorage,
    private router: Router) {

    }

  //Permet de revenir en arriere
  goBack(): void {
    this.location.back();
  }

  // Submit de l'edit du profil sur l'activation du bouton. On fait une requete avec les informations necessaires dans le body.
  // userinfo = formulaire des infos
  onClickSubmit(userinfo:any){
    
      // On verifie ici que les champs ont été remplis afin de ne pas rentrer des champs vides lors de l'update
    if(userinfo['name'] && userinfo['username'] && userinfo['email'] && userinfo['pseudo']){


      let result = this.GetProfileService.editProfile(userinfo)
      console.log("result",result)
    
      }
 
    
  }


  //sur le ngOnInit, il faudra setup les valeurs par défaut à celles trouvées de l'utilisateur dans le bdd
  ngOnInit(): void {
  
  //For block if a user is not connect
 this.verify = this.tokenStorage.getToken();
 if(!this.verify){
   this.router.navigate(['/accueil']);
 }

 //For block a user admin
 let admin = window.sessionStorage.getItem('admin');
 if(admin == "true"){
   this.router.navigate(['/admin']);
 }
  }
} 
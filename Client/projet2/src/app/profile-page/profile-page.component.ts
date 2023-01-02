import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, NgModel } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { GetProfileService } from '../services/get-profile.service';
import { TokenStorage } from '../services/TokenStorage.service';
import { Router } from  '@angular/router';





@Component({
selector: 'app-profile-page',
templateUrl: './profile-page.component.html',
styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
	verify:any;
	postId: any;
	token: any;
	profil={
		pseudo:'',
		email:'',
		name:'',
		lastname:''
	}
	constructor(
		private location: Location,
		private http: HttpClient,
		private GetProfileService: GetProfileService,
		private router: Router,
		private tokenStorage: TokenStorage


	) {}
	//
	async ngOnInit() {

		//Verification, if the user is log, if not -> login page
		this.verify = this.tokenStorage.getToken();
		if(!this.verify){
		  this.router.navigate(['/login']);
		}
		

		let username = {
			username:localStorage.getItem('username')
		}
		if(username['username']){
			//on appelle la methode getprofile avec le token et le username qu'on stocke en local et sessionstorage 
			let result = this.GetProfileService.getprofile(username).then(data => data.profil);
			this.profil = (await result)
			
		}
	}

	//Permet de revenir en arriere
	goBack() {
		this.location.back();
	}

	test(){
		
	
		

	}

	


	

}

// sur le ngOnInit, il faudra setup les valeurs par défaut à celles trouvées de l'utilisateur dans le bdd


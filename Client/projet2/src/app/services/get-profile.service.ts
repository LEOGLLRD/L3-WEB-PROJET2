import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';
import { User } from '../models/User';
import { TokenStorage } from './TokenStorage.service';


const httpOptions = {
headers: new HttpHeaders(
	{
	'Content-Type': 'application/json',
	
	
	}
)
};

@Injectable({
providedIn: 'root'
})

export class GetProfileService{

	profil:any;


	constructor(
		private http: HttpClient,
		private TokenStorage:TokenStorage,) {}

		//Methode de getProfile
	async getprofile(username:any) {
		
		if(this.TokenStorage.getToken() != null){
			//Transformation du localstorage en token valide
			let token = JSON.parse(this.TokenStorage.getToken());
			token = token.valueOf();
			console.log(token['token'])

			//stock du header content et authorization (qui contient le token)
			let headersList = {
			"Authorization": "Bearer "+token['token'],
			"Content-Type": "application/x-www-form-urlencoded"
			}
			//body avec les infos a envoyer
			let bodyContent = "username=" +username['username'];
			let response = fetch("http://localhost:3000/user/profil?"+"username=" +username['username'], {
				method: "POST",
				body: bodyContent,
				headers: headersList
			//on json la réponse avec un .then
			}).then(response => response.json())
			console.log("response",response)
			return response
		}
	}
		


	//methode de editProfile
	async editProfile(userinfo:any) {
		console.log('editProfile options',userinfo)
		if(this.TokenStorage.getToken() != null){
			//Transformation du localstorage en token valide
			let token = JSON.parse(this.TokenStorage.getToken());
			token = token.valueOf();
			console.log(token['token'])

			//stock du header content et authorization (qui contient le token)
			let headersList = {
				"Authorization": "Bearer "+token['token'],
				"Content-Type": "application/x-www-form-urlencoded"
			}
			//body avec les infos a envoyer
			const bodyContent = "name="+userinfo.prenom+"&lastname="+userinfo.nom+"&username="+userinfo.pseudo+"&email="+userinfo.email;
			let response = fetch("http://localhost:3000/user/profil?"+"username=" +userinfo['username'], {
				method: "PUT",
				body: bodyContent,
				headers: headersList
			})
			console.log("editProfile response",response)
		}
	}

		
		


		


}

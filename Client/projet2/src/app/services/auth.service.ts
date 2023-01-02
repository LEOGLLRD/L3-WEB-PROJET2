import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';
import { User } from '../models/User';






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
export class authServices {
  stockdata:any;
  

  
  constructor(private http: HttpClient,
    




    ) {}


  register(userlogin:any){
    const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const body = "name="+userlogin.name+"&lastname="+userlogin.lastname+"&password="+userlogin.password+"&username="+userlogin.username+"&email="+userlogin.email;
  
    return this.http.post('http://localhost:3000/signup', body, { headers });
    
  }

//For the login
//Utilisateur



login(userlogin: any) {
  const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = "username=" + userlogin.username+"&password="+userlogin.password;
    console.log(body)
    localStorage.setItem("username", userlogin.username)
    return this.http.post('http://localhost:3000/login', body, { headers });
}


  
 


  

    
   





}




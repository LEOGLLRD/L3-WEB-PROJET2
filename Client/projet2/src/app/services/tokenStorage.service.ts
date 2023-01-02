import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  constructor() { }
  // listes des methodes pour stocker, remove, set et save le token, que l'on utilise dans nos requetes

  signOut(): void {
    window.sessionStorage.clear();
  }
  public saveToken(token: string): void {


    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {



    let returnwin = window.sessionStorage.getItem(TOKEN_KEY);
if (!returnwin){
  returnwin = '';
}
    return returnwin;
  }




  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
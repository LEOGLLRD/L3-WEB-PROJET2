import { Component, OnInit } from '@angular/core';
import { TokenStorage } from '../services/TokenStorage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
 verify:any;
      
  constructor(private tokenStorage: TokenStorage,
              private router: Router){};
     admin = window.sessionStorage.getItem('admin');

   ngOnInit(): void {
    
      this.verify = this.tokenStorage.getToken();
      if(!this.verify){
        this.router.navigate(['/login']);
      }
  }
//For logout and redirect in the login page
  logout(){
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);

      window.location.reload();
    

  }

}

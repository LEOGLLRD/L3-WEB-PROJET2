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
import { AdminService } from '../services/admin.service';

  @Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  profils:any;
  constructor(private authService: authServices,
    private tokenStorage: TokenStorage,
    private location: Location,
   private http: HttpClient,
   private AuthServices:authServices,
   private router: Router,
   private snackBar: MatSnackBar,
   private adminService: AdminService
) {

}
//demote user
async demote(idUser:any){
  await this.adminService.demoteUser(idUser);
  window.location.reload();
}
//promote User
async promoteUser(idUser:any){
  await this.adminService.promoteUser(idUser);
  window.location.reload();
  }

//unban user
async unbanThisUser(idUser:any){
await this.adminService.unbanUser(idUser);
window.location.reload();
}

//Ban user
async bannedThisUser(idUser:any){
  await this.adminService.bannedUser(idUser);
  window.location.reload();
}
  async ngOnInit() {
      let admin = window.sessionStorage.getItem('admin');
      if(admin != "true"){
        this.router.navigate(['/accueil']);
      }
      
      
        
        let result = await this.adminService.getAllUsersForAdmin();
        if(result == null){
          let message ="Aucun utilisateur trouvé";
          this.snackBar.open(message,'', {
            duration: 2000,
            verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          });
          return
        }
        this.profils = result;
                console.log(this.profils);  
    }

}

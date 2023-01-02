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
  selector: 'app-admin-astuce',
  templateUrl: './admin-astuce.component.html',
  styleUrls: ['./admin-astuce.component.css']
})
export class AdminAstuceComponent implements OnInit{
  astuces:any;
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


  async ngOnInit(){
    let result = await this.adminService.showAstuceNonApprove;
    if(result == null){
      let message ="Aucun utilisateur trouvé";
      this.snackBar.open(message,'', {
        duration: 2000,
        verticalPosition: "top", // Allowed values are  'top' | 'bottom'
        horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
      });
      return
    }
    this.astuces = result;
    console.log(this.astuces)
   
  }
}

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
import { AstuceService } from '../services/astuce.service';

@Component({
  selector: 'app-my-astuce',
  templateUrl: './my-astuce.component.html',
  styleUrls: ['./my-astuce.component.css']
})
export class MyAstuceComponent implements OnInit{
astuces:any;
approve="approuvé";
constructor(
  private astuceService: AstuceService,
  private snackBar:MatSnackBar
) {}

//delete with id recup in the form
async SuppAstuce(idAstuce:any){
  let response =  await this.astuceService.deleteAstuce(idAstuce);
  console.log(response);
  window.location.reload();
}
async ngOnInit(){
   
  let result = await this.astuceService.showMyAstuce();
  if(result == null){
    let message ="Aucun utilisateur trouvé";
    this.snackBar.open(message,'', {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
    return
  }
  this.astuces = result.astuces;
  console.log(this.astuces)
 
  }
}

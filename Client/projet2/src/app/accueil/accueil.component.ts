import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, NgModel } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { GetProfileService } from '../services/get-profile.service';
import { TokenStorage } from '../services/TokenStorage.service';
import { Router } from  '@angular/router';
import { AdminService } from '../services/admin.service';
import { AstuceService } from '../services/astuce.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit{
verify:any;
astuces:any;
constructor(private location: Location,
  private http: HttpClient,
  private GetProfileService: GetProfileService,
  private router: Router,
  private tokenStorage: TokenStorage,
  private admin: AdminService,
  private astuce:AstuceService,
  private snackBar: MatSnackBar){}
  

  searchForm = new FormGroup({
    barre: new FormControl('',Validators.required)
  })
  
  get barre(){return this.searchForm.get('barre')}
  
async search(userSearch: any){
  let result =await this.astuce.SearchAstuce(userSearch);
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
  console.log(this.astuces);
}
  async ngOnInit() {

    

    

    //For block a user admin
    let admin = window.sessionStorage.getItem('admin');
      if(admin == "true"){
        this.router.navigate(['/admin']);
      }
      

  }
}

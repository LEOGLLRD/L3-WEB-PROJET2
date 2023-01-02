import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorage } from '../services/TokenStorage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AstuceService } from '../services/astuce.service';
@Component({
  selector: 'app-add-astuce',
  templateUrl: './add-astuce.component.html',
  styleUrls: ['./add-astuce.component.css']
})
export class AddAstuceComponent implements OnInit{

  verify:any;
  addAstuceForm = new FormGroup({
    TitreAst: new FormControl('', Validators.required),
    Tags: new FormControl('', Validators.required),
    ObjectInfo: new FormControl('', Validators.required),
    ImgInfo: new FormControl('', Validators.required),
    Astuce: new FormControl('', Validators.required),
   // File: new FormControl('', Validators.required)
  })
  get TitreAst(){return this.addAstuceForm.get('TitreAst')}
  get Tags(){return this.addAstuceForm.get('Tags')}
  get ObjectInfo(){return this.addAstuceForm.get('ObjectInfo')}
  get ImgInfo(){return this.addAstuceForm.get('ImgInfo')}
  get Astuce(){return this.addAstuceForm.get('Astuce')}
  //get File(){return this.addAstuceForm.get('File')}

 

constructor(private tokenStorage: TokenStorage,
            private router: Router,
            private http: HttpClient,
            private formBuilder: FormBuilder,
            private astuceService:AstuceService){}
  ngOnInit(): void {
      	//Verification, if the user is log, if not -> login page
		this.verify = this.tokenStorage.getToken();
		if(!this.verify){
		  this.router.navigate(['/login']);
		}

    //For block a user admin
    let admin = window.sessionStorage.getItem('admin');
      if(admin == "true"){
        this.router.navigate(['/admin']);
      }
		
  }
  

  addAstuceMethod(astuce:any){
   this.astuceService.addAstuce(astuce);
   }
}

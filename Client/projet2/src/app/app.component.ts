import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { astuce } from './models/astuce.model';
import { TestBed } from '@angular/core/testing';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  idUsers: any;

  title(title: any) {
    throw new Error('Method not implemented.');
  }
 


  constructor(private http: HttpClient) { }

  ngOnInit() {      
    // Simple POST request with a JSON body and response type <any>
   
}



 

   
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {Http, Headers} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor( private http:HttpClient) { }
  // baseUrl ='https://bitsmartbanking.azurewebsites.net/api/v1'
  baseUrl ='http://localhost:8080/api/v1'

  getDataFromApi(endPoint:String){
    return this.http.get(`${this.baseUrl}/${endPoint}`); 
  }
}

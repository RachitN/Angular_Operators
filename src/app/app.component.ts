import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { throws } from 'assert';
import { debounceTime, distinctUntilChanged, Observable, switchMap, tap, filter } from 'rxjs';
import { Product } from './product';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fg :any = new FormGroup({
    search : new FormControl(''),
    result: new FormControl('')
  })

  title = 'operator';
  products: any;
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient){
    this.fg.controls.search.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(()=>this.products =[]),
      filter((filter:any) => filter.length>1),
      
      switchMap((term) => this.getProductsByName(term))
    ).subscribe((resp:any) =>{
      this.products = resp
      this.fg.controls.result.setValue(this.products)
    })
  }

  getProductsByName(name:any) : Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}\products?name_like=${name}`);
  } 
}

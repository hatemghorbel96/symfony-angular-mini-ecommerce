import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../model/Product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductCategory } from '../model/product-category';
@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = 'http://127.0.0.1:8000/api/products';
  private categoryUrl ='http://127.0.0.1:8000/api/categories';
  constructor(private httpClient: HttpClient) { }

  getProductListPagination(thePage: number,thePageSize: number,thencategoryID : number): Observable<GetResponseProducts> {
      // need to build URL based on category id, page and size 
      
      const searchUrl = `${this.baseUrl}?_page=${thePage}&itemsPerPage=${thePageSize}&category=${thencategoryID}`;
      return this.httpClient.get<GetResponseProducts>(searchUrl);
  } 

    getProductList(thencategoryID : number): Observable<Product[]> {
   // need to build URL based on category id 
  
   const searchUrl = (`${this.baseUrl}?category=/api/categories/${thencategoryID}`);
   
   return this.httpClient.get<Product[]>(searchUrl);
   
  }  

/*  getProductList(): Observable<Product[]> {
    
      return this.httpClient.get<Product[]>(this.baseUrl);
  }  */


  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}?name=${theKeyword}`;

    return this.httpClient.get<Product[]>(searchUrl);
  }

  searchProductListPagination(thePage: number,thePageSize: number,theKeyword : string): Observable<GetResponseProducts> {
    // need to build URL based on keyword, page and size 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+ `&page=${thePage}&size=${thePageSize}`;

   return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response.member.products));
  }

  getProductById(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }


  getProductCategories(): Observable<ProductCategory[]> {
    /*  return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response.member.productCategory)
      );  */
       return this.httpClient.get<ProductCategory[]>(this.categoryUrl); 
    }
}

interface GetResponseProducts {
  member: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  member: {
    productCategory: ProductCategory[];
  }
}
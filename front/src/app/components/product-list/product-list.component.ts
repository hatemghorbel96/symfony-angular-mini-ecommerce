import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list.component.html',
 
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryID! : number;
  searchMode: boolean = false;
  previousCategoryId: number = 1;

 
  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword!: string ;
  

  constructor(private productService: ProductService,private route: ActivatedRoute,private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProduct();
    });

  }


  listProduct(){
    
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts(){
    // check if "id" parapeter is available
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

      if (hasCategoryId){
        // get the "id" param string convert to a number using the "+" symbol
        this.currentCategoryID = +this.route.snapshot.paramMap.get('id')!;
      }else {
        // not category id avaible default to cateogry id 1
        this.currentCategoryID = 1;
      }
      
    this.productService.getProductList(this.currentCategoryID).subscribe(
      data => {
        this.products=data;
      }
    )
  }



 

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitePrice}`);

    // TODO ... do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}

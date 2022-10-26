import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',

})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();
  constructor(private productService: ProductService,private route: ActivatedRoute,private cartService: CartService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.productdetails();
    })
  }

  productdetails(){
    // get the id from parameter and covert string to number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart() {

    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitePrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
    
  }


}

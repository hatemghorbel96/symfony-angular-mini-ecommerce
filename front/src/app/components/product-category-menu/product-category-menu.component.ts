import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/model/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',

})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories!:ProductCategory [];
  constructor(private productservices:ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories(){
    this.productservices.getProductCategories().subscribe(
      data => {
        console.log('product categories='+JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}

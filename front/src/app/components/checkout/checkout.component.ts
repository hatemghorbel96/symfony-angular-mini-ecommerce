import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/model/country';
import { State } from 'src/app/model/state';
import { ShopformService } from 'src/app/services/shopform.service';
import { CartService } from 'src/app/services/cart.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Route, Router } from '@angular/router';
import { OrderItem } from 'src/app/model/order-item';
import { Purchase } from 'src/app/model/purchase';
import { Order } from 'src/app/model/order';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',

})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,private shopFormService: ShopformService,
    private CartService: CartService,private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {
    this.reviewCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

   

     const startMonth: number = new Date().getMonth() + 1;
     console.log("startMonth: " + startMonth);
 
     this.shopFormService.getCreditCardMonths(startMonth).subscribe(
       data => {
         console.log("Retrieved credit card months: " + JSON.stringify(data));
         this.creditCardMonths = data;
       }
     );
 
    
 
     this.shopFormService.getCreditCardYears().subscribe(
       data => {
         console.log("Retrieved credit card years: " + JSON.stringify(data));
         this.creditCardYears = data;
       }
     );
       

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

 
  }

  copyShippingAddressToBillingAddress(event) {

    console.log('ok');

    if (event.target.checked) {
      this.checkoutFormGroup.get('billingAddress')!.setValue(
        this.checkoutFormGroup.get('shippingAddress')!.value);
        
      this.billingAddressStates = this.shippingAddressStates;
      
    } else {
      this.checkoutFormGroup.get('billingAddress')!.reset();
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    
     let order = new Order();
     order.totalPrice = this.totalPrice;
     order.totalQuantity = this.totalQuantity;
 
     // get cart items
     const cartItems = this.CartService.cartItems;
 
     // create orderItems from cartItems
     // - long way
     /*
     let orderItems: OrderItem[] = [];
     for (let i=0; i < cartItems.length; i++) {
       orderItems[i] = new OrderItem(cartItems[i]);
     }
     */
 
  
     let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

     let purchase = new Purchase();

     purchase.customer = this.checkoutFormGroup.controls['customer'].value;
     
    
     purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
     const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
     const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
     purchase.shippingAddress.state = shippingState.name;
     purchase.shippingAddress.country = shippingCountry.name;
 
    
     purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
     const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
     const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
     purchase.billingAddress.state = billingState.name;
     purchase.billingAddress.country = billingCountry.name;
   
   
     purchase.order = order;
     purchase.orderItems = orderItems;
 

     this.checkoutService.placeOrder(purchase).subscribe({
         next: response => {
           alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
 
         
           this.resetCart();
 
         },
         error: err => {
           alert(`There was an error: ${err.message}`);
         }
       }
     );
 
   }
 
   resetCart() {
    
     this.CartService.cartItems = [];
     this.CartService.totalPrice.next(0);
     this.CartService.totalQuantity.next(0);

     this.checkoutFormGroup.reset();
 
  
     this.router.navigateByUrl("/products");
   }
 

  

  

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

   

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName)!;

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

     
        formGroup.get('state')!.setValue(data[0]);
      }
    );
  }

  reviewCartDetails() {

   
    this.CartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

 
    this.CartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }




}

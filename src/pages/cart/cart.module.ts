import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
//import { Angular4PaystackModule } from 'angular4-paystack';

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    //Angular4PaystackModule
  ],
})
export class CartPageModule {}

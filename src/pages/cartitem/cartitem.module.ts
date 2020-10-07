import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartitemPage } from './cartitem';

@NgModule({
  declarations: [
    CartitemPage,
  ],
  imports: [
    IonicPageModule.forChild(CartitemPage),
  ],
})
export class CartitemPageModule {}

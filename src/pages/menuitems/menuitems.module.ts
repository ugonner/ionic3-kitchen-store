import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuitemsPage } from './menuitems';

@NgModule({
  declarations: [
    MenuitemsPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuitemsPage),
  ],
})
export class MenuitemsPageModule {}

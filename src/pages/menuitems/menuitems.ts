import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';


/**
 * Generated class for the MenuitemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menuitems',
  templateUrl: 'menuitems.html',
})
export class MenuitemsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider,
                private platform: Platform, private storage: Storage) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MenuitemsPage');
    }

    MenuItems: any = {productcategories: [], carttypes: [], cartcategories: []};
    ionViewDidEnter() {
        this.storage.get("wendy_menuitems").then((menuitems)=>{
            if(menuitems){
                this.MenuItems = menuitems;
            }
        }).catch((storageerr)=>{})
        console.log('ionViewDidEnter MenuitemsPage yes oo');
    }





    pushPageWithParameters(PageString , Params: any){
        this.navCtrl.push(PageString,Params);
    }

    pushPage(page){
        this.navCtrl.push(page);
    }

}

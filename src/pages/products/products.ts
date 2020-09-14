import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider,
                private platform: Platform, private storage: Storage) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductsPage');
    }

    Title: string = 'Products';
    UserData: any;
    ionViewDidEnter(){
        this.Title = this.navParams.get('title');
        const val = this.navParams.get('val');
        const pty = this.navParams.get('pty');
        this.getProducts(pty,val);
        //set this law from locally stored last-cart

        this.storage.get('last_cart').then((cart)=>{
            if(cart){
                this.Cart = cart;
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });


        this.storage.get('wendy_userdata').then((userdata)=>{
            if(userdata){
                this.UserData = userdata;
            }else{
                this.showLogin = true;
                //this.join();
            }
        }).catch((storageerr)=>{})

    }

    showLogin: boolean = false;
    showLoginTab: string = 'register';
    Products: any = [{'id': 1,"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };


    //@ViewChild(addtocartelement) Add_to_cart_element;
    //@ViewChild("addtocartelement") private Add_to_cart_element: ElementRef;

    incrementCart(product: any,incrementType: string){
        this.utilityservice.incrementCart(this.Cart,product,incrementType);
    }

    getProducts(pty: any , val: any){
        alert("/admin/product/getproducts/"+pty+"/"+val);
        this.httpservice.getStuff("/admin/product/getproducts/"+pty+"/"+val).subscribe((data)=>{
            //alert(JSON.stringify(data));
            this.Products = data.products.data;
            this.Products.map((product)=>{
                return product.quantity = 0;
            });
            //this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.utilityservice.presentToast(err.message,1);
        })
    }


}

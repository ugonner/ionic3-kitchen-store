import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the CartitemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cartitem',
  templateUrl: 'cartitem.html',
})
export class CartitemPage {

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
        const orderid = this.navParams.get('orderid');

        this.getOrder(orderid);
        //set this law from locally stored last-cart

        this.storage.get('last_cart').then((cart)=>{
            if(cart){
                this.Cart = cart;
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });

        //get STORED ORDER
        this.storage.get('wendy_orders').then((orders)=>{
            if(orders){
                for(let i=0; i<orders.length; i++){
                    if(orderid == orders[i].id){
                        this.Order = orders[i];
                    }
                }
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
    Products: any = [{'id': '', "title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };


    Order: any = {
        "orderdate": '00-00-2020',
        "ordertime": '00:00',
        "orderaddress": '',
        "orderamount": '0.00',
        "orderote": '',
        "cartcategoryid": 1,
        "cartcategoryname": '',
        "carttypeid": 1,
        "carttypename": '',
        "orderref": 1,
        "status": '',
        "statusnote": '',
        "dateofpublication": '',

        "cartitems": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };

    OrderItems: any =
        [
            {'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}
        ];


    //@ViewChild(addtocartelement) Add_to_cart_element;
    //@ViewChild("addtocartelement") private Add_to_cart_element: ElementRef;

    incrementCart(product: any,incrementType: string){
        this.utilityservice.incrementCart(this.Cart,product,incrementType);
    }

    getOrder(orderid: any){
        //alert(orderid);
        //alert("/admin/product/getproducts/"+pty+"/"+val);

        let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');

        this.httpservice.getStuff("/admin/cart/getcart/id/"+orderid).subscribe((data)=>{
            this.utilityservice.dismissLoader(loader);
            //alert(JSON.stringify(data));
            if(data.hasOwnProperty('cart')){

                this.Order = data.cart;
                this.Order.cartitems = data.cartitems;
                //this.OrderItems = data.cartitems;
            }



            //this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.utilityservice.dismissLoader(loader);
            this.utilityservice.presentToast(err.message,1);
        })
    }


}

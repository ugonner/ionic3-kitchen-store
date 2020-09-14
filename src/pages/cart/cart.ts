declare var PaystackPop: any;
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {


   payWithPaystack() {
    //e.preventDefault();
    let handler = PaystackPop.setup({
        key: 'pk_test_cab152282ae4dbe3e8806d278c48e0f5b8d76710', // Replace with your public key
        email: this.UserData.email,
        amount: (this.CartTotalCost || 100)+'00',
        firstname:  this.UserData.name,
        ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function(){
            alert('Window closed.');
        },
        callback: (response)=>{
            this.placeOrder(response.reference.toString());
            let message = 'Payment complete! Reference: ' + response.reference;
            alert(message);
        }
    });
    handler.openIframe();
}

    constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider, private storage: Storage) {
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CartPage');
    }



    paymentInit() {
        this.utilityservice.presentToast("paystack secures your payment details,", 2);
        console.log('Payment initialized');
    }

    title: string;
    reference :string = (Math.random() * 10000000000).toString();
    paymentDone(ref: any) {
        this.title = 'Payment successfull';
        console.log(this.title, ref);
    }

    paymentCancel() {
        this.utilityservice.presentToast("payment cancelled , try again", 2);
        console.log('payment failed');
    }

    ionViewDidEnter() {
        this.storage.get('last_cart').then((cart)=>{
            if(cart){
                this.Cart = cart;
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });

        //get menu items
        this.storage.get('wendy_menuitems').then((menuitems)=>{
            if(menuitems){
                this.MenuItems = menuitems;
                //alert(JSON.stringify(this.MenuItems))
            }else{
                //alert('no menu');
            }
        }).catch((err)=>{

            this.utilityservice.presentToast(err.message,2);
        });

        //get user data for billing
        this.storage.get('wendy_userdata').then((userdata)=>{
            if(userdata){
                this.UserData = userdata;
            }else{
                this.showPasswordField = true;
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });

        console.log('ionViewDidLoad CartPage');
    }

    showPasswordField: boolean = false;

    MenuItems: any={
        "carttypes":[{'id':1,"name": 'Door Delivery YES'}, {"id":2,"name": 'real'}],
        "cartcategories": [{'id':1,"name": 'Instant Delivery YES'}, {"id":2,"name": 'real'}],
        "productcategories": []
    }

    UserData: any = {
        "id": '',
        "name": '',
        "password": '',
        "email": '',
        "mobile": '',
        "address": ''

    };

    Orders: any = {};
    OrderDetails: any = {
        "orderdate": '00-00-2020',
        "ordertime": '00:00',
        "orderaddress": '',
        "orderamount": '0.00',
        "ordernote": '',
        "cartcategoryid": 1,
        "carttypeid": 1,
        "orderref": this.reference
    };

    PageTab = 'cart';
    Products: any = [{'id': 1,"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };

    private CartTotalCost: Number = 0;

    updateCartTotalCost(){
        let sum = 0;
        let cartlength = this.Cart.products.length;
        for(let i = 0; i<cartlength; i++){
            let product = this.Cart.products[i];
            sum += (product.quantity * product.price);
        }
        this.CartTotalCost = sum;
    }

    //@ViewChild(addtocartelement) Add_to_cart_element;
    //@ViewChild("addtocartelement") private Add_to_cart_element: ElementRef;

    incrementCart(product: any,incrementType: string){
        this.utilityservice.incrementCart(this.Cart,product,incrementType);
        this.updateCartTotalCost();
    }

    removeFromCart(product){
        this.Cart = this.utilityservice.removeFromCart(this.Cart,product);
        this.updateCartTotalCost();

    }

    emptyCart(){
        this.utilityservice.resetLocalCart();
        this.Cart = {
            'no_of_items': 0,
            "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
                "usersid": '',"usersname": '', "usersimageurl": ''}]
        };
    }

    //paystack secret key = sk_test_3b322217064583493ef390003860fecd7b7ea876
    //paystack public key = pk_test_cab152282ae4dbe3e8806d278c48e0f5b8d76710
    private errorMessageBag: string;
    placeOrder(reference){
        //gatther product ids
        let cartproductsids: Array<any> = [];
        let products: Array<any> = this.Cart.products;
        for(let i=0; i<products.length; i++){
            cartproductsids.push(products[i].id);
        }

        let postdata = {
            logFromApp: true,
            email: this.UserData.email,
            password: this.UserData.password,
            name: this.UserData.name,
            mobile: this.UserData.mobile,
            address: this.UserData.address,

            orderaddress: this.UserData.address,
            orderdate: this.OrderDetails.orderdate,
            ordertime: this.OrderDetails.ordertime,
            orderamount: this.CartTotalCost.toString(),
            ordernote: (this.OrderDetails.ordernote?this.OrderDetails.ordernote: 'just served well'),
            orderref: (reference? reference : this.OrderDetails.orderref),
            cartcategoryid: (this.OrderDetails.cartcategoryid),
            carttypeid: (this.OrderDetails.carttypeid),

            "cartproductsids": cartproductsids
        };

        this.httpservice.postStuff("/admin/cart/createcart",postdata).subscribe((data)=>{
            alert(JSON.stringify(data));
            if(data.success == false){
                this.utilityservice.presentToast("result 0 "+data.error.message,2);
            }else{

                ///store order;
                ///first get older orders and add the new to them;

                let ordersArray = [];

                this.storage.get('wendy_orders').then((orders: Array<any>)=>{

                    if(orders){

                        ordersArray = orders;

                    }
                    //add serverr's cartid, adn timestamps  to order id;


                    ordersArray.push(data.cart);
                    this.storage.set('wendy_orders',ordersArray).then((stored)=>{
                        //store user data;
                        if(data.hasOwnProperty('user')){

                            let user = data.user;
                            //add properties that may not be available at some endpoints
                            user.address = this.UserData.address;
                            user.password = this.UserData.password;
                            user.name = (user.hasOwnProperty('name')? user.name : user.name);
                            user.id = (user.hasOwnProperty('id')? user.id : user.userid);
                            alert(user.address);
                            this.storage.set('wendy_userdata',user).then((userstored)=>{
                                    this.utilityservice.presentToast(data.message +' and saved all details successfully',2);
                                }).catch((err)=>{
                                    this.utilityservice.presentToast(err.message+', '+data.message +' but not all saved',2);
                                });
                        }
                        this.utilityservice.presentToast(data.message +' and order updated successfully',2);
                    }).catch((err)=>{
                        this.utilityservice.presentToast(err.message+', '+data.message +' but not saved',2);
                    });
                }).catch((err)=>{
                    this.utilityservice.presentToast(data.message +' but not saved to previous orders',2);
                });
                //this.utilityservice.presentToast(data.results + 'created '+ data.message, 2);
            }
        },(err)=>{
            //let errMsgArray = err.errors;
            this.errorMessageBag = (JSON.stringify(err.error.message));
            this.utilityservice.presentToast(err.message,2);
        })
    }

    clearOrders(storageData: string){
        this.storage.remove(storageData).then((cleared)=>{
            this.utilityservice.presentToast('orders cleared',2);
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });
        //this.utilityservice.removeFromStorage('wendy_orders')
    }
}

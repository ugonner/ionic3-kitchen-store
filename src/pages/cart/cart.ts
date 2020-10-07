declare var PaystackPop: any;
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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




    dismissPaystackIframe(){
        let iframes = document.getElementsByTagName('iframe');
        for(let i=0; i<iframes.length; i++){
            iframes[i].style.display = "none";
        }
    }


    payStackIframeIsOn: boolean = false;

    payWithPaystack() {
    //e.preventDefault();

    this.payStackIframeIsOn = true;

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider, private storage: Storage, private alertCtrl: AlertController) {
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
        "productcategories": [],
        locations: [{id: 1, name: ''}],
        sublocations: [{id: 1, name: '', locationid: 1}]

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
        "orderlocationid":'',
        "ordersublocationid":'',
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

    actualEmptyCart(){

        this.utilityservice.resetLocalCart();
        this.Cart = {
            'no_of_items': 0,
            "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
                "usersid": '',"usersname": '', "usersimageurl": ''}]
        };
    }

    emptyCart(){
        let alert = this.utilityservice.alertCtrl.create({
            title: "Confirm ",
            message: "You sure want to empty your cart?",
            buttons: [
                {
                    role: 'destructive',
                    text: 'I sure do',
                    handler: ()=>{
                        this.actualEmptyCart();
                        return true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'No',
                    handler: ()=>{
                        return true;
                    }
                }
            ]
        })
        alert.present()
    }


    //paystack secret key = sk_test_3b322217064583493ef390003860fecd7b7ea876
    //paystack public key = pk_test_cab152282ae4dbe3e8806d278c48e0f5b8d76710


    locationSublocations: Array<any> = [{id: 1, name: '', locationid: 1}];

    selectLocationSublocations(locationid){

        if(!(this.OrderDetails.orderlocationid == 31)){
            this.utilityservice.presentToast("we don't do door delivery to this location please",2);

        }


        let sublocationsArray: Array<any> = [];
        let thisSubLocationArray = this.MenuItems.sublocations;

        for(let i=0; i<thisSubLocationArray.length; i++){
            if(thisSubLocationArray[i].locationid == locationid){
                sublocationsArray.push(thisSubLocationArray[i]);

            }
        }

        this.locationSublocations = sublocationsArray;
    }


    private errorMessageBag: string;
    presentAlert(title,message){
        let alert = this.alertCtrl.create({
            title: "<ion-item no-lines><span item-start padding><ion-icon name='checkmark-circle'></ion-icon></span><span padding>"+title+"</span></ion-item>",
            message: message
        });
        alert.present();
    }

    placeOrder(reference){
        //gatther product ids
        let cartproductsids: Array<any> = [];
        let products: Array<any> = this.Cart.products;


        let postdata = {
            logFromApp: true,
            id: this.UserData.id,
            email: this.UserData.email,
            password: this.UserData.password,
            name: this.UserData.name,
            mobile: this.UserData.mobile,
            address: this.UserData.address,

            orderaddress: this.UserData.address,
            orderlocationid: this.OrderDetails.orderlocationid,
            ordersublocationid: this.OrderDetails.ordersublocationid,
            orderdate: this.OrderDetails.orderdate,
            ordertime: this.OrderDetails.ordertime,
            orderamount: this.CartTotalCost.toString(),
            ordernote: (this.OrderDetails.ordernote?this.OrderDetails.ordernote: 'just served well'),
            orderref: (reference? reference : this.OrderDetails.orderref),
            cartcategoryid: (this.OrderDetails.cartcategoryid),
            carttypeid: (this.OrderDetails.carttypeid),

            "cartproducts": products
        };

        //alert(postdata.id+" id and email= "+ postdata.email+" and pass= "+this.UserData.password);
        let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');

        this.httpservice.postStuff("/admin/cart/createcart",postdata).subscribe((data)=>{
            this.utilityservice.dismissLoader(loader);
            //alert(JSON.stringify(data));
            //alert(JSON.stringify(data));
            if(data.success == false){
                //alert(data);
                //this.utilityservice.presentToast("result 0 "+data.error.message,2);
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
                            //alert(user.address);

                            this.storage.set('wendy_userdata',user).then((userstored)=>{
                                    this.utilityservice.presentToast(data.message +' and saved all details successfully',2);
                                }).catch((err)=>{
                                    this.utilityservice.presentToast(err.message+', '+data.message +' but not all saved',2);
                                });
                        }
                        let title = "Wendy's Kitchen Alert";
                        let message = "Order Received at Wendy's, Expect your delivery, We'll surely beat your expectations, Thanks for patronizing us";
                        if(this.OrderDetails.carttypeid == 1){
                            message += "<br/> Successful instant Pay, A receipt has been sent your mailbox, We appreciate your trust AND WE VALUE THAT MOST";
                        }

                        this.utilityservice.presentAlert(title, message);
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
            this.utilityservice.dismissLoader(loader);
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

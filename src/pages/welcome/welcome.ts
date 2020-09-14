import { Component, ViewChild } from '@angular/core';
//import { Animation, createAnimation } from '@ionic/core'
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';
//import { NativeAudio } from '@ionic-native/native-audio';
//import { gsap } from "gsap";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

    private Law: Array<any>;
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private utilityservice: UtilityservicesProvider, private httpservice: HttpserviceProvider,public storage: Storage) {

  }

    ionViewDidEnter(){
        this.getProducts();
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

    getProducts(){
        this.httpservice.getStuff("/admin/product/getproducts").subscribe((data)=>{
            this.Products = data.products.data;
            this.Products.map((product)=>{
                return product.quantity = 0;
            });
            this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.utilityservice.presentToast(err.message,1);
        })
    }

    UserData: any = {
        "id": '',
        "name": '',
        "password": '',
        "email": '',
        "mobile": '',
        "address": 'N\A'

    };


    errorMessageBag: string;
    join(joinBy: string){

        //if showpassword shows user is not registered or logged in
        if(this.showLogin){
            let postdata = {
                logFromApp: true,
                email: this.UserData.email,
                password: this.UserData.password,
                name: this.UserData.usersname,
                mobile: this.UserData.mobile,
                address: this.UserData.address

            }
            let url = ((joinBy == 'Registration')? '/admin/user/registration' : '/admin/user/login');
            this.httpservice.postStuff(url,postdata).subscribe((data)=>{
                if(data.success == false){
                    this.utilityservice.presentToast("fetched fetched",2);
                    //make call to paystack pop
                    this.errorMessageBag = "You Can not be logged in, wrong log in details";

                }else{
                    //
                    this.UserData.id = data.userid;
                    //store user in storage
                    this.storage.set('wendy_userdata',this.UserData).then((storeduserdata)=>{
                        this.showLogin = false;

                        this.utilityservice.presentToast('Stored user data',2);


                    }).catch((err)=>{
                        this.utilityservice.presentToast('Error Storing user data',2);
                    });

                }


            },(err)=>{
                //let errMsgArray = err.errors;
                this.errorMessageBag = (JSON.stringify(err.error.errors));
                this.utilityservice.presentToast(err.message,2);

            });
        }
    }


    logOut(){
        this.clearStorageData('wendy_userdata');

        this.clearStorageData('wendy_orders');

        this.clearStorageData('last_cart');

        this.showLogin = true;
    }


    clearStorageData(storageData: string){
        this.storage.remove(storageData).then((cleared)=>{
            this.utilityservice.presentToast('orders cleared',2);
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });
        //this.utilityservice.removeFromStorage('wendy_orders')
    }



    pushPageWithParameters(PageString , Params: any){
        /*this.nativeAudio.play("id1").then((played)=>{
            console.log("played");
        },(err)=>{
            this.utilityservice.presentToast(err,1);
        });*/
        //this.utilityservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }

    pushPage(page){
        this.navCtrl.push(page);
    }


}

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

    ionViewWillEnter(){
        this.getProducts();

        this.getIndexProducts();

        this.getIndexArticles();

        this.getIndexUsers();
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
    Products: any = [{'id': '',"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
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

    IndexProducts: any = {
        productcategory_1: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        productcategory_2: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        productcategory_3: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        productcategory_4: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        category_1: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        category_2: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        category_3: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        category_4: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        most_viewed: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: '',productcategoryid: '', productcategoryname: '', categoryid: '', categoryname: ''}],
        allcategories: [{id: '', title: '',imageurl: '', price: '', discountrate: '', usersid: '',usersname: '', usersimageurl: ''}]
    }

    IndexArticles = [{
        id: '', title: '', detail: '', dateofpublication: '', imageurl: ''
    }];

    getProducts(){
        let loader = this.utilityservice.presentLoading('loading products');
        this.httpservice.getStuff("/admin/product/getproducts").subscribe((data)=>{
            loader.dismiss();
            //if(loader){this.utilityservice.dismissLoader(loader)};
            if(data.hasOwnProperty('products')){

                this.Products = data.products.data;
                this.Products.map((product)=>{
                    return product.quantity = 0;
                });
            }
            //this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            if(loader){this.utilityservice.dismissLoader(loader)};
            //loader.dismiss();
            this.utilityservice.presentToast(err.message,1);
        })
    }

    getIndexProducts(){
        let loader = this.utilityservice.presentLoading('loading products');
        this.httpservice.getStuff("/admin/getindexproducts").subscribe((data)=>{
            loader.dismiss();
            //if(loader){this.utilityservice.dismissLoader(loader)};
            //alert(JSON.stringify(data));
            if(data.hasOwnProperty('productcategory_1')){

                this.IndexProducts.productcategory_1 = data.productcategory_1;

                this.IndexProducts.productcategory_2 = data.productcategory_2.concat(data.productcategory_3, data.productcategory_4);
                this.IndexProducts.allcategories = data.category_1.concat(data.category_2, data.category_3, data.category_4);

                this.IndexProducts.most_viewed = data.most_viewed;
            }

        },(err)=>{
            if(loader){this.utilityservice.dismissLoader(loader)};
            this.utilityservice.presentToast(err.message,1);
        })
    }


    getIndexArticles(){
        let loader = this.utilityservice.presentLoading('loading products');
        this.httpservice.getStuff("/admin/article/getarticles").subscribe((data)=>{
            loader.dismiss();
            //alert(JSON.stringify(data));
            //if(loader){this.utilityservice.dismissLoader(loader)};
            if(data.hasOwnProperty('articles')){

                this.IndexArticles = data.articles.data;

            }

        },(err)=>{
            alert(JSON.stringify(err))
            if(loader){this.utilityservice.dismissLoader(loader)};
            this.utilityservice.presentToast(err.message,1);
        })
    }


    

    //get staff 
    IndexUsers: Array<any> = [{
        id: '', name:'', imageurl: '',rolename:'',positionname:'',rolenote:'', locationname:'',sublocationname:'',
        roleid:'', positionid:''
    }]
    
    getIndexUsers(){
        let loader = this.utilityservice.presentLoading('loading products');
        this.httpservice.getStuff("/admin/user/getusers/ur/2").subscribe((data)=>{
            if(loader){loader.dismiss();}
            //alert(JSON.stringify(data));
            //if(loader){this.utilityservice.dismissLoader(loader)};
            if(data.hasOwnProperty('users')){

                this.IndexUsers = data.users.data;

            }

        },(err)=>{
            alert(JSON.stringify(err))
            if(loader){this.utilityservice.dismissLoader(loader)};
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

            let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');
            this.httpservice.postStuff(url,postdata).subscribe((data)=>{
                loader.dismiss();
                if(data.success == false){
                    this.utilityservice.presentToast("fetched fetched",2);
                    //make call to paystack pop
                    this.errorMessageBag = "You Can not be logged in, wrong log in details";

                }else{
                    //
                    this.UserData = data.user;
                    this.UserData.id = data.userid;
                    this.UserData.password = postdata.password;
                    //store user in storage
                    this.storage.set('wendy_userdata',this.UserData).then((storeduserdata)=>{
                        this.showLogin = false;
                        //alert('userid = '+this.UserData.id+' and name= '+this.UserData.name);

                        this.utilityservice.presentToast('Stored user data',2);


                    }).catch((err)=>{
                        this.utilityservice.presentToast('Error Storing user data',2);
                    });

                }


            },(err)=>{
                loader.dismiss();
                //let errMsgArray = err.errors;
                this.errorMessageBag = (JSON.stringify(err.error.errors));
                this.utilityservice.presentToast(err.message,2);

            });
        }
    }


    actualLogOut(){
        this.clearStorageData('wendy_userdata');

        this.clearStorageData('wendy_orders');

        this.clearStorageData('last_cart');

        this.showLogin = true;
    }


    clearStorageData(storageData: string){
        this.storage.remove(storageData).then((cleared)=>{
            this.utilityservice.presentToast('orders cleared',2);
            return true;
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
            return false;
        });
        //this.utilityservice.removeFromStorage('wendy_orders')
    }




    logOut(){

        let alert = this.utilityservice.alertCtrl.create({
            title: 'Confirm Log Out',
            message: "You sure want to clear your user data ?",
            buttons: [
                {
                    text: 'Ya',
                    handler: ()=>{
                        this.actualLogOut();
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

        });

        alert.present();
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

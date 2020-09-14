import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider,
              private platform: Platform, private storage: Storage) {
  }

    pageTab: string = 'userdata';
    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
    }
    StoredPassword: string;
    StoredUserData: any;
    isOwner: boolean = false;
    ionViewDidEnter() {
        //first set userdata from local storage, if there's network it will be replaced from server data

        this.storage.get('wendy_userdata').then((userdata)=>{
            if(userdata){
                this.StoredUserData = userdata;
                this.UserData = userdata;
                this.StoredPassword = userdata.password;
                //alert(JSON.stringify(this.UserData));
            }
        }).catch((storageerr)=>{
            this.utilityservice.presentToast("unable to fetch user data "+storageerr.message,2);
        })

        let userid = this.navParams.get('userid');
        //alert('userid'+ userid)
        //if((userid)){

            this.httpservice.getStuff('/admin/user/userprofile/'+userid).subscribe((data)=>{

                //alert('isowner soredid='+this.StoredUserData.id + ' serverUserId= '+data.user.id);
                alert(JSON.stringify(data));
                if(data.success == true){


                    alert('isowner soredid='+this.StoredUserData.id + ' serverUserId= '+data.user.id);

                        this.UserData = data.user;

                    if(this.StoredUserData.id == data.user.id){

                            this.isOwner = true;

                            //alert('isowner soredid='+this.StoredUserData.id + ' serverUserId= '+data.user.id);
                        }



                }else{

                    this.utilityservice.presentToast(data.message,2);

                }
            },(err)=>{
                //alert(JSON.stringify(err)+" internet error in server");
                this.utilityservice.presentToast(err.message,2);
            })

        //}
//first set orderdata from local storage, if there's network it will be replaced from server data

        this.storage.get('wendy_orders').then((orders)=>{
            if(orders){
                this.Orders = orders;
            }
        }).catch((storageerr)=>{
            this.utilityservice.presentToast("unable to get orders data "+storageerr.message,2);
        })

        //let userid = this.navParams.get('userid');
        if(!(userid == 'undefined')){

            this.httpservice.getStuff('/admin/cart/getcarts/ui/'+userid).subscribe((data)=>{
                if(data.success == true){
                    let ordersdata = data.carts.data; //carts.data due to pagination
                    if((ordersdata.length <= 0)){

                        this.utilityservice.presentToast('orders is empty',2);

                    }else{

                        this.Orders = ordersdata;
                        //alert(JSON.stringify(data));
                    }
                }else{
                    //alert(JSON.stringify(data));
                    this.utilityservice.presentToast(data.message,2);
                }

            },(err)=>{
                this.utilityservice.presentToast(err.message,2);
            })
        }


        //alert(JSON.stringify(this.UserData));
        console.log('ionViewDidLoad ProfilePage');
    }



    showPasswordField: boolean = false;

    MenuItems: any={
        "carttypes":[{'id':1,"name": 'Door Delivery YES'}, {"id":2,"name": 'real'}],
        "cartcategories": [{'id':1,"name": 'Instant Delivery YES'}, {"id":2,"name": 'real'}],
        "productcategories": []
    }

    UserData: any = {
        "usersid": '',
        "usersname": '',
        "password": '',
        "email": '',
        "imageurl": '',
        "mobile": '',
        "address": '',
        "rolename": '',
        "rolenote": '',
        "positionname":'',
        "about": ''

    };

    Orders: Array<any> = [{
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
        "dateofpublication": ''
    }];

    PageTab = 'cart';
    Products: any = [{'id': 1,"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];

    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };




    @ViewChild('oldpassword') OldPassword;
    editUserProperty(property: string,value: any){
        if(property = 'password'){
            if(this.OldPassword.value != this.StoredPassword){
                this.errorMessageBag = "You could not be identified with this account because your old password does not match your account password";
                return false;
            }
        }

        let postdata = {
            "old_email":this.UserData.email,
            "userid": this.UserData.id,
            'val':value,
            "pty": property
        }
        this.httpservice.postStuff('/admin/user/edit',postdata).subscribe((data)=>{

            this.utilityservice.presentToast(data.message,2);
            if(data.success == true){
                //this.utilityservice.presentToast(data.message,2);
                if(property == 'password'){
                    this.UserData.password = value;
                }

                if(property == 'imageurl'){
                    this.UserData.imageurl = value;
                }

                this.storage.set('wendy_userdata',this.UserData).then((stored)=>{
                    this.utilityservice.presentToast(property+" stored successfully",2);
                }).catch((storageerr)=>{
                    console.log(storageerr.message);
                })

            }else{
                this.utilityservice.presentToast(data.message,2);
            }
            alert(JSON.stringify(data));
        },(err)=>{
            alert(JSON.stringify(err));
            this.utilityservice.presentToast(err.message,2);
        })
    }

    errorMessageBag: string;
    editUserData(){

        //if showpassword shows user is not registered or logged in
        //if(this.showPasswordField){
            let postdata = this.UserData;
            postdata.logFromApp = true;
            postdata.old_email = this.UserData.email
            postdata.userid = this.UserData.id;

            this.httpservice.postStuff('/admin/user/updateprofile',postdata).subscribe((data)=>{
                if(data.success == false){
                    this.utilityservice.presentToast("Didn't find you",2);
                    //make call to paystack pop
                }else{
                    //
                    //store user in storage
                    this.storage.set('wendy_userdata',this.UserData).then((storeduserdata)=>{
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
        //}
    }

    @ViewChild('userprofilepicfile') pic22: ElementRef;

    DisplaySpinner: Boolean;
    editUserProfilePic(file: File){
        const formdata = new FormData();
        formdata.append('imageurl',file);
        formdata.append('userid',this.UserData.id);
        formdata.append('pty','imageurl');
        formdata.append("old_email",this.UserData.email);
        this.httpservice.postStuff('/admin/user/edit',formdata).subscribe((data)=>{
            //alert(JSON.stringify(data));

            this.utilityservice.presentToast(data.message,2);
        },(err)=>{
            this.utilityservice.presentToast(err.message,2);
        })

        let reader = new FileReader();
        reader.onload = ()=>{
            document.getElementById("profilepic").setAttribute('src',reader.result);
        }
        reader.readAsDataURL(file);

    }


}

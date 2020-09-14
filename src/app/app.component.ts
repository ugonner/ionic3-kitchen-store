import { Component,OnInit,  ViewChild } from '@angular/core';
import { Platform,Nav, MenuController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HttpserviceProvider } from '../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../providers/utilityservices/utilityservices';


import { WelcomePage } from '../pages/welcome/welcome';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  rootPage:any = WelcomePage;
    @ViewChild("nav1") public nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private httpservice: HttpserviceProvider,
              private storage: Storage, private utilityservice: UtilityservicesProvider, public menuCtrl: MenuController,
              private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }


    /*ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');
    }*/
    private Law: Array<any>;
    private LangCode: any;

    /*private MenuItemsArray: Array<any> = [
        {"name": 'productcategories',"items":this.MenuItems.productcategories},
        {"name": 'cartcategories',"items":this.MenuItems.cartcategories},
        {"name": 'carttypes',"items":this.MenuItems.carttypes},

    ];*/

    showItemsOf: string;
    private MenuItems: any = {
        'productcategories': [],
        "allcategories": [],
        "cartcategories":[],
        "carttypes": []
    };

    UserData = {
        id: '',
        imageurl: '',
        name: '',
        email: '',
        password: '',
        mobile: ''
    };

    UserId: any = false;
    ngOnInit() {
        //get userdata
        this.storage.get('wendy_userdata').then((userdata)=>{
            if(userdata){
                this.UserData = userdata;
                this.UserId = userdata.id
            }else{
                alert('please login First');
            }
        }).catch((storageerr)=>{})

        //check for locally stored law
        this.storage.get("wendy_menuitems")
            .then((menuitems)=>{
                if(menuitems){
                    this.MenuItems = menuitems;
                    //alert(law.sections[0].title);
                }else{
                    alert('no menu found');
                    //if no law was fetched
                    this.loadMenuItems();
                }
            }).catch((err)=>{
                this.utilityservice.presentToast("storage error: unable to store the menu items "+err.message,1);
            });



        console.log('ionViewDidLoad WelcomePage');
    }


    loadMenuItems(){
        this.httpservice.getStuff('/admin/getmenuitems').subscribe((data)=>{
            //alert(JSON.stringify(data));
            if(data.success == true){
                this.MenuItems = data.menuitems;
                this.storage.set('wendy_menuitems',this.MenuItems).then((stored)=>{
                    this.utilityservice.presentToast('Menuitems stored successfully',2);
                }).catch((storageerr)=>{
                    this.utilityservice.presentToast('menuitmes not saved',2);
                })
                this.utilityservice.presentToast(data.message,2)
            }
        },(err)=>{
            this.utilityservice.presentToast(err.message,2);
        })
    }


    logOut(){
        this.clearStorageData('wendy_userdata');
        this.clearStorageData('wendy_orders');
        this.clearStorageData('last_cart');
        this.goHome();
        this.UserId = false;
    }
    clearStorageData(storageData: string){
        this.storage.remove(storageData).then((cleared)=>{
            this.utilityservice.presentToast('orders cleared',2);
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,2);
        });
        //this.utilityservice.removeFromStorage('wendy_orders')
    }

    pushPage(page){
        this.menuCtrl.getOpen().close();
        this.nav.push(page);
        this.utilityservice.playSound(1);
    }


    pushPageWithParameters(PageString: String , Params: any){
        this.menuCtrl.getOpen().close();

        this.nav.push(PageString,Params);
        this.utilityservice.playSound(2);
    }

    goHome(){
        this.utilityservice.playSound(1);
        this.menuCtrl.getOpen().close();
        this.nav.setRoot(WelcomePage);


    }

}


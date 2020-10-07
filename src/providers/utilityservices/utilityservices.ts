import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform,MenuController,NavController, NavParams ,ToastController,LoadingController, Loading, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio';
/*
  Generated class for the UtilityservicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilityservicesProvider {

  constructor(public platform: Platform, public http: HttpClient, public toastCtrl: ToastController, public navCtrl: MenuController,
               private menuCtrl: MenuController, private storage: Storage, private loadingCtrl: LoadingController,
               public nativeAudio: NativeAudio, public alertCtrl: AlertController) {
    console.log('Hello UtilityservicesProvider Provider');
  }



    Cart: any = {
        'no_of_items': 0,
        "products": [{'id': '', "title": '', "imageurl": '', "price": 0, "quantity": 0, "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ''}]
    };

    incrementCart(Cart: any, product: any, incrementType: string){
        //check if product already in cart
        const product_cart_index = Cart.products.findIndex( cartproduct => cartproduct.id == product.id);
        if(product_cart_index == -1){
            //if not add product to cart products
            //if increment is negative say sorry and add;
            if(incrementType == "-"){
                this.presentToast("Wendy Knows you made a mistake, and is adding the product to your cart instead",1)
            }else{
                product.quantity = 1;
                product.price = (product.price - (product.discountrate * 0.01 * product.price));
                Cart.products.push(product);
                Cart.no_of_items++;
                this.updateLocalCart(Cart);
            }
        }else{

            //if in cart just increment product quantity
            if(incrementType == "-"){
                if(Cart.products[product_cart_index].quantity <= 1){
                    //if qth is zero remove from cart else decrement
                    Cart.products.pop(product_cart_index);
                }else{
                    Cart.products[product_cart_index].quantity--;
                }
                Cart.no_of_items = ((Cart.no_of_items<=1) ? 0: Cart.no_of_items-1);
            }else{
                Cart.products[product_cart_index].quantity++;
                Cart.no_of_items++;
            }
            this.updateLocalCart(Cart);

        }
    }

    /*getProducts(){
        this.httpservice.getStuff("/admin/product/getproducts").subscribe((data)=>{
            this.Products = data.products.data;
            this.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.presentToast(err.message,1);
        })
    }*/

    updateLocalCart(currentCart){
        this.storage.set('last_cart',currentCart).then((cart)=>{
            this.presentToast('Cart updated',1);
        }).catch((err)=>{
            this.presentToast(err.message,2);
        })
    }

    resetLocalCart(){
        this.updateLocalCart(this.Cart);
        return this.Cart;
    }

    removeFromCart(Cart: any, product: any){
        const product_cart_index = Cart.products.findIndex( cartproduct => cartproduct.id == product.id);
        if(product_cart_index == -1 || product_cart_index == '-1' ||  product_cart_index == 'undefined' ){
            this.presentToast("product not in tray",2);
            return Cart;
        }else{
            Cart.products.pop(product_cart_index);
            this.updateLocalCart(Cart);
            return Cart;
        }
    }

    presentToast(message, duration){
        let timer: any;
        if(duration == 1){
            timer = 4000;
        }else if(duration == 2){
            timer = 10000;
        }else{
            timer = duration;
        }
        let toast = this.toastCtrl.create({
            "message":message,
            "position":"bottom",
            "duration": timer
        });
        toast.present();

    }

    presentAlert(title,message){
        let alert = this.alertCtrl.create({
            title: "<ion-item no-lines><span item-start padding><ion-icon name='checkmark-circle'></ion-icon></span><span padding>"+title+"</span></ion-item>",
            message: message,
            buttons: ['Dismiss']
        });
        alert.present();
    }

    playSound(SoundNumber){
        this.nativeAudio.play("id"+SoundNumber).then((playing)=>{
            console.log("playing");
        },(err)=>{
            this.presentToast("sound not played "+err,1);
        })
    }
    presentLoading(message): Loading{
        let loader = this.loadingCtrl.create({
            spinner:'hide',
            "content": '<div class="col-12 text-center"><div><img src="../../assets/images/g1.jpg" class="mx-auto d-block animated tasa infinite"/>'+message+' </div></div> ',
            "showBackdrop": true,
            "enableBackdropDismiss": false,
            "dismissOnPageChange": true
        });
        loader.present();
        return loader;
    }

    dismissLoader(loader: Loading){
        loader.dismiss()
        return loader = null;
    }

    echoTextInTranslation(paragraphobject: any, langcode){
        if(langcode == "1"){
            return paragraphobject.paragraphtext;
        }else if(langcode == "2"){
            //return JSON.parse(paragraphobject.paragraphigbotext);
            return paragraphobject.paragraphigbotext;
        }else if(langcode == "3"){
            //return JSON.parse(paragraphobject.paragraphannotation);
            return paragraphobject.paragraphannotation;
        }else{
            //return JSON.parse(paragraphobject.paragraphigbotext);
            return paragraphobject.paragraphigbotext;
        }
    }

    removeFromStorage(key){
        this.storage.remove(key).then((cleared)=>{
            this.presentToast('cleared successfully',2);
        }).catch((err)=>{
            this.presentToast('not cleared',2);
        })
    }

    /*echoTextInTranslation(paragraphobject: any){
        this.storage.get("LangCode")
            .then((langcode)=>{
                if(langcode == 1){
                    return paragraphobject.paragraphtext;
                }else if(langcode == 2){
                    return paragraphobject.paragraphigbotext;
                }else if(langcode == 3){
                    return paragraphobject.paragraphannotation;
                }else{
                    return paragraphobject.paragraphigbotext;
                }
            }).catch((err)=>{
                this.presentToast('unable to get stored date',1);
                return paragraphobject.paragraphigbotext;
            })
    }*/
    /*pushPageWithParams(PageString: string , Params: any){
        this.menuCtrl.getOpen().close();
        let nCtrl = new NavController();
        nCtrl.push(PageString,Params);
    }*/

    /*pushPage(page: string, parameters: any){
        this.navCtrl.push(page,parameters);
    }*/
}

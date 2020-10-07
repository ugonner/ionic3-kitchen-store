import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';


/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider,
                private platform: Platform, private storage: Storage) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductPage');
    }

    Title: string = 'Products';
    UserData: any;
    pageTab: string = 'detail';

    ionViewDidEnter(){
        this.Title = this.navParams.get('title');
        const productid = this.navParams.get('productid');



        this.getProduct(productid);
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
    Product: any = {
        item: {
            'id': '',"title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
            "usersid": '',"usersname": '', "usersimageurl": ' '
        },
        "product_comments": [{
            id:0, detail: '', imageurl: '',dateofpublication:'0000-00-00 00:00',usersid:0, usersname:'',usersimageurl:''
        }],
        "productfiles": [{
            id: '', displayname: '', title:'', type: ''
        }]
    };

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

    Products: any = [{'id': '', "title": ' ',"imageurl": '', "price": '0.00', "quantity": '0', "dateofpublication": '',
        "usersid": '',"usersname": '', "usersimageurl": ' '}];


    getProduct(productid: any){
        //alert('productid ='+productid);

        let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');

        this.httpservice.getStuff("/admin/product/getproduct/productid/"+productid).subscribe((data)=>{
            this.utilityservice.dismissLoader(loader);
            //alert(JSON.stringify(data));
            if(data.hasOwnProperty('product')){

                this.Product.item = data.product;
                this.Product.product_comments = data.product_comments;
                this.Product.productfiles = data.productfiles;

                this.getProducts('ppc',this.Product.item.productcategoryid);

            }
            //this.Product.quantity = 0;
            //this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.utilityservice.dismissLoader(loader);
            //alert(JSON.stringify(err));
            this.utilityservice.presentToast(err.message,1);
        })
    }


    getProducts(pty: any , val: any){
        //alert("/admin/product/getproducts/"+pty+"/"+val);

        let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');

        this.httpservice.getStuff("/admin/product/getproducts/"+pty+"/"+val).subscribe((data)=>{
            this.utilityservice.dismissLoader(loader);
            //alert(JSON.stringify(data));
            if(data.hasOwnProperty('products')){

                this.Products = data.products.data;
                this.Products.map((product)=>{
                    return product.quantity = 0;
                });
            }

            //this.utilityservice.presentToast(data.products.data[0].title,1);
        },(err)=>{
            this.utilityservice.dismissLoader(loader);
            this.utilityservice.presentToast(err.message,1);
        })
    }


    setCommentImage(){

        let file = this.commentfile.nativeElement.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=>{

            //document.getElementById('commentimagediv').innerHTML = "<img src='"+reader.result+"' class='img-fluid' />";
            let imageElement = document.getElementById('commentimage');
            imageElement.setAttribute('src',reader.result);
            imageElement.style.display = 'block';

        }


    }

    @ViewChild('productcommentfile') commentfile;


    postReview(detail: string){

        const formData = new FormData();

        formData.append('email',this.UserData.email);
        formData.append('password',this.UserData.password);
        formData.append('productid',this.Product.item.id);
        formData.append('detail',detail);

        if(this.commentfile.nativeElement.files[0]){
            let file = this.commentfile.nativeElement.files[0];
            formData.append('imageurl',file);

        }

        let productcomment = {
            id: '00',
            detail: detail,
            dateofpublication: '',
            usersid: this.UserData.id,
            usersname: this.UserData.name,
            usersimageurl: this.UserData.imageurl
        };

        this.Product.product_comments.push(productcomment);

        let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');

        this.httpservice.postStuff("/admin/product/createproductcomment", formData).subscribe((data)=>{
            this.utilityservice.dismissLoader(loader);
            //alert(JSON.stringify(data));
            if(data.success == true){
                if(data.hasOwnProperty('productcommentid')){
                    const product_comment_index = this.Product.product_comments.findIndex( productcomment => productcomment.id == '00');
                    if(product_comment_index == -1){
                        console.log('not in comments');
                    }else{
                        this.Product.product_comments[product_comment_index].id = data.productcommentid;
                    }

                }
            }

        },(err)=>{
            this.utilityservice.dismissLoader(loader);
        })


    }


    editProductComment(detail: string, commentid: any, oldimageurl: string){

        let productcomment: any = {
            email: this.UserData.email,
            password: this.UserData.password,
            detail: detail,
            commentid: commentid
        };


        if(oldimageurl == '' || oldimageurl==null){
            console.log('no previous image for the product review');
        }else{
            productcomment.old_imageurl = oldimageurl;
        }


        const product_comment_index = this.Product.product_comments.findIndex( productcomment => productcomment.id == commentid);
        if(product_comment_index == -1){
            console.log('not in comments');
        }else{
            this.Product.product_comments[product_comment_index].detail = detail;
        }

        let loader = this.utilityservice.presentLoading('will be done in a jiffy, please wait');

        this.httpservice.postStuff("/admin/product/editproductcomment", productcomment).subscribe((data)=>{
            //alert(JSON.stringify(data));
            this.utilityservice.dismissLoader(loader);
            if(data.success == true){
                this.utilityservice.presentToast(data.message,1);


            }

        },(err)=>{
            this.utilityservice.dismissLoader(loader);
        })



    }



}

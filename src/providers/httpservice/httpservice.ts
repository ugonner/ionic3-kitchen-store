import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpserviceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HttpserviceProvider Provider');
  }


    public hostdomain = "http://localhost:8000";
    //public hostdomain = "https://disabilitylawcenter-anambra.com.ng";


    postStuff(uri: String, postdata): Observable<any>{
        //let requestoptions = {headers:new HttpHeaders().set("Content-type", "application/json").set("withCredentials", "true")};
        let url = this.hostdomain + uri;
        return this.http.post(url,postdata);
    }

    getStuff(uri: String): Observable<any>{
        let requestoptions = {headers:new HttpHeaders().set("Content-type", "application/json").set("withCredentials", "true")};
        let url = this.hostdomain + uri;
        return this.http.get(url,requestoptions);
    }

    /*getStuff(uri: String, postdata){
        let url = this.hostdomain + uri;
        return this.http.get(url,postdata, this.requestoptions).map(res=> <any>res.json());
    }*/

    /*postStuffRawOutput(uri: String, postdata){
        let url = this.hostdomain + uri;
        return this.http.post(url,postdata,this.requestoptions);

    }*/


}

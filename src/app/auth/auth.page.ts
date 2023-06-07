import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isload = false;
  isLogin = true;
  constructor(private authSer: AuthService,private router : Router, private Toast: ToastController,
    private loadingCtrl:LoadingController) { }

  ngOnInit() {
  }
  onLogin(){

// this.isload = true;

this.authSer.onLogin();
this.loadingCtrl.create({
  keyboardClose: true,message: 'Loggin in...',
}).then(loadingEl =>{
  loadingEl.present();
  setTimeout(() => {
    this.isload= false;
    loadingEl.dismiss();
    this.router.navigateByUrl('/places/tabs/discover');
  }, 1500);
})
}
async presentToast(position: 'top' | 'middle' | 'bottom') {
  const toast = await this.Toast.create({
    message: 'WellCome',
    duration: 1500,
    position: position
  });

  await toast.present();
}
onSingup() {
  this.router.navigateByUrl('/signup');
}
noSubmit(form:NgForm){
 if (!form.valid){
  return;
 }
 const email = form.value.email;
 const password = form.value.password;
 console.log(email,password);
 if(this.isLogin){
  // send a request to login server
 }
 else{
  // send a request to a singup server
 }
}

}

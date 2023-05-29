import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authSer:AuthService,
    private router:Router,
    private alertCtrl : AlertController
  ) {}

//   onLogout(){
// this.authSer.onlogout();
// this.router.navigateByUrl('/auth');
//   }

isSelected(path: string): boolean {
  return this.router.url === path;
}

  onLogout() {
    this.alertCtrl.create({
      header: 'Are You Sure?',
      message: 'Do you really want to Logout Your Account?',
      buttons: [
        {
          text: 'Cancle',
          role: 'cancle'
        },
        {
          text: 'Logout',
          handler: () => {
            this.authSer.onlogout;
            this.router.navigate(['/auth']);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }
}

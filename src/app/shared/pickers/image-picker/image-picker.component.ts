import { Component, OnInit, NgZone } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { enableProdMode, Injector, NgZone as AngularZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}
AngularZone.assertNotInAngularZone = () => {};
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err))
  .finally(() => {
    // Run the element loader outside of the Angular Zone
    const ngZone = Injector.create({ providers: [], parent: platformBrowserDynamic().injector }).get(NgZone);
    ngZone.runOutsideAngular(() => {
      defineCustomElements(window);
    });
  });

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;

  constructor(private ngZone: NgZone) {
    this.selectedImage = '';
  }

  ngOnInit() {}

  async onPickImage() {
    const imageSource = await this.presentImageSourceActionSheet();
    if (imageSource === 'camera') {
      this.captureFromCamera();
    } else if (imageSource === 'gallery') {
      this.pickFromGallery();
    }
  }

  async presentImageSourceActionSheet(): Promise<string> {
    return new Promise<string>((resolve) => {
      const buttons = [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            resolve('camera');
          },
        },
        {
          text: 'Photo Gallery',
          icon: 'image',
          handler: () => {
            resolve('gallery');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            resolve('');
          },
        },
      ];

      // Show the action sheet
      const actionSheet = document.createElement('ion-action-sheet');
      actionSheet.buttons = buttons;
      document.body.appendChild(actionSheet);
      actionSheet.present();
    });
  }

  async captureFromCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    this.ngZone.run(() => {
      this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
    });
  }

  async pickFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });

    this.ngZone.run(() => {
      this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
    });
  }
}

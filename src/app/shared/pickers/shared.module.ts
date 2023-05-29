import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent} from './image-picker/image-picker.component'
import { LocationPickerComponent } from './location-picker/location-picker.component';

@NgModule({
  declarations: [

    LocationPickerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    LocationPickerComponent
  ]
})
export class SharedModule { }

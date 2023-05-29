import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  constructor(private bookingSer: BookingService, private loadingCtrl: LoadingController) { }
loadbooking!: Booking[];
private  bookingSub!: Subscription;
  ngOnInit() {
    this.bookingSer.bookings.subscribe(bookings=>{
      this.loadbooking=bookings
    });
  }
  oncancle(bookId:string,slideitem:IonItemSliding){
    slideitem.close();
    this.loadingCtrl.create({
      message:'Cancelling....'
    }).then(loadingEl =>{
      loadingEl.present();
      this.bookingSer.cancelBooking(bookId).subscribe(()=>{
        loadingEl.dismiss();
      });
    })
    console.log('Delete item:', bookId);
}
ngOnDestroy() {
  if(this.bookingSub){
    this.bookingSub.unsubscribe();
  }
}
}

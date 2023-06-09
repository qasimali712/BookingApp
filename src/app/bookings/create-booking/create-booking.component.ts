import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';
import { PlacesService } from 'src/app/places/places.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace!: Place[];
  @ViewChild('f') form!: NgForm;
  constructor(private placeService: PlacesService,
  private modalCtrl: ModalController,
  private navCtrl: NavController) { }

  ngOnInit() {
    this.selectedPlace = this.placeService.places;
  }

  onCancle() {
    this.modalCtrl.dismiss(null, 'Cancle');
  }
  onBook() {
    if (!this.form.valid) {
      return;
    }
    const bookingData =  {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guestNumber: +this.form.value['guest-number'],
        startDate: new Date(this.form.value['date-from']),
        endDate: new Date(this.form.value['date-to'])

      }
      this.modalCtrl.dismiss({bookingData}, 'book').then(() => {
        this.navCtrl.navigateRoot('/bookings'); // Navigate to the BookingsPage
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingService } from '../../../../app/bookings/booking.service';
@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place | undefined;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private actionCtrl: ActionSheetController,
    private bookingSer: BookingService
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('placeId')) {
        const placeId = paramMap.get('placeId') as string;
        this.place = this.placeService.getPlace(placeId);

        if (!this.place) {
          // Place not found, handle error or redirect
          // For example, redirect to the Discover page
          this.navCtrl.navigateBack('/places/tabs/discover');
        }
      } else {
        // PlaceId parameter not found, handle error or redirect
        // For example, redirect to the Discover page
        this.navCtrl.navigateBack('/places/tabs/discover');
      }
    });
  }

  onBook() {
    this.actionCtrl
      .create({
        header: 'Choose an Action',
        // cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Select Date',
            icon: 'calendar',
            handler: () => {
              this.openBook('select');
            },
          },
          {
            text: 'Random Date',
            icon: 'shuffle',
            handler: () => {
              this.openBook('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ],
      })
      .then((actionEl) => {
        actionEl.present();
      });

    // this.router.navigateByUrl('/places/tabs/discover');
    //  this.navCrtl.navigateBack('/places/tabs/discover');
  }
  openBook(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((result) => {
        // console.log(result.data, result.role);
        if (result.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Booking place...' })
            .then((loadingEl) => {
              loadingEl.present();
              const data = result.data.bookingData;
              this.bookingSer
                .addBooking(
                  data.placeId,
                  data.placeTitle,
                  data.placeImage,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }
}

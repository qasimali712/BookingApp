import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-booking',
  templateUrl: './offer-booking.page.html',
  styleUrls: ['./offer-booking.page.scss'],
})
export class OfferBookingPage implements OnInit {
  place: Place | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeSer: PlacesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('placeId')) {
        const placeId = paramMap.get('placeId') as string;
        this.place = this.placeSer.getPlace(placeId);

        if (!this.place) {
          // Place not found, handle error or redirect
          // For example, redirect to the Offers page
          this.navCtrl.navigateBack('/places/tabs/offers');
        }
      } else {
        // PlaceId parameter not found, handle error or redirect
        // For example, redirect to the Offers page
        this.navCtrl.navigateBack('/places/tabs/offers');
      }
    });
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  private placesSubscription: Subscription | null = null;

  constructor(private placeService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.placesSubscription = this.placeService.fetchPlaces().subscribe(
      (places) => {
        this.offers = places;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ionViewWillEnter() {
    this.fetchData();
  }

  doRefresh(event: any) {
    console.log('doRefresh called');
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe(); // Cancel the previous subscription
    }

    this.placeService.fetchPlaces().subscribe(res => {
      console.log(res);
      this.offers = res;
      event.target.complete();
    });
  }

  onEdit(offerId: string, slideItem: IonItemSliding) {
    slideItem.close();
    this.router.navigate(['/places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Offer Select', offerId);
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}

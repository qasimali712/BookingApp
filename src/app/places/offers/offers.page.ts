import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, PopoverController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';
import { PopOverComponent } from './pop-over/pop-over.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  isLoading: boolean = true;
  private placesSubscription: Subscription | null = null;

  constructor(private placeService: PlacesService,
     private router: Router,
     private popoverController: PopoverController) {}

  ngOnInit() {
    this.fetchData();
    this.placeService.placeUpdated.subscribe(() => {
      this.fetchData();
    });
  }

  fetchData() {
    this.placesSubscription = this.placeService.fetchPlaces().subscribe(
      (places) => {
        this.offers = places;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  ionViewWillEnter() {
    this.fetchData();
    this.placesSubscription = this.placeService
      .fetchPlaces()
      .subscribe((res) => {
        console.log(res);
      });
  }

  doRefresh(event: any) {
    console.log('doRefresh called');
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe(); // Cancel the previous subscription
    }

    this.placeService.fetchPlaces().subscribe((res) => {
      console.log(res);
      this.offers = res;
      event.target.complete();
      // Generate new image URLs for each place
      // for (const place of this.offers) {
      //   this.placeService.generateRandomImage().subscribe((imageUrl) => {
      //     place.image = imageUrl;
      //   });
      // }
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
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopOverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        selectedOptions: [],
      },
    });

    popover.onDidDismiss().then((result) => {
      const selectedOptions = result.data as string[];
      console.log('Selected options:', selectedOptions);
      // Perform sorting logic based on selectedOptions array
      // ...
    });

    return await popover.present();
  }
}

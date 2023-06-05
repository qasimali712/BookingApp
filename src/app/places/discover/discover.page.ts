import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  load!: Place[];
  loadPlace!: Place[];
  releventPlaces!: Place[];
  private placeSub: Subscription | null = null;
  selectedSegment: string = 'all';
  isLoading: boolean = true;

  constructor(private placeService: PlacesService, private authSer: AuthService) { }

  ngOnInit() {
    this.fetchPlaces();
    this.load = this.placeService.places;
    this.releventPlaces = this.load;
    this.loadPlace = this.releventPlaces.slice(1);
    this.placeService.placeUpdated.subscribe(() => {
      this.fetchPlaces();
    });
  }

  fetchPlaces() {
    this.placeSub = this.placeService.fetchPlaces().subscribe(
      (places) => {
        this.loadPlace = places;
        this.releventPlaces = this.loadPlace;
        this.loadPlace = this.releventPlaces.slice(1);
        this.isLoading = false; // Set isLoading to false once data is fetched
      },
      (error) => {
        console.log(error);
        this.isLoading = false; // Set isLoading to false in case of error
      }
    );
  }

  ionViewWillEnter() {
    if (this.selectedSegment !== 'bookable') {
      this.fetchPlaces();
    }
  }

  doRefresh(event: any) {
    console.log('doRefresh called');
    if (this.placeSub) {
      this.placeSub.unsubscribe(); // Cancel the previous subscription
    }

    this.placeService.fetchPlaces().subscribe(res => {
      console.log(res);
      this.load = res;
      event.target.complete();
      // Generate new image URLs for each place
      // for (const place of this.load) {
      //   this.placeService.generateRandomImage().subscribe(imageUrl => {
      //     place.image = imageUrl;
      //   });
      // }
    });
  }


  filterUpdate(event: any) {
    if (event.detail.value === 'all') {
      this.releventPlaces = this.load;
      this.loadPlace = this.releventPlaces.slice(1);
      this.selectedSegment = event.detail.value;
    } else {
      this.releventPlaces = this.load.filter(place => place.userId !== this.authSer.userId);
    }
    this.loadPlace = this.releventPlaces.slice(1);
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}

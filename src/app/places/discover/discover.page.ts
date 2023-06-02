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

  constructor(private placeService: PlacesService, private authSer: AuthService) { }

  ngOnInit() {
    this.fetchPlaces();
    this.load = this.placeService.places;
    this.releventPlaces = this.load;
    this.loadPlace = this.releventPlaces.slice(1);
  }

  fetchPlaces() {
    this.placeSub = this.placeService.fetchPlaces().subscribe(
      (places) => {
        this.loadPlace = places;
        this.releventPlaces = this.loadPlace;
        this.loadPlace = this.releventPlaces.slice(1);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ionViewWillEnter() {
    this.fetchPlaces();
    this.placeSub = this.placeService.fetchPlaces().subscribe(res => {
      console.log(res);
    });
  }

  doRefresh(event: any) {
    console.log('doRefresh called');
    this.placeService.fetchPlaces().subscribe(res => {
      console.log(res);
      this.load = res;

      // Generate new image URLs for each place
      for (const place of this.load) {
        this.placeService.generateRandomImage().subscribe(imageUrl => {
          place.image = imageUrl;
        });
      }

      event.target.complete();
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

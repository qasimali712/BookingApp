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
  private placeSub!: Subscription;
  selectedSegment: string = 'all';
  constructor(private placeService: PlacesService, private authSer: AuthService
  ) { }

  ngOnInit() {
    this.load = this.placeService.places;
    this.releventPlaces = this.load;
    this.loadPlace = this.releventPlaces.slice(1);
  }

  filterUpdate(event: any) {
    if (event.detail.value === 'all') {
      this.releventPlaces = this.load;
      this.loadPlace = this.releventPlaces.slice(1);
      this.selectedSegment = event.detail.value;
    }
    else {
      this.releventPlaces = this.load.filter(place => place.userId !== this.authSer.userId);
    }
    this.loadPlace = this.releventPlaces.slice(1);
  }
ngOnDestroy() {
  if(this.placeSub){
    this.placeSub.unsubscribe();
  }
}

}

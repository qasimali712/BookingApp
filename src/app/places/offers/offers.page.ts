import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers!: Place[];
  constructor( private placeService: PlacesService, private router : Router) { }

  ngOnInit() {
    this.offers = this.placeService.places;
    console.log(this.offers);
  }
  ionViewWillEnter(){
this.placeService.fetchPlaces().subscribe(res=>{
  console.log(res);
});
  }
  onEdit(offerId: string, slideItem:IonItemSliding){
    slideItem.close();
    this.router.navigate(['/', 'places' , 'tabs', 'offers','edit',offerId])
    console.log('Offer Select', offerId);
  }
}

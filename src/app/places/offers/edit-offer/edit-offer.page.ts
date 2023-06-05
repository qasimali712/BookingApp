import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place!: Place;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private placeSrc: PlacesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/place/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId') as string;
      this.place = this.placeSrc.getPlace(placeId) as Place;
      console.log('Edit Select:', placeId);
      console.log('Initial Place:', this.place);

      this.form = new FormGroup({
        title: new FormControl(this.place.title, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        description: new FormControl(this.place.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(380)],
        }),
      });
    });
  }

  updateOffer() {
    if (!this.form.valid) {
      return;
    }
    console.log('Form:', this.form);

    // Create a new object to hold the updated place data
    const updatedPlace: Place = {
      ...this.place, // Copy existing place data
      title: this.form.value.title,
      description: this.form.value.description

    };

    // Call the updatePlace() function to update the place
    this.placeSrc.updatePlace(updatedPlace).subscribe(
      () => {
        console.log('Place updated successfully');
        // Navigate back to the offers page
        this.navCtrl.navigateBack('/places/tabs/offers');
      },
      error => {
        console.log('Error updating place:', error);
      }
    );
  }

}

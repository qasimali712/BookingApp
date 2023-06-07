import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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
    private navCtrl: NavController,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
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
          validators: [Validators.required, Validators.maxLength(500)],
        }),
        price: new FormControl(this.place.price, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(1)]
        }),

        dateFrom: new FormControl(this.place.dateFrom.toISOString(), {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dateTo: new FormControl(this.place.dateTo.toISOString(), {
          updateOn: 'blur',
          validators: [Validators.required]
        })
      });

      // Run the form value updates inside the NgZone
      setTimeout(() => {
        this.ngZone.run(() => {
          this.form.patchValue({
            dateFrom: this.place.dateFrom.toISOString(),
            dateTo: this.place.dateTo.toISOString()
          });
          this.cd.detectChanges(); // Add this line
        });
      }, 0);
    });
  }

  updateOffer() {
    if (!this.form.valid) {
      return;
    }

    const updatedPlace: Place = {
      ...this.place,
      title: this.form.value.title,
      description: this.form.value.description,
      price: +this.form.value.price,
      dateFrom: new Date(this.form.value.dateFrom),
      dateTo: new Date(this.form.value.dateTo)
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
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

}

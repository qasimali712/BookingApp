import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, IonModal } from '@ionic/angular';
import { PlacesService } from '../../places.service';
@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form!: FormGroup;
  // @ViewChild('fromDatetimeModal') fromDatetimeModal!: IonModal;
  // @ViewChild('toDatetimeModal') toDatetimeModal!: IonModal;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  createOffer() {
    if (this.form.valid) {
      const dateFrom = new Date(this.form.value.dateFrom);
      const dateTo = new Date(this.form.value.dateTo);

      this.placesService.addPlace(
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        dateFrom,
        dateTo
      );

      console.log(this.form);

      this.form.reset();
      this.router.navigate(['/places/tabs/offers']);
    }
  }

  onDatetimeChange(event: any, type: 'from' | 'to') {
    const selectedDate = new Date(event.detail.value);

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          if (type === 'from') {
            this.form.patchValue({ dateFrom: selectedDate });
          } else {
            this.form.patchValue({ dateTo: selectedDate });
          }
        });
      }, 0);
    });
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }
}

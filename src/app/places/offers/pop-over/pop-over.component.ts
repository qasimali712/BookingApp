import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-over',
  templateUrl: './pop-over.component.html',
  styleUrls: ['./pop-over.component.scss'],
})
export class PopOverComponent  implements OnInit {
  selectedOptions: string[] = [];
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}
  onOption1() {
    console.log('Option 1 clicked');
    this.popoverController.dismiss(this.selectedOptions);
  }

  onOption2() {
    console.log('Option 2 clicked');
    this.popoverController.dismiss(this.selectedOptions);
  }

  onOption3() {
    console.log('Option 3 clicked');
    this.popoverController.dismiss(this.selectedOptions);
  }
  onCheckboxChange(event: any, option: string) {
    if (event.detail.checked) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter((item) => item !== option);
    }
  }
  onContinue() {
    console.log('Continue button clicked');
    //console.log('Selected options:', this.selectedOptions);
    this.popoverController.dismiss(this.selectedOptions);
  }
}

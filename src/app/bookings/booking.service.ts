import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authSer: AuthService) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date) {
    const newBooking = new Booking(Math.random().toString(), placeId,
      this.authSer.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo);
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }
  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b =>
          b.id !== bookingId));
      })
    );
  }
}


// export class BookingService{
//   private _bookings: Booking[] = [
//     {
//       id:'xyz',
//       placeId:'p1',
//       placeTitle:'Lahore',
//       guestNumber: 3,
//       userId:'abc',


//     }
// ];
// get bookings(){
//   return[...this._bookings];


// }
// }

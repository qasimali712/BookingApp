import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable, throwError, Subject } from 'rxjs';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  [key: string]: {
    title: string;
    description: string;
    image: string;
    price: number;
    dateFrom: string;
    dateTo: string;
    userId: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private readonly PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/200';
  private _places: Place[] = [];
  placeUpdated = new Subject<Place>(); // Add placeUpdated subject

  get places() {
    return [...this._places];
  }

  constructor(private authSer: AuthService, private http: HttpClient) { }

  fetchPlaces(): Observable<Place[]> {
    return this.http
      .get<PlaceData>('https://newone-de6b9-default-rtdb.asia-southeast1.firebasedatabase.app/f-places.json')
      .pipe(
        map(res => {
          const places: Place[] = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              const placeData = res[key];
              const place = new Place(
                key,
                placeData.title,
                placeData.description,
                placeData.image,
                placeData.price,
                new Date(placeData.dateFrom),
                new Date(placeData.dateTo),
                placeData.userId
              );
              places.push(place);
            }
          }
          this._places = places;
          return places;
        }),
        catchError(errorRes => {
          // Handle error
          return throwError(errorRes);
        })
      );
  }

  getPlace(id: string): Place | undefined {
    return this._places.find(p => p.id === id);
  }
  deletePlace(placeId: string): Observable<void> {
    const index = this.places.findIndex(place => place.id === placeId);
    if (index >= 0) {
      const deletedPlace = this.places[index];
      this.places.splice(index, 1);

      return this.http.delete<void>(`https://newone-de6b9-default-rtdb.asia-southeast1.firebasedatabase.app/f-places/${placeId}.json`).pipe(
        tap(() => {
          // Success: Place deleted from the Firebase database
          console.log('Place deleted from Firebase');
        }),
        catchError((error) => {
          // Error: Handle the error appropriately
          console.log('Error deleting place from Firebase', error);

          // If the deletion fails, you may need to reinsert the deleted place back into the local array
          this.places.splice(index, 0, deletedPlace);

          // Throw the error again to propagate it
          throw error;
        })
      );
    } else {
      // If the place is not found, return an empty observable
      return of();
    }
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    this.generateRandomImage().subscribe(imageUrl => {
      const newPlace = new Place(
        Math.random().toString(),
        title,
        description,
        imageUrl,
        price,
        dateFrom,
        dateTo,
        this.authSer.userId
      );

      this.http.post<{ name: string }>('https://newone-de6b9-default-rtdb.asia-southeast1.firebasedatabase.app/f-places.json', { ...newPlace, id: null })
        .subscribe(res => {
          newPlace.id = res.name;
          this._places.push(newPlace);
        });
    });
  }

  updatePlace(place: Place): Observable<void> {
    // Prepare the updated data
    const updatedPlaceData = {
      title: place.title,
      description: place.description,
      image: place.image,
      price: place.price,
      dateFrom: place.dateFrom instanceof Date && !isNaN(place.dateFrom.getTime()) ? place.dateFrom.toISOString() : null,
      dateTo: place.dateTo instanceof Date && !isNaN(place.dateTo.getTime()) ? place.dateTo.toISOString() : null,
      userId: place.userId
    };

    // Send an HTTP request to update the data in Firebase
    return this.http.put<void>(
      `https://newone-de6b9-default-rtdb.asia-southeast1.firebasedatabase.app/f-places/${place.id}.json`,
      updatedPlaceData
    ).pipe(
      tap(() => {
        console.log('Update success');
        // Update the place in the local array
        const updatedPlaces = [...this._places];
        const oldPlaceIndex = updatedPlaces.findIndex(p => p.id === place.id);
        updatedPlaces[oldPlaceIndex] = { ...updatedPlaces[oldPlaceIndex], ...place };
        this._places = updatedPlaces;

        // Emit the event to notify subscribers that the place has been updated
        this.placeUpdated.next(place);
      }),
      catchError((error) => {
        console.log('Update error:', error);
        console.log(error);
        // Throw the error again to propagate it
        throw error;
      })
    );
  }



  generateRandomImage(): Observable<string> {
    const randomNumber = Math.floor(Math.random() * 1000);
    const timestamp = Date.now();
    const imageUrl = `https://picsum.photos/200?random=${randomNumber}`;

    return new Observable<string>(observer => {
      const img = new Image();
      img.onload = () => {
        observer.next(imageUrl);
        observer.complete();
      };
      img.onerror = () => {
        observer.next(this.PLACEHOLDER_IMAGE_URL);
        observer.complete();
      };
      img.src = imageUrl;
    });
  }
}

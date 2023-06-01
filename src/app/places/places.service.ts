import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
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
  // public _places: Place[] = [
  //   new Place(
  //     'p1',
  //     'Capital of Pakistan',
  //     'Islām-ābād) is the capital city of Pakistan. It is the countrys ninth-most populous city, with a population of over 12 million people, and is federally administered by the Pakistani government as part of the Islamabad Capital Territory.',
  //     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Faisal_Mosque%2C_Islamabad_III.jpg/800px-Faisal_Mosque%2C_Islamabad_III.jpg',
  //     800,
  //     new Date('2023-01-01'),
  //     new Date('2023-12-31'),
  //     'abc'
  //   ),
  //   new Place(
  //     'p2',
  //     'City in Pakistan',
  //     'Multan is one of the oldest continuously inhabited cities in Asia, with a history stretching deep into antiquity. The ancient city was the site of the renowned Multan Sun Temple, and was besieged by Alexander the Great during the Mallian Campaign.',
  //     'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Tomb_of_Shah_Rukn-e-Alam_Multan.jpg/800px-Tomb_of_Shah_Rukn-e-Alam_Multan.jpg',
  //     800,
  //     new Date('2023-01-01'),
  //     new Date('2023-12-31'),
  //     'abc'
  //   ),
  //   // new Place(
  //   //   'p3',
  //   //   'Heart of Pakistan',
  //   //   'Lahores origins reach into antiquity. The city has been inhabited for at least two millennia, although it rose to prominence in the 10th century.',
  //   //   'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Data_Durbar_as_more_then_one_decade_before_by_Usman_Ghani.jpg/1024px-Data_Durbar_as_more_then_one_decade_before_by_Usman_Ghani.jpg',
  //   //   800,
  //   //   new Date('2023-01-01'),
  //   //   new Date('2023-12-31'),
  //   //   'cdx'
  //   // ),


  // ];
  get places() {
    return [...this._places];
  }

  constructor(private authSer: AuthService, private http: HttpClient) { }

  fetchPlaces(): Observable<Place[]> {
    return this.http
      .get<PlaceData>('https://newone-de6b9-default-rtdb.asia-southeast1.firebasedatabase.app/f-places.json')
      .pipe(
        map(res => {
          const places = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  res[key].title,
                  res[key].description,
                  res[key].image,
                  res[key].price,
                  new Date(res[key].dateFrom),
                  new Date(res[key].dateTo),
                  res[key].userId
                )
              );
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

  generateRandomImage(): Observable<string> {
    const randomNumber = Math.floor(Math.random() * 1000);
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

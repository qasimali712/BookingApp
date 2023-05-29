import { Injectable } from '@angular/core';
import { Route,UrlSegment, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authSer:AuthService , private router:Router){}
  canLoad(route: Route,
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean>  | boolean  {
    if(!this.authSer.userIsAuthentecated){
this.router.navigateByUrl('/auth');
    }
    return this.authSer.userIsAuthentecated;
  }

}

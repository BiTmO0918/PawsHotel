import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes this guard available throughout the app
})
export class AuthGuardGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  // This method determines if a route can be activated
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    // Check if 'currentUser' is stored in local storage
    if (localStorage.getItem('currentUser')) {
      return true; // Allow route activation if the user is logged in
    }
    
    // If the user is not logged in, navigate to the login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

    return false; // Prevent route activation
  }
}

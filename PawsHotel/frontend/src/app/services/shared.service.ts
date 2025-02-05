import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const endpoint = 'http://localhost:3000/price-plans/'; // Base URL for price plans API

@Injectable({
  providedIn: 'root' // Makes this service available throughout the app
})
export class SharedService {
  private pricePlans: { name: string, price: number }[] = []; // Array to store price plans
  private hotelName = 'PawsHotel'; // Hotel name
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn()); // Observable to track login status
  private adminStatus = new BehaviorSubject<boolean>(this.isAdmin()); // Observable to track admin status

  constructor(private http: HttpClient) {
    this.loadPricePlans().subscribe(); // Load price plans on service initialization
  }

  // Load price plans from the server
  loadPricePlans(): Observable<{ name: string, price: number }[]> {
    return this.http.get<{ name: string, price: number }[]>(endpoint + 'plans').pipe(
      tap(plans => this.pricePlans = plans) // Update the pricePlans array with the received data
    );
  }

  // Get the current price plans
  getPricePlans(): { name: string, price: number }[] {
    return this.pricePlans;
  }

  // Set the price plans and update the server
  setPricePlans(plans: { name: string, price: number }[]): Observable<any> {
    this.pricePlans = plans; // Update the local pricePlans array
    const headers = this.getHeaders(); // Get the headers for the HTTP request
    return this.http.post(endpoint + 'plans', plans, { headers: headers }).pipe(
      tap(() => this.loadPricePlans().subscribe()) // Reload the price plans after the update
    );
  }

  // Get the hotel name
  getHotelName() {
    return this.hotelName;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser'); // Check if currentUser exists in local storage
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin ? JSON.parse(isAdmin) : false; // Parse and return the admin status from local storage
  }

  // Get the login status as an observable
  getLoginStatus() {
    return this.loginStatus.asObservable();
  }

  // Set the login status
  setLoginStatus(isLoggedIn: boolean): void {
    this.loginStatus.next(isLoggedIn); // Update the login status observable
  }

  // Get the admin status as an observable
  getAdminStatus() {
    return this.adminStatus.asObservable();
  }

  // Set the admin status
  setAdminStatus(isAdmin: boolean): void {
    this.adminStatus.next(isAdmin); // Update the admin status observable
  }

  // Get the token from local storage
  private getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.token; // Return the token if available
    }
    return null;
  }

  // Get headers for HTTP requests, including the authorization token if available
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.getToken();
    if (token) {
      headers = headers.set('x-access-token', token); // Set the token in the headers
    }

    return headers;
  }
}

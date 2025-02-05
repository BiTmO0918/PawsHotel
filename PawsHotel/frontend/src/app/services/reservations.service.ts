import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/Reservations';

const endpoint = 'http://localhost:3000/reservations/'; // Base URL for reservations API

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  // Create a new reservation
  createReservation(formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(endpoint + 'create-reservation', formData, { headers: headers });
  }

  // Get all reservations
  getAllReservations(): Observable<Reservation[]> {
    const headers = this.getHeaders();
    return this.http.get<Reservation[]>(endpoint + 'list-all', { headers: headers });
  }

  // Get reservations for the currently logged-in user
  getUserReservations(): Observable<Reservation[]> {
    const headers = this.getHeaders();
    return this.http.get<Reservation[]>(endpoint + 'list', { headers: headers });
  }

  // Get a reservation by its ID
  getReservationById(id: string): Observable<Reservation> {
    const headers = this.getHeaders();
    return this.http.get<Reservation>(`${endpoint}${id}`, { headers: headers });
  }

  // Update an existing reservation
  updateReservation(id: string, formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    console.log('update serviço...'); // Debug log
    return this.http.put<any>(endpoint + 'update/' + id, formData, { headers: headers });
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
    let headers = new HttpHeaders();

    const token = this.getToken();
    if (token) {
      headers = headers.set('x-access-token', token); // Set the token in the headers
    }

    return headers;
  }
}

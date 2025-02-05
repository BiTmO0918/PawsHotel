import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelpRequest } from '../models/HelpRequest';

const endpoint = 'http://localhost:3000/users/'; // Base URL for user-related endpoints
const endpoint2 = 'http://localhost:3000/auth/'; // Base URL for authentication-related endpoints
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class UsersService {
  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(endpoint + 'all-users', { headers: headers });
  }

  // Inactivate a user by ID
  inactiveUser(id: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.post<User>(endpoint + 'inactive/' + id, httpOptions, {
      headers: headers,
    });
  }

  // Activate a user by ID
  activeUser(id: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.post<User>(endpoint + 'active/' + id, httpOptions, {
      headers: headers,
    });
  }

  // Get the profile of the currently logged-in user
  getUserProfile(): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(endpoint2 + 'profile', { headers: headers });
  }

  // Edit the profile of the currently logged-in user
  editUserProfile(user: User): Observable<User> {
    const headers = this.getHeaders();
    return this.http.post<User>(
      endpoint + 'edit-profile',
      user, // Sends the user object in the request body
      { headers: headers }
    );
  }

  // Send a help request
  sendHelpRequest(
    fullName: string,
    email: string,
    phone: string,
    subject: string,
    message: string
  ): Observable<HelpRequest> {
    const headers = this.getHeaders();
    if (!fullName) {
      return this.http.post<HelpRequest>(
        endpoint + 'create-user-request',
        new RequestModel('', '', '', subject, message), // Sends a help request without full name
        { headers: headers }
      );
    }
    return this.http.post<HelpRequest>(
      endpoint + 'create-request',
      new RequestModel(fullName, email, phone, subject, message), // Sends a help request with full details
      httpOptions
    );
  }

  // Get all help requests
  getHelpRequests(): Observable<HelpRequest[]> {
    const headers = this.getHeaders();
    return this.http.get<HelpRequest[]>(endpoint + 'all-requests', { headers: headers });
  }

  // Delete a help request by ID
  deleteHelpRequest(id: string): Observable<HelpRequest> {
    const headers = this.getHeaders();
    return this.http.post<User>(endpoint + 'delete-request/' + id, httpOptions, {
      headers: headers,
    });
  }

  // Get the token from local storage
  private getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.token; // Returns the token if available
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
      headers = headers.set('x-access-token', token); // Sets the token in the headers
    }

    return headers;
  }
}

// Model for help request
export class RequestModel {
  constructor(
    public fullName: string,
    public email: string,
    public phone: string | null,
    public subject: string,
    public message: string
  ) {}
}

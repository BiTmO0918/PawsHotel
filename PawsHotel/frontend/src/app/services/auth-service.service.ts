import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const endpoint = 'http://localhost:3000/auth/'; // Base URL for authentication API
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class AuthRestServiceService {
  constructor(private http: HttpClient) {}

  // Method to handle user login
  login(email: string, password: string): Observable<AuthRestModelResponse> {
    return this.http.post<AuthRestModelResponse>(
      endpoint + 'login',
      new LoginModel(email, password), // Send email and password in the request body
      httpOptions
    );
  }

  // Method to handle user logout
  logout() {
    localStorage.removeItem('currentUser'); // Remove currentUser from local storage
    if (localStorage.getItem('isAdmin')) {
      localStorage.removeItem('isAdmin'); // Remove isAdmin from local storage if it exists
    }
  }

  // Method to handle user registration
  register(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    password: string
  ): Observable<AuthRestModelResponse> {
    return this.http.post<any>(
      endpoint + 'register',
      new RegisterModel(firstName, lastName, email, phone, address, password), // Send registration details in the request body
      httpOptions
    );
  }

  // Method to check if the user is an admin
  checkAdmin(): Observable<any> {
    return this.http.get<any>(
      endpoint + 'isAdmin',
      { headers: new HttpHeaders({ 'x-access-token': this.getToken() }) } // Send token in the headers
    );
  }

  // Method to get the token from local storage
  private getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.token; // Return the token
  }
}

// Interface to define the structure of the authentication response
export interface AuthRestModelResponse {
  token: string;
  message: string;
}

// Class to model the login request payload
export class LoginModel {
  constructor(
    public email: string, 
    public password: string
  ) {}
}

// Class to model the registration request payload
export class RegisterModel {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public address: string,
    public password: string
  ) {}
}

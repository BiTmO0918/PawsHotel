import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
// Interceptor to add authorization token to outgoing HTTP requests
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve the current user from local storage
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || "{}");

    // If the current user and token exist, clone the request and set the authorization header
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: { 
          "x-access-token": `${currentUser.token}` // Set the token in the header
        }
      });
    }

    // Pass the request to the next handler in the chain
    return next.handle(request);
  }
}

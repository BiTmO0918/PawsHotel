import { Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { HelpRequestListComponent } from './components/users/help-request-list/help-request-list.component';
import { ReservationCreateComponent } from './components/reservations/reservation-create/reservation-create.component';
import { ReservationListComponent } from './components/reservations/reservation-list/reservation-list.component';
import { PricePlansComponent } from './components/price-plans/price-plans.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { ReservationEditComponent } from './components/reservations/reservation-edit/reservation-edit.component';

// Define the routes for the Angular application
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent // Default route, loads HomeComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent // Route for the About Us page
  },
  {
    path: 'contact-us',
    component: ContactUsComponent // Route for the Contact Us page
  },
  {
    path: 'list-users',
    component: UsersListComponent, // Route for listing users
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: 'login',
    component: LoginComponent // Route for the login page
  },
  {
    path: 'register',
    component: RegisterComponent // Route for the registration page
  },
  {
    path: 'profile',
    component: UserProfileComponent, // Route for user profile
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: 'list-requests',
    component: HelpRequestListComponent, // Route for listing help requests
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: 'list-reservations',
    component: ReservationListComponent, // Route for listing reservations
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: 'create-reservation',
    component: ReservationCreateComponent, // Route for creating a reservation
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: 'plans',
    component: PricePlansComponent, // Route for viewing price plans
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent // Route for the terms of service page
  },
  {
    path: 'edit-reservation/:id',
    component: ReservationEditComponent, // Route for editing a reservation with an ID parameter
    canActivate: [AuthGuardGuard] // Route is protected by AuthGuardGuard
  },
  {
    path: '**', // Wildcard route for handling undefined paths
    redirectTo: '',  
    pathMatch: 'full' // Redirects to the default route
  }
];

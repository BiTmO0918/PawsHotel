import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SharedService } from './services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root', // Selector for the root component
  standalone: true,
  imports: [
    RouterOutlet, // Enables the application to dynamically load components based on the current route
    HeaderComponent, // Header component
    FooterComponent, // Footer component
    AboutUsComponent, // About Us component
    ContactUsComponent // Contact Us component
  ],
  templateUrl: './app.component.html', // HTML template for this component
  styleUrl: './app.component.css' // CSS file for this component
})
export class AppComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false; // State to track if the user is logged in
  isAdmin: boolean = false; // State to track if the user is an admin
  private loginSubscription: Subscription | undefined; // Subscription for login status
  private adminSubscription: Subscription | undefined; // Subscription for admin status

  constructor(
    private sharedService: SharedService, // Shared service to manage state across the application
    private cdr: ChangeDetectorRef // ChangeDetectorRef to manually trigger change detection
  ) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.loginSubscription = this.sharedService.getLoginStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn; // Update isLoggedIn state
      this.cdr.detectChanges(); // Force change detection
    });

    // Subscribe to admin status changes
    this.adminSubscription = this.sharedService.getAdminStatus().subscribe((isAdmin) => {
      this.isAdmin = isAdmin; // Update isAdmin state
      this.cdr.detectChanges(); // Force change detection
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from login status changes to prevent memory leaks
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    // Unsubscribe from admin status changes to prevent memory leaks
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
  }
}

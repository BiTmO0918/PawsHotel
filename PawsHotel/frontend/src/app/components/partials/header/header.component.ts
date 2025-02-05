import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { AuthRestServiceService } from '../../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header', // Selector for the component
  standalone: true, // This component is standalone
  imports: [], // No external modules are imported
  templateUrl: './header.component.html', // HTML template for this component
  styleUrls: ['./header.component.css'], // CSS file for this component
})
export class HeaderComponent implements OnInit {
  hotelName: string = 'hotelName'; // Hotel name to be displayed
  @Input() isLoggedIn: boolean = false; // Input property to track login status
  @Input() isAdmin: boolean = false; // Input property to track admin status

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthRestServiceService
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.hotelName = this.sharedService.getHotelName(); // Get the hotel name from the shared service
  }

  // Method to handle user logout
  logout(): void {
    if (confirm('Are you sure you want to logout?')) { // Confirm logout action
      this.authService.logout(); // Call the logout method of the authentication service
      this.sharedService.setLoginStatus(false); // Update login status in the shared service
      this.sharedService.setAdminStatus(false); // Update admin status in the shared service
      this.navigateToHome(); // Navigate to the home page and reload
    }
  }
  
  // Method to navigate to the home page and reload the page
  private navigateToHome(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload(); // Reload the page to reflect the logout action
    });
  }
}

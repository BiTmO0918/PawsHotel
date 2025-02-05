import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRestServiceService } from '../../services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-login', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule], // Import FormsModule for template-driven forms
  templateUrl: './login.component.html', // HTML template for this component
  styleUrls: ['./login.component.css'], // CSS file for this component
})
export class LoginComponent implements OnInit {
  hotelName: string = 'hotelName'; // Hotel name to be displayed
  email: string;
  password: string;

  constructor(
    private router: Router,
    private authServive: AuthRestServiceService,
    private sharedService: SharedService
  ) {
    this.password = '';
    this.email = '';
  }

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.hotelName = this.sharedService.getHotelName(); // Get the hotel name from the shared service
  }

  // Method to handle user login
  login(): void {
    // Validate email format
    if (!this.isValidEmail(this.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Call the login method of the authentication service
    this.authServive.login(this.email, this.password).subscribe({
      next: (user: any) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user)); // Save the current user in local storage
          this.sharedService.setLoginStatus(true); // Update login status in the shared service

          // Check if the logged-in user is an admin
          this.authServive.checkAdmin().subscribe((res: any) => {
            localStorage.setItem('isAdmin', JSON.stringify(res.isAdmin)); // Save admin status in local storage
            this.sharedService.setAdminStatus(res.isAdmin); // Update admin status in the shared service
          });

          this.router.navigate(['/']); // Navigate to the home page
        } else {
          alert('Login error!'); // Display error message if login fails
        }
      },
      error: (err: any) => {
        // Handle different error statuses
        if (err.status === 404) {
          alert('User not found.');
        } else if (err.status === 401) {
          alert('Wrong password.');
        } else if (err.status === 403) {
          alert('Your account has been deactivated.');
        } else {
          alert('Error on server.');
        }
        console.log('Error on login:', err); // Log any errors
      }
    });
  }

  // Helper method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  }
}

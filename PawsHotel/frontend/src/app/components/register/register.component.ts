import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRestServiceService } from '../../services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-register', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule], // Import FormsModule for template-driven forms
  templateUrl: './register.component.html', // HTML template for this component
  styleUrls: ['./register.component.css'] // CSS file for this component
})
export class RegisterComponent implements OnInit {
  hotelName: string = 'hotelName'; // Hotel name to be displayed
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;

  constructor(private router: Router, private authService: AuthRestServiceService, private sharedService: SharedService) { 
    // Initialize form fields
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.password = '';
  }

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.hotelName = this.sharedService.getHotelName(); // Get the hotel name from the shared service
  }

  // Method to handle user registration
  register(): void {
    // Validate email
    if (!this.isValidEmail(this.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate phone number
    if (!this.isValidPhone(this.phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    // Call the register method of the authentication service
    this.authService.register(this.firstName, this.lastName, this.email, this.phone, this.address, this.password).subscribe((user: any) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user)); // Save the current user in local storage
        this.sharedService.setLoginStatus(true); // Update login status in the shared service

        // Check if the registered user is an admin
        this.authService.checkAdmin().subscribe((res: any) => {
          localStorage.setItem('isAdmin', JSON.stringify(res.isAdmin)); // Save admin status in local storage
          this.sharedService.setAdminStatus(res.isAdmin); // Update admin status in the shared service
        });

        this.router.navigate(['/']); // Navigate to the home page
      } else {
        alert('Error Register!'); // Display error message if registration fails
      }
    });
  }

  // Helper method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  }

  // Helper method to validate phone number format
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  }
}

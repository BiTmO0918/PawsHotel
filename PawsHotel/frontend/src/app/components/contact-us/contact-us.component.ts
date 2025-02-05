import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule
  templateUrl: './contact-us.component.html', // HTML template for this component
  styleUrls: ['./contact-us.component.css'], // CSS file for this component
})
export class ContactUsComponent implements OnInit {
  hotelName: string = 'hotelName'; // Hotel name to be displayed
  hotelEmail: string = 'default@gmail.com'; // Default hotel email
  isLoggedIn: boolean = false; // Flag to track login status

  fullName!: string;
  email: string = '';
  phone!: string;
  subject!: string;
  message!: string;

  constructor(
    private userService: UsersService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    // Subscribe to login status changes
    this.sharedService.getLoginStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.cdr.detectChanges();
    });

    // Get hotel name and set the hotel email
    this.hotelName = this.sharedService.getHotelName();
    this.hotelEmail = `${this.hotelName}@gmail.com`;
  }

  // Method to handle help request form submission
  helpRequest(form: NgForm): void {
    // Validate required fields for non-logged-in users
    if (!this.isLoggedIn && (!this.fullName || !this.email || !this.subject || !this.message)) {
      alert('Please fill in all required fields.');
      return;
    } 
    // Validate required fields for logged-in users
    else if (this.isLoggedIn && (!this.subject || !this.message)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate email format for non-logged-in users
    if (!this.isValidEmail(this.email) && !this.isLoggedIn) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate phone number format
    if (this.phone && !this.isValidPhone(this.phone)) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    // Confirm help request submission
    if (confirm('Are you sure you want to send a help request?')) {
      this.userService.sendHelpRequest(
        this.fullName,
        this.email,
        this.phone,
        this.subject,
        this.message
      ).subscribe(
        (result) => {
          alert('Help request sent successfully! One of our members will contact you as soon as possible.');
          form.reset(); // Reset the form
        },
        (err) => {
          console.log(err); // Log any errors
        }
      );
    }
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

import { Component } from '@angular/core';
import { User } from '../../../models/User';
import { UsersService } from '../../../services/users.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile', // Selector for the component
  standalone: true, // This component is standalone
  imports: [ButtonModule, FormsModule, CommonModule], // Import PrimeNG Button, FormsModule, and CommonModule
  templateUrl: './user-profile.component.html', // HTML template for this component
  styleUrls: ['./user-profile.component.css'], // CSS file for this component
})
export class UserProfileComponent {
  user!: User; // User object to store user profile data

  constructor(private userService: UsersService, private router: Router) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    // Fetch the user profile data from the UsersService
    this.userService.getUserProfile().subscribe(
      (data: User) => {
        this.user = data; // Assign the fetched data to the user object
      },
      (error) => {
        console.error('There was an error fetching the user profile!', error); // Log any errors
      }
    );
  }

  // Method to save changes to the user profile
  saveChanges(): void {
    if (confirm('Are you sure you want to save the changes?')) { // Confirm saving changes
      this.userService.editUserProfile(this.user).subscribe(
        () => {
          alert('Changes saved successfully!'); // Alert the user that changes were saved
          this.router.navigate(['/profile']); // Navigate back to the profile page
        },
        (err) => {
          console.log(err); // Log any errors
        }
      );
    }
  }
}

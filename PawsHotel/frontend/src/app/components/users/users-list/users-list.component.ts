import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UsersService } from '../../../services/users.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list', // Selector for the component
  standalone: true, // This component is standalone
  imports: [TableModule, ButtonModule, FormsModule, CommonModule], // Import PrimeNG Table, Button modules, FormsModule, and CommonModule
  templateUrl: './users-list.component.html', // HTML template for this component
  styleUrl: './users-list.component.css', // CSS file for this component
})
export class UsersListComponent implements OnInit {
  users!: User[]; // Array to store all users
  filteredUsers!: User[]; // Array to store filtered users
  searchQuery: string = ''; // String to store the search query

  constructor(private userService: UsersService) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.getUsers(); // Fetch the list of users when the component is initialized
  }

  // Method to fetch users from the UsersService
  getUsers(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      console.log(data); // Log the fetched data
      this.users = data; // Assign the fetched data to the users array
      this.filteredUsers = data; // Initialize filtered users with the same data
    });
  }

  // Method to inactivate a user
  inactiveUser(id: string): void {
    if (confirm('Are you sure you want to inactivate this user?')) { // Confirm inactivation
      this.userService.inactiveUser(id).subscribe(
        () => {
          this.getUsers(); // Refresh the list of users after inactivation
        },
        (err) => {
          console.log(err); // Log any errors
        }
      );
    }
  }

  // Method to activate a user
  activeUser(id: string): void {
    if (confirm('Are you sure you want to activate this user?')) { // Confirm activation
      this.userService.activeUser(id).subscribe(
        (res) => {
          this.getUsers(); // Refresh the list of users after activation
        },
        (err) => {
          console.log(err); // Log any errors
        }
      );
    }
  }

  // Method to filter users based on the search query
  filterUsers(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = this.users; // If search query is empty, show all users
    } else {
      this.filteredUsers = this.users.filter((user) =>
        (user.firstName + ' ' + user.lastName)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) // Filter users by full name
      );
    }
  }
}

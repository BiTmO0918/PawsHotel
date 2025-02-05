import { Component, OnInit } from '@angular/core';
import { HelpRequest } from '../../../models/HelpRequest';
import { UsersService } from '../../../services/users.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-help-request-list', // Selector for the component
  standalone: true, // This component is standalone
  imports: [TableModule, ButtonModule], // Import PrimeNG Table and Button modules
  templateUrl: './help-request-list.component.html', // HTML template for this component
  styleUrl: './help-request-list.component.css', // CSS file for this component
})
export class HelpRequestListComponent implements OnInit {
  requests!: HelpRequest[]; // Array to store help requests

  constructor(private userService: UsersService) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.getHelpRequests(); // Fetch help requests when the component is initialized
  }

  // Method to get help requests from the UsersService
  getHelpRequests(): void {
    this.userService.getHelpRequests().subscribe((data: HelpRequest[]) => {
      this.requests = data; // Assign the fetched data to the requests array
    });
  }

  // Method to delete a help request
  deleteRequest(id: string): void {
    if (confirm('Are you sure you want to delete this help request?')) { // Confirm deletion
      this.userService.deleteHelpRequest(id).subscribe(
        () => {
          this.getHelpRequests(); // Refresh the help requests list after deletion
        },
        (err) => {
          console.log(err); // Log any errors
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home', // Selector for the component
  standalone: true, // This component is standalone
  imports: [CommonModule], // Import CommonModule
  templateUrl: './home.component.html', // HTML template for this component
  styleUrl: './home.component.css' // CSS file for this component
})
export class HomeComponent implements OnInit {
  pricePlans: { name: string, price: number }[] = []; // Array to store price plans

  constructor(
    private sharedService: SharedService
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.loadPricePlans(); // Load price plans when the component initializes
  }

  // Method to load price plans from the shared service
  loadPricePlans(): void {
    this.sharedService.loadPricePlans().subscribe(plans => {
      this.pricePlans = plans; // Assign the fetched plans to the pricePlans array
    });
  }

  // Method to update price plans
  updatePlans(): void {
    this.sharedService.setPricePlans(this.pricePlans).subscribe(() => {
      console.log('Price plans updated successfully'); // Log a success message
    },
    error => {
      console.error('Error updating price plans', error); // Log any errors
    });
  }
}

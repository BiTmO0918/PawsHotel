import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-plans', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule
  templateUrl: './price-plans.component.html', // HTML template for this component
  styleUrl: './price-plans.component.css', // CSS file for this component
})
export class PricePlansComponent {
  pricePlans: { name: string; price: number }[] = []; // Array to store price plans

  constructor(private sharedService: SharedService) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.loadPricePlans(); // Load price plans when the component initializes
  }

  // Method to load price plans from the shared service
  loadPricePlans(): void {
    this.sharedService.loadPricePlans().subscribe((plans) => {
      this.pricePlans = plans; // Assign the fetched plans to the pricePlans array
    });
  }

  // Method to update price plans
  updatePlans(): void {
    if (confirm('Are you sure you want to update Price Plans?')) { // Confirm the update action
      this.sharedService.setPricePlans(this.pricePlans).subscribe(() => {
        console.log('Price plans updated successfully'); // Log a success message
      });
    }
  }
}

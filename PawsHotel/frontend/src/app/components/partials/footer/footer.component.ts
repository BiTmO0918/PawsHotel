import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-footer', // Selector for the component
  standalone: true, // This component is standalone
  imports: [], // No external modules are imported
  templateUrl: './footer.component.html', // HTML template for this component
  styleUrl: './footer.component.css', // CSS file for this component
})
export class FooterComponent implements OnInit {
  hotelName: string = 'hotelName'; // Hotel name to be displayed

  constructor(private sharedService: SharedService) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.hotelName = this.sharedService.getHotelName(); // Get the hotel name from the shared service
  }
}

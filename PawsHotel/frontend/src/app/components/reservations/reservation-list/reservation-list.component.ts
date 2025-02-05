import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Reservation } from '../../../models/Reservations';
import { ReservationsService } from '../../../services/reservations.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule, CommonModule, TableModule, ButtonModule], // Import FormsModule, CommonModule, PrimeNG Table and Button modules
  templateUrl: './reservation-list.component.html', // HTML template for this component
  styleUrl: './reservation-list.component.css', // CSS file for this component
})
export class ReservationListComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = []; // Array to store all reservations
  filteredReservations: Reservation[] = []; // Array to store filtered reservations
  searchQuery: string = ''; // String to store the search query
  isAdmin: boolean = false; // Flag to track if the user is an admin
  private adminSubscription: Subscription | undefined; // Subscription for admin status

  constructor(
    private reservationsService: ReservationsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    // Subscribe to admin status changes
    this.adminSubscription = this.sharedService.getAdminStatus().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
      this.cdr.detectChanges();

      // Load reservations based on admin status
      if (this.isAdmin) {
        this.loadAllReservations();
      } else {
        this.loadUserReservations();
      }
    });
  }

  // Lifecycle hook that runs when the component is destroyed
  ngOnDestroy(): void {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe(); // Unsubscribe from admin status
    }
  }

  // Method to load all reservations (admin)
  loadAllReservations(): void {
    this.reservationsService.getAllReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.filteredReservations = reservations; // Initialize filtered reservations with the same data
      },
      (err) => {
        console.log(err); // Log any errors
      }
    );
  }

  // Method to load user reservations
  loadUserReservations(): void {
    this.reservationsService.getUserReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.filteredReservations = reservations; // Initialize filtered reservations with the same data
      },
      (err) => {
        console.log(err); // Log any errors
      }
    );
  }

  // Method to filter reservations based on the search query
  filterReservations(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredReservations = this.reservations; // If search query is empty, show all reservations
    } else {
      this.filteredReservations = this.reservations.filter((reservation) => {
        if (reservation && reservation.owner) {
          return reservation.owner
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()); // Filter reservations by owner's name
        }
        return false;
      });
    }
  }

  // Method to navigate to the edit reservation page
  editReservation(id: string): void {
    if (confirm('Are you sure you want to view the reservation details?')) {
      this.router.navigate(['/edit-reservation/', id]); // Navigate to the edit reservation page
    }
  }
}

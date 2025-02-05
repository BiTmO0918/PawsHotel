import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ReservationsService } from '../../../services/reservations.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-create', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule
  templateUrl: './reservation-create.component.html', // HTML template for this component
  styleUrl: './reservation-create.component.css', // CSS file for this component
})
export class ReservationCreateComponent implements OnInit, OnDestroy {
  pricePlans: { name: string; price: number }[] = []; // Array to store price plans
  isAdmin: boolean = false; // Flag to track if the user is an admin
  private adminSubscription: Subscription | undefined; // Subscription for admin status
  maxFileSize = 1 * 1024 * 1024; // Maximum file size (1 MB)

  // Form fields
  owner!: string;
  localization!: string;
  startDate!: string;
  endDate!: string;
  animalName!: string;
  animalSpecie!: string;
  animalBreed!: string;
  photo!: File;
  vaccinationCard!: File;
  obs!: string;
  discountCode!: string;
  price!: number;
  status: string = 'Pending';

  constructor(
    private sharedService: SharedService,
    private reservationService: ReservationsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    // Load price plans from the shared service
    this.sharedService.loadPricePlans().subscribe((plans) => {
      this.pricePlans = plans;
    });

    // Subscribe to admin status changes
    this.adminSubscription = this.sharedService
      .getAdminStatus()
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        this.cdr.detectChanges();
      });
  }

  // Lifecycle hook that runs when the component is destroyed
  ngOnDestroy(): void {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe(); // Unsubscribe from admin status
    }
  }

  // Handle file input change events
  onFileChange(event: any, type: string): void {
    const file = event.target.files[0];
    if (file.size > this.maxFileSize) {
      alert('File size exceeds the maximum size (1 MB).');
      event.target.value = null; // Clear the file input
      return;
    }
    if (type === 'photo') {
      this.photo = file; // Set the photo file
    } else if (type === 'vaccinationCard') {
      this.vaccinationCard = file; // Set the vaccination card file
    }
  }

  // Handle form submission
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      alert('To create a booking request, please fill in all required fields (*).');
      return;
    }

    if (!this.validateDates()) {
      return;
    }

    if (confirm('Do you want to create a reservation?')) {
      const formData = new FormData();
      formData.append('owner', this.owner);
      formData.append('localization', this.localization);
      formData.append('startDate', new Date(this.startDate).toISOString()); // Convert to ISO string
      formData.append('endDate', new Date(this.endDate).toISOString());
      formData.append('animalName', this.animalName);
      formData.append('animalSpecie', this.animalSpecie);
      formData.append('animalBreed', this.animalBreed);
      formData.append('photo', this.photo);
      formData.append('vaccinationCard', this.vaccinationCard);
      formData.append('obs', this.obs);
      formData.append('discountCode', this.discountCode);
      formData.append('price', this.price.toString());
      formData.append('status', this.status);

      // Create a reservation using the reservation service
      this.reservationService.createReservation(formData).subscribe(
        (response) => {
          alert('Reservation created!');
          this.router.navigate(['list-reservations']); // Navigate to the reservations list
        },
        (error) => {
          alert('Something went wrong!');
        }
      );
    }
  }

  // Validate the start and end dates
  private validateDates(): boolean {
    const currentDate = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start < currentDate) {
      alert('Check-in date must be today or later.');
      return false;
    }

    if (end <= start) {
      alert('Check-out date must be after the check-in date.');
      return false;
    }

    return true;
  }
}

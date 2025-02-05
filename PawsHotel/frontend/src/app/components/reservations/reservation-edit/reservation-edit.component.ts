import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../../models/Reservations';
import { ReservationsService } from '../../../services/reservations.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservation-edit', // Selector for the component
  standalone: true, // This component is standalone
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule
  templateUrl: './reservation-edit.component.html', // HTML template for this component
  styleUrls: ['./reservation-edit.component.css'], // CSS file for this component
})
export class ReservationEditComponent implements OnInit, OnDestroy {
  reservation: Reservation = new Reservation(); // Initialize reservation object
  isAdmin: boolean = false; // Flag to track if the user is an admin
  private adminSubscription: Subscription | undefined; // Subscription for admin status

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private reservationsService: ReservationsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get the reservation ID from the route parameters
    if (id) {
      this.reservationsService.getReservationById(id).subscribe((reservation) => {
        if (reservation.obs === 'undefined') {
          reservation.obs = '';
        }
        if (reservation.discountCode === 'undefined') {
          reservation.discountCode = '';
        }
        this.reservation = reservation;

        // Convert dates to the correct format
        if (this.reservation.startDate) {
          this.reservation.startDate = new Date(this.reservation.startDate)
            .toISOString()
            .substring(0, 10);
        }
        if (this.reservation.endDate) {
          this.reservation.endDate = new Date(this.reservation.endDate)
            .toISOString()
            .substring(0, 10);
        }
      });
    }

    // Subscribe to admin status changes
    this.adminSubscription = this.sharedService.getAdminStatus().subscribe((isAdmin) => {
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
    if (type === 'photo') {
      this.reservation.photoURL = file;
    } else if (type === 'vaccinationCard') {
      this.reservation.vaccinationCardURL = file;
    }
  }

  // Handle form submission
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('owner', this.reservation.owner!);
    formData.append('localization', this.reservation.localization!);
    formData.append('startDate', new Date(this.reservation.startDate!).toISOString());
    formData.append('endDate', new Date(this.reservation.endDate!).toISOString());
    formData.append('animalName', this.reservation.animalName!);
    formData.append('animalSpecie', this.reservation.animalSpecie!);
    formData.append('animalBreed', this.reservation.animalBreed!);

    if (this.reservation.photoURL && typeof this.reservation.photoURL !== 'string') {
      formData.append('photo', this.reservation.photoURL as File);
    }

    if (this.reservation.vaccinationCardURL && typeof this.reservation.vaccinationCardURL !== 'string') {
      formData.append('vaccinationCard', this.reservation.vaccinationCardURL as File);
    }

    formData.append('obs', this.reservation.obs!);
    formData.append('discountCode', this.reservation.discountCode!);
    formData.append('price', this.reservation.price!.toString());
    formData.append('status', this.reservation.status!);

    if (confirm('Are you sure you want to edit the reservation?')) {
      this.reservationsService.updateReservation(this.reservation._id!, formData).subscribe(
        (response) => {
          console.log('Reservation updated:', response);
          this.router.navigate(['/list-reservations']); // Navigate to the reservations list
        },
        (error) => {
          console.error('Error updating reservation:', error);
        }
      );
    }
  }

  // Method to cancel the reservation
  cancelReservation(): void {
    this.reservation.status = 'Canceled';

    const formData = new FormData();
    formData.append('owner', this.reservation.owner!);
    formData.append('localization', this.reservation.localization!);
    formData.append('startDate', new Date(this.reservation.startDate!).toISOString());
    formData.append('endDate', new Date(this.reservation.endDate!).toISOString());
    formData.append('animalName', this.reservation.animalName!);
    formData.append('animalSpecie', this.reservation.animalSpecie!);
    formData.append('animalBreed', this.reservation.animalBreed!);

    if (this.reservation.photoURL && typeof this.reservation.photoURL !== 'string') {
      formData.append('photo', this.reservation.photoURL as File);
    }

    if (this.reservation.vaccinationCardURL && typeof this.reservation.vaccinationCardURL !== 'string') {
      formData.append('vaccinationCard', this.reservation.vaccinationCardURL as File);
    }

    formData.append('obs', this.reservation.obs!);
    formData.append('discountCode', this.reservation.discountCode!);
    formData.append('price', this.reservation.price!.toString());
    formData.append('status', this.reservation.status!);

    if (confirm('Are you sure you want to cancel the reservation?')) {
      this.reservationsService.updateReservation(this.reservation._id!, formData).subscribe(
        (response) => {
          console.log('Reservation canceled:', response);
          this.router.navigate(['/list-reservations']); // Navigate to the reservations list
        },
        (error) => {
          console.error('Error canceling reservation:', error);
        }
      );
    }
  }
}

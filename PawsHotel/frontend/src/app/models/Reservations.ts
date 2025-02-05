// Reservation model class to represent reservation data
export class Reservation {
  constructor(
    public _id?: string,
    public owner?: string,
    public localization?: string,
    public startDate?: string | Date,
    public endDate?: string | Date,
    public animalName?: string,
    public animalSpecie?: string,
    public animalBreed?: string,
    public photoURL?: string,
    public vaccinationCardURL?: string,
    public obs?: string,
    public discountCode?: string,
    public price?: number,
    public status?: string
  ) {}
}

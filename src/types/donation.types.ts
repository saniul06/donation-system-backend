export interface IDonationOpts {
  category: string;
  amount: number;
  contact: string;
  userId?: number;
}

export interface IFindDonation {
  id?: number;
  lastId?: number;
  userId?: number;
  category?: string;
}

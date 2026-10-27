export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface BookingDateValidationResult {
  isValid: boolean;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  totalHours?: number;
}

export interface SpaceInput {
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
}
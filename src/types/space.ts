export interface Space {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceFilters {
  type: string;
  minCapacity: string;
  maxPrice: string;
}
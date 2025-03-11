export interface UserProfile {
  firstName: string;
  lastName: string;
  biography: string;
  coordinates: string;
  tags: Array<number>;
  isVerified: boolean;
  profilePercentage: number;
  fameRating: number;
  images: string[];
  gender: number;
  sexualOrientation: number;
}

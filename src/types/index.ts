export interface Format {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  coCreated?: string;
  whyThisShowWins: string;
  color: string;
  glowColor: string;
  rgbColor: string;
  link: string;
  logo: string;
  order: number;
  isActive: boolean;
}

export interface SocialMedia {
  _id: string;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'threads' | 'facebook' | 'youtube';
  link: string;
  order: number;
}

export interface VisionButton {
  _id: string;
  id: string;
  title: string;
  color: string;
  glowColor: string;
  rgbColor: string;
  link: string;
  order: number;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
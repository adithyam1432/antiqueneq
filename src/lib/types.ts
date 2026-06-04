export type UserRole = 'BUYER' | 'ADMIN';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: VerificationStatus;
  contact_number?: string;
  permanent_address?: string;
}

export interface AntiqueProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  image_url?: string;
  status: VerificationStatus;
  commissionRate: number;
  deliveryCharge: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  productId: string;
  totalAmount: number;
  commissionEarned: number;
  deliveryCharge: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'RETURN_REQUESTED' | 'RETURNED';
  createdAt: Date;
}


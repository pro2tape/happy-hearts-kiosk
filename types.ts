
export type Category = 'Iced Coffee' | 'Hot Coffee' | 'Frappes' | 'Milk Tea' | 'Fruit Soda' | 'Meals' | 'Snacks' | 'Desserts';

export interface Variant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: Category;
  basePrice?: number;
  variants?: Variant[]; 
  isBestSeller?: boolean;
  imageUrl?: string;
}

export interface CartItem extends MenuItem {
  cartId: string;
  selectedVariant?: Variant;
  quantity: number;
  totalPrice: number;
}

export type OrderType = 'Dine In' | 'Take Out';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  timestamp: Date;
  status: 'Pending' | 'Completed' | 'Cancelled';
  orderType: OrderType;
}

export interface AttendanceRecord {
  id: string;
  staffName: string;
  type: 'In' | 'Out';
  timestamp: Date;
}

export interface StaffMember {
  id: string;
  name: string;
  hourlyRate: number;
  role: 'Staff' | 'Manager';
  joinedDate: Date;
}

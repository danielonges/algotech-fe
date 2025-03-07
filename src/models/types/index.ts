export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export enum UserRole {
  ADMIN = 'ADMIN',
  INTERN = 'INTERN',
  PARTTIME = 'PARTTIME',
  FULLTIME = 'FULLTIME',
  CUSTOMER = 'CUSTOMER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

export enum FulfilmentStatus {
  CREATED = 'CREATED',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED'
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  PREPARED = 'PREPARED',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum ShippingType {
  MANUAL = 'MANUAL',
  SHIPPIT = 'SHIPPIT',
  NINJAVAN = 'NINJAVAN',
  GRAB = 'GRAB'
}

export enum PlatformType {
  LAZADA = 'LAZADA',
  REDMART = 'REDMART',
  SHOPIFY = 'SHOPIFY',
  SHOPEE = 'SHOPEE',
  OTHERS = 'OTHERS'
}

export enum DeliveryMode {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  PRIORITY = 'PRIORITY'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  image?: string;
  qtyThreshold: number;
  brand: Brand;
  categories: Category[];
  stockQuantity: StockQuantity[];
}

export interface Location {
  id: number;
  name: string;
  address: string;
  stockQuantity: StockQuantity[];
}

export interface StockQuantity {
  productId?: number;
  location: Location;
  price: number;
  quantity: number;
}

export interface Bundle {
  id: number;
  name: string;
  description: string;
  // price: number;
  bundleProduct: Product[];
}

export interface ProcurementOrder {
  id: number;
  orderDate: Date;
  description: string;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  totalAmount: number;
  supplier: Supplier;
  location: Location;
  procOrderItems: ProcurementOrderItem[];
}

export interface ProcurementOrderItem {
  id: number;
  procOrderId: number;
  quantity: number;
  rate: number;
  product: Product;
}

export interface Supplier {
  id: number;
  email: string;
  name: string;
  address: string;
}

export interface DeliveryOrder {
  id: number;
  shippingDate: Date;
  deliveryDate?: Date;
  shippingType: ShippingType;
  currentLocation: string;
  eta: Date;
  salesOrder: SalesOrder;
  salesOrderId: number;
  courierType?: string;
  deliveryPersonnel?: string;
  method?: string;
  carrier?: string;
  parcelQty?: number;
  parcelWeight?: number;
  deliveryMode?: DeliveryMode;
}

export interface SalesOrder {
  id: number;
  orderId: string;
  customerName?: string;
  customerAddress: string;
  postalCode: string;
  customerContactNo: string;
  customerEmail?: string;
  platformType: PlatformType;
  createdTime: Date;
  currency: string;
  amount: number;
  orderStatus: OrderStatus;
  customerRemarks?: string;
  salesOrderItems: SalesOrderItem[];
}
export interface SalesOrderItem {
  id: number;
  salesOrderId: number;
  price: number;
  quantity: number;
  productName?: string;
  createdTime?: Date;
  isNewAdded?: boolean;
}

export interface DailySales {
  // TODO: change to number once BE is fixed
  salesorders: number;
  createddate: Date;
}

export interface SalesBestseller {
  quantity: number;
  productname: string;
}

export interface SalesRevenue {
  revenue: number;
  createddate: Date;
}

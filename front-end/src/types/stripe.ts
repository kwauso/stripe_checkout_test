export interface StripeItem {
  priceId: string;
  quantity: number;
}

export interface CheckoutResponse {
  url: string;
}

export interface ErrorResponse {
  error: string;
} 
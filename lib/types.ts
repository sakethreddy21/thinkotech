export interface Order {
    orderID?: string;
    status?: string;
    totalAmount?: number;
    userDetails?: {
      email?: string;
      username?: string;
      password?: string;
    };
    items?: Array<{
      itemName?: string;
      price?: number;
      quantity?: number;
    }>;
  }


export interface  Item {
    itemName: string;
    stock: number;
    price: number;
    itemId: string;
  };
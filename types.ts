
export enum Category {
  SCENERY = '景點',
  FOOD = '美食',
  TRANSPORT = '交通',
  STAY = '住宿'
}

export interface ScheduleItem {
  id: string;
  time: string;
  location: string;
  category: Category;
  note?: string;
  imageUrl?: string;
  coords?: { lat: number; lng: number };
}

export interface Booking {
  id: string;
  type: 'FLIGHT' | 'STAY' | 'CAR' | 'TICKET';
  title: string;
  details: any;
  pinned: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  currency: 'CAD' | 'TWD';
  category: string;
  payer: string;
  splitWith: string[];
  date: string;
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  assignee: string;
  category: 'TODO' | 'PACKING' | 'SHOPPING';
}

export interface WeatherData {
  temp: number;
  condition: 'SUNNY' | 'RAIN' | 'SNOW' | 'CLOUDY';
  auroraChance?: number;
}

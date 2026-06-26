export interface User {
  id?: string;
  email: string;
  name: string;
  balance: number;
  invested: number;
  returns: number;
  history: Transaction[];
  portfolio?: { [key: string]: number };
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment';
  amount: number;
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  trend: 'up' | 'stable' | 'down';
  growth: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  image: string;
}

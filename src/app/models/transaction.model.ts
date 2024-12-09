export interface Transaction {
  id: number;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
}

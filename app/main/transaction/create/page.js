import TransactionForm from "@/components/TransactionForm";
import { getUserAccounts } from "@/actions/user";
// NOTE: You will also create a categories data file later

export default async function CreateTransactionPage() {
  // Fetch data needed for the form (accounts, categories)
  const { data: accounts } = await getUserAccounts(); 
  const categories = []; // Placeholder for category data file

  return (
    <div className="py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">New Transaction</h1>
        <TransactionForm accounts={accounts} categories={categories} />
    </div>
  );
}
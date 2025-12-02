"use client";
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { toast } from 'sonner';

export default function AccountCard({ account }) {
  // NOTE: In the final app, this function would call a Server Action 
  // to update the account's isDefault status in the database.
  const handleDefaultChange = () => {
    if (account.isDefault) {
      return toast.error("You must have at least one default account.");
    }
    // Placeholder for the actual DB update function
    toast.info(`Setting ${account.name} as default... (Requires final API)`);
  };

  // Format the balance and ensure the type is capitalized
  const formattedBalance = account.balance ? parseFloat(account.balance).toFixed(2) : '0.00';
  const capitalizedType = account.type.charAt(0) + account.type.slice(1).toLowerCase();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-base font-medium capitalize">{account.name}</h3>

        <div className="flex items-center space-x-2">
          <Switch
            checked={account.isDefault}
            onCheckedChange={handleDefaultChange} // Placeholder for update logic
            aria-label="Set as default account"
          />
          {/* Dropdown Menu for Edit/Delete will go here */}
          <MoreHorizontal className="h-4 w-4 text-gray-400 cursor-pointer" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold mt-1">${formattedBalance}</div>
        <p className="text-xs text-gray-500 mt-1">{capitalizedType} Account</p>

        {/* Link to the detailed account page (Dynamic route will be built later) */}
        <Link href={`/accounts/${account.id}`} className="text-sm text-blue-500 hover:underline mt-2 inline-block">
          View Details
        </Link>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-gray-500 pt-3">
        <div className="flex items-center space-x-1">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          <span>Income/Expense</span>
        </div>
        <span>{account._count?.transactions || 0} transactions</span>
      </CardFooter>
    </Card>
  );
}
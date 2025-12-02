import { getUserAccounts } from "@/actions/user";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import AccountCard from "@/components/AccountCard"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; 
import { redirect } from "next/navigation"; // To handle unauthorized errors

// This component fetches the data required for the dashboard
export default async function Dashboard() {
  // 1. Fetch accounts using the server action
  const { data: accounts, error } = await getUserAccounts(); 

  // Handle unauthorized access gracefully (though layout.js should catch this)
  if (error && error === "Unauthorized") {
      redirect("/sign-in");
  }

  // Use the fetched list or an empty array for robust rendering
  const accountList = accounts || []; 

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Account Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 2. Map through and display existing accounts */}
        {accountList.map((account) => ( 
          <AccountCard key={account.id} account={account} /> 
        ))}

        {/* 3. The Add New Account Button/Card */}
        <CreateAccountDrawer>
          {/* This is the visual trigger for the drawer */}
          <Card className="flex flex-col items-center justify-center h-48 border-2 border-dashed hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="text-center p-6">
              <p className="text-lg font-medium text-gray-500">Add New Account</p>
              <Plus className="mt-2 text-3xl font-light h-8 w-8 text-gray-500" />
            </CardContent>
          </Card>
        </CreateAccountDrawer>
      </div>
    </div>
  );
}
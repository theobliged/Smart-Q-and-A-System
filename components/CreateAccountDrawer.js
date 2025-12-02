"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // Import z from zod
import { accountSchema } from '@/lib/schema'; // Assuming you named your schema file correctly
import { createAccount } from '@/actions/user'; // Import the Server Action

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // Assuming Switch is installed
import { toast } from 'sonner'; // Assuming you installed sonner for toasts

export default function CreateAccountDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "", type: "CURRENT", balance: "", isDefault: false },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Call the Server Action
      const result = await createAccount(data); 
      
      if (result.success) {
        toast.success("Account created successfully!");
        setIsOpen(false); // Close drawer
        form.reset();      // Clear the form
      }
    } catch (error) {
      // Display the error message from the Server Action
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
          
          {/* Account Name */}
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input id="name" {...form.register("name")} placeholder="Main Checking Account" className="mt-1" />
            {form.formState.errors.name && (<p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>)}
          </div>

          {/* Account Type (Select) */}
          <div>
            <Label htmlFor="type">Account Type</Label>
            <Select onValueChange={(value) => form.setValue('type', value)} defaultValue={form.watch('type')}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CURRENT">Current</SelectItem>
                <SelectItem value="SAVINGS">Savings</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (<p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>)}
          </div>

          {/* Initial Balance */}
          <div>
            <Label htmlFor="balance">Initial Balance</Label>
            <Input id="balance" type="number" step="0.01" {...form.register("balance")} placeholder="0.00" className="mt-1" />
            {form.formState.errors.balance && (<p className="text-red-500 text-sm mt-1">{form.formState.errors.balance.message}</p>)}
          </div>

          {/* Set as Default (Switch) */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="isDefault">Set as Default</Label>
            <Switch
              id="isDefault"
              checked={form.watch('isDefault')}
              onCheckedChange={(checked) => form.setValue('isDefault', checked)}
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1">Cancel</Button>
            </DrawerClose>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
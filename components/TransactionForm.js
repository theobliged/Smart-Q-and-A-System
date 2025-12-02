"use client";
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '@/lib/schema';
import { createTransaction } from '@/actions/transaction'; 
import { incomeCategories, expenseCategories } from '@/data/categories'; // Import categories data
import ReceiptScanner from '@/components/ReceiptScanner'; // <-- NEW IMPORT: Scanner Component
import { format } from "date-fns";
import { toast } from 'sonner';

// UI Imports (Ensure these components are installed with shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; 
import { CalendarIcon, Repeat } from 'lucide-react'; 

export default function TransactionForm({ accounts, initialData = {} }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: initialData.type || "EXPENSE",
            accountId: initialData.accountId || accounts?.[0]?.id || "",
            isRecurring: initialData.isRecurring || false,
            date: initialData.date ? new Date(initialData.date) : new Date(),
            amount: initialData.amount ? String(initialData.amount) : "",
            category: initialData.category || "",
            description: initialData.description || "",
        },
    });

    const watchType = form.watch("type");
    const watchIsRecurring = form.watch("isRecurring");

    const filteredCategories = useMemo(() => {
        return watchType === "INCOME" ? incomeCategories : expenseCategories;
    }, [watchType]);

    // Function to handle data received from the AI scanner
    const handleScanComplete = (scannedData) => {
        // Use RHF setValue to populate fields with AI data
        form.setValue('amount', scannedData.amount ? String(scannedData.amount) : '', { shouldValidate: true });
        // NOTE: Date needs conversion from YYYY-MM-DD string to Date object
        if (scannedData.date) {
            form.setValue('date', new Date(scannedData.date), { shouldValidate: true });
        }
        form.setValue('description', scannedData.description || '');
        form.setValue('category', scannedData.category || '');
        toast.info("Form fields updated with AI data.");
    };


    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Ensure Date object is sent to the server as an ISO string
            const dataToSend = { ...data, date: data.date.toISOString() };
            await createTransaction(dataToSend);
            
            toast.success("Transaction submitted successfully!");
        } catch (error) {
            toast.error(`Transaction Failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            
            {/* AI RECEIPT SCANNER (Integration Point) */}
            <ReceiptScanner onScanComplete={handleScanComplete} />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {/* ROW 1: Type & Account */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Transaction Type (Select) */}
                    <div className="space-y-1">
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={(value) => form.setValue('type', value)} defaultValue={watchType}>
                            <SelectTrigger> <SelectValue placeholder="Type" /> </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                <SelectItem value="INCOME">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Account Select */}
                    <div className="space-y-1">
                        <Label htmlFor="accountId">Account</Label>
                        <Select onValueChange={(value) => form.setValue('accountId', value)} defaultValue={form.watch('accountId')}>
                            <SelectTrigger> <SelectValue placeholder="Select account" /> </SelectTrigger>
                            <SelectContent>
                                {accounts?.map(acc => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.name} (${parseFloat(acc.balance).toFixed(2)})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.accountId && <p className="text-red-500 text-sm">{form.formState.errors.accountId.message}</p>}
                    </div>
                </div>

                {/* ROW 2: Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Amount Input */}
                    <div className="space-y-1">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input id="amount" type="number" step="0.01" {...form.register("amount")} placeholder="0.00" />
                        {form.formState.errors.amount && <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>}
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-1">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch("date") ? format(form.watch("date"), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={form.watch("date")}
                                    onSelect={(date) => form.setValue("date", date, { shouldValidate: true })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {form.formState.errors.date && <p className="text-red-500 text-sm">{form.formState.errors.date.message}</p>}
                    </div>
                </div>

                {/* ROW 3: Category & Description */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Category Select */}
                    <div className="space-y-1">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => form.setValue('category', value)}>
                            <SelectTrigger> <SelectValue placeholder="Select Category" /> </SelectTrigger>
                            <SelectContent>
                                {filteredCategories.map(cat => (
                                    <SelectItem key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.category && <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>}
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-1">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input id="description" {...form.register("description")} placeholder="e.g., Dinner at Italian Place" />
                    </div>
                </div>

                {/* ROW 4: Recurring Switch & Interval */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Repeat className="w-5 h-5 text-blue-500" />
                        <Label>Recurring Transaction</Label>
                    </div>
                    <Switch
                        checked={watchIsRecurring}
                        onCheckedChange={(checked) => form.setValue("isRecurring", checked)}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Conditional: Recurring Interval */}
                {watchIsRecurring && (
                    <div className="space-y-1">
                        <Label htmlFor="recurringInterval">Recurring Interval</Label>
                        <Select onValueChange={(value) => form.setValue('recurringInterval', value)} disabled={isSubmitting}>
                            <SelectTrigger> <SelectValue placeholder="Select Interval" /> </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.recurringInterval && <p className="text-red-500 text-sm">{form.formState.errors.recurringInterval.message}</p>}
                    </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
                    {isSubmitting ? 'Creating...' : 'Create Transaction'}
                </Button>
            </form>
        </div>
    );
}
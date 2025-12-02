import { z } from "zod";

// --- EXISTING CODE (Account Schema) ---
const AccountTypeEnum = z.enum(["CURRENT", "SAVINGS"]);

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required."),
  type: AccountTypeEnum,
  balance: z.string().min(1, "Initial balance is required."),
  isDefault: z.boolean().default(false).optional(),
});
// ---------------------------------------


// --- NEW CODE (Transaction Schema) ---
const TransactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);
const RecurringIntervalEnum = z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);

export const transactionSchema = z.object({
  type: TransactionTypeEnum,
  amount: z.string().min(1, "Amount is required."),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required." }), // Note: Zod date expects a Date object
  accountId: z.string().min(1, "Account is required."),
  category: z.string().min(1, "Category is required."),
  isRecurring: z.boolean().default(false).optional(),
  recurringInterval: RecurringIntervalEnum.optional(),

}).superRefine((data, ctx) => {
    // Custom Validation: Recurring interval is required if 'isRecurring' is checked.
    if (data.isRecurring && !data.recurringInterval) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring interval is required for recurring transactions.",
            path: ["recurringInterval"],
        });
    }
});
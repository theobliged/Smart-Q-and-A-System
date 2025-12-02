// Note: Use simple names for now. You can add colors and icons later.

export const incomeCategories = [
  { name: "Salary", type: "INCOME" },
  { name: "Freelance", type: "INCOME" },
  { name: "Investment", type: "INCOME" },
  { name: "Gifts", type: "INCOME" },
];

export const expenseCategories = [
  { name: "Groceries", type: "EXPENSE" },
  { name: "Housing", type: "EXPENSE" },
  { name: "Travel", type: "EXPENSE" },
  { name: "Entertainment", type: "EXPENSE" },
  { name: "Utilities", type: "EXPENSE" },
  { name: "Health", type: "EXPENSE" },
  { name: "Shopping", type: "EXPENSE" },
  { name: "Other", type: "EXPENSE" },
];

export const ALL_CATEGORIES = [...incomeCategories, ...expenseCategories];

// Helper to map category names to colors (for later charts/display)
export const CATEGORY_COLORS = ALL_CATEGORIES.reduce((acc, category) => {
    // Placeholder colors
    acc[category.name] = category.type === 'INCOME' ? 'hsl(142, 70.6%, 45.3%)' : 'hsl(0, 72.2%, 50.6%)'; 
    return acc;
}, {});
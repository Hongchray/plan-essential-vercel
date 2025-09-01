"use client";
import { useState } from "react";

export default function TabExpense({
  expenses,
  setExpenses,
}: {
  expenses: any[];
  setExpenses: (expenses: any[]) => void;
}) {
  // Expense Component
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
  });
  const categories = [
    "Venue",
    "Catering",
    "Photography",
    "Flowers",
    "Music",
    "Other",
  ];

  const addExpense = () => {
    if (
      newExpense.category &&
      newExpense.description &&
      newExpense.amount &&
      newExpense.date
    ) {
      setExpenses([
        ...expenses,
        {
          id: expenses.length + 1,
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          paid: false,
        },
      ]);
      setNewExpense({ category: "", description: "", amount: "", date: "" });
    }
  };

  const removeExpense = (id: any) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const togglePaid = (id: any) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, paid: !expense.paid } : expense
      )
    );
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const paidExpenses = expenses
    .filter((e) => e.paid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Expenses</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            ${totalExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-blue-800">Total Budget</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${paidExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-green-800">Paid</div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-3">Add New Expense</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount ($)"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addExpense}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Expense
        </button>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-start justify-between p-4 border border-slate-200 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{expense.description}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {expense.category}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                ${expense.amount.toFixed(2)} •{" "}
                {new Date(expense.date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => togglePaid(expense.id)}
                className={`px-3 py-1 text-xs rounded-full ${
                  expense.paid
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {expense.paid ? "Paid" : "Unpaid"}
              </button>
              <button
                onClick={() => removeExpense(expense.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

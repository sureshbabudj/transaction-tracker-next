import React, { useState } from "react";
import { CommonTransaction } from "../utils/parseCSV";
import { correctTransactions, updateTransactions } from "../utils/actions";

interface CategorizeTransactionProps {
  transaction: CommonTransaction;
  onCategorize: (results: CommonTransaction[]) => void;
  categories: string[];
}

function CategorizeTransaction({
  transaction,
  onCategorize,
  categories,
}: CategorizeTransactionProps): JSX.Element {
  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [filteredCategories, setFilteredCategories] =
    useState<string[]>(categories);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleCategorize = async () => {
    if (!category) return;

    // Update the category in the database
    const results = await updateTransactions(transaction, category, keyword);

    if (!results?.length) return;

    onCategorize(results);

    // Clear the input fields
    setCategory("");
    setKeyword("");
  };

  const correctIt = async () => {
    await correctTransactions();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory(value);
    setFilteredCategories(
      categories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleCategorySelect = (category: string) => {
    setCategory(category);
    setFilteredCategories([]);
    setIsFocused(false);
  };

  return (
    <div className="p-4 border-b">
      <p>
        <strong>Date:</strong> {transaction.date} <br />
        <strong>Desc:</strong> {transaction.description} <br />{" "}
        <strong>Amt:</strong> {transaction.amount}
      </p>
      <div className="relative">
        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder="Enter or select category"
          className="border p-2 w-full"
        />
        {isFocused && filteredCategories.length > 0 && (
          <ul
            className="absolute border bg-white w-full max-h-40 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()} // Prevents the input from losing focus
          >
            {filteredCategories.map((cat, index) => (
              <li
                key={index}
                onMouseDown={() => handleCategorySelect(cat)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword to match other transactions"
        className="border p-2 w-full mt-2"
      />
      <button
        onClick={handleCategorize}
        className="ml-2 p-2 bg-blue-500 text-white mt-2"
      >
        Categorize
      </button>

      <button
        onClick={correctIt}
        className="ml-2 p-2 bg-blue-500 text-white mt-2"
      >
        Correct
      </button>
    </div>
  );
}

export default CategorizeTransaction;

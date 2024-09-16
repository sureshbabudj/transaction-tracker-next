const fs = require("fs");
const path = require("path");

const expnses = [
  "Cash withdrawal",
  "Rent",
  "Mobile recharge",
  "KFC",
  "McDonald",
  "Netflix",
  "Amazon",
  "Uber",
  "Lyft",
  "Paypal",
  "Aldi",
  "Lidl",
  "Walmart",
  "Target",
  "Best Buy",
  "Starbucks",
  "McDonald",
  "Netflix",
  "Amazon",
  "Uber",
  "Lyft",
  "Paypal",
  "Aldi",
  "Lidl",
  "Walmart",
  "Target",
  "Best Buy",
  "Starbucks",
  "Home loan repayment",
  "Car loan repayment",
  "Credit card repayment",
  "American Bank charges",
  "Visa Bank charges",
  "Mastercard Bank charges",
  "Revolt Bank charges",
  "Bus fare",
  "Flight charges",
  "Hotel charges",
  "mortgage",
  "Property Tax",
  "To Mom",
];

const credits = [
  "salary",
  "Reimbursements",
  "Bonus",
  "Gift",
  "Savings Interest",
  "lottery winnings",
  "tax returns",
  "Profit from investments",
];

const amountFigures = [10, 100, 1000, 10000, 100000];

function getDescription(isExpense) {
  if (isExpense) {
    return expnses[Math.floor(Math.random() * expnses.length)];
  } else {
    return credits[Math.floor(Math.random() * credits.length)];
  }
}

const ids = [];
function getUniqueRandomId() {
  const id = Math.random().toString(36).substring(7);
  if (ids.includes(id)) {
    return getUniqueRandomId();
  } else {
    ids.push(id);
    return id;
  }
}

function getRandomDate() {
  const randomDate = new Date(
    new Date() - 1000 * 60 * 60 * 24 * (Math.floor(Math.random() * 30) + 1)
  );

  const bankingDateFormat = randomDate.toISOString().split("T")[0];
  return bankingDateFormat;
}

function getRandomAmount(isExpense) {
  let amount = Math.random() * amountFigures[Math.floor(Math.random() * 5)];
  amount = isExpense ? amount * -1 : amount;
  return amount;
}

function createTransaction() {
  const isExpense = Math.random() > 0.15;

  return {
    id: getUniqueRandomId(),
    amount: getRandomAmount(isExpense),
    date: getRandomDate(),
    description: getDescription(isExpense),
    currency: "USD",
  };
}

function createTransactions(count) {
  return Array.from({ length: count }).map(createTransaction);
}

function writeCsv(count = 500) {
  const transactions = createTransactions(count);
  const headers = "id,date,amount,description,currency";
  const csv = transactions
    .map(
      (transaction) =>
        `${transaction.id},${transaction.date},${transaction.amount},${transaction.description},${transaction.currency}`
    )
    .join("\n");

  const filePath = path.join(__dirname, "transactions.csv");
  fs.writeFileSync(filePath, `${headers}\n${csv}`, "utf8");
  console.log(`CSV file has been written to ${filePath}`);
}

writeCsv(100);

import Summary from "./components/SummaryPage";
import { getTransactions } from "./utils/actions";

export default async function Home() {
  const result = await getTransactions();
  return (
    <div className="main">
      <Summary transactions={result} />
    </div>
  );
}

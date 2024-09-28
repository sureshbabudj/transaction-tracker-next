import { fetchInitialState } from "@/lib/actions";
import { Main } from "../components/Main";
import TaxCalculator from "./TaxCalculator";

export default async function Page() {
  const state = await fetchInitialState("/dashboard/calculate-tax");
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <h1>German Tax Calculator with Deductions</h1>
      <TaxCalculator />
    </Main>
  );
}

import { fetchInitialState } from "@/lib/actions";
import { Main } from "../components/Main";
import CaluculateTax from "./CaluculateTax";

export default async function Page() {
  const state = await fetchInitialState("/dashboard/calculate-tax");
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <CaluculateTax />
    </Main>
  );
}

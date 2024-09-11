import { fetchInitialState } from "@/lib/actions";
import { Main } from "../components/Main";
import { DatabaseActions } from "./DatabaseActions";

export default async function Page() {
  const state = await fetchInitialState("/dashboard/analytics");
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <h1>Analytics</h1>
      <DatabaseActions />
    </Main>
  );
}

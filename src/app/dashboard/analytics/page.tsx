import { Main } from "../components/Main";
import { fetchInitialState } from "@/app/utils/actions";
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

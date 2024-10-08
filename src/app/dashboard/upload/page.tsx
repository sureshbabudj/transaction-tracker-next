import { fetchInitialState } from "@/lib/actions";
import { Main } from "../components/Main";
import { UploadPageTabs } from "./PageTabs";

export default async function UploadPage() {
  const state = await fetchInitialState("/dashboard/upload");
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <UploadPageTabs />
    </Main>
  );
}

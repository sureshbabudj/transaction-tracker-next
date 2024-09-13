import { Transactions } from "../components/Transactions";
import { Main } from "../components/Main";
import { fetchInitialState, getCategories } from "@/lib/actions";
import { getSearchParam, SearchParam } from "@/lib/utils";

interface PageProps {
  searchParams: { [key: string]: SearchParam };
}

export default async function Page({ searchParams }: PageProps) {
  const state = await fetchInitialState("/dashboard/transactions");
  const categories = await getCategories();
  const category = getSearchParam(searchParams.category);
  const page = getSearchParam(searchParams.page);
  const pageSize = getSearchParam(searchParams.pageSize);
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <Transactions
        categories={categories}
        category={category}
        page={page ? parseInt(page, 10) : undefined}
        pageSize={pageSize ? parseInt(pageSize, 10) : undefined}
      />
    </Main>
  );
}

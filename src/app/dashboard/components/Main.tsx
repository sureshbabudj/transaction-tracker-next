import { TooltipProvider } from "@/components/ui/tooltip";
import { AsideNav } from "./AsideNav";
import { Header } from "./Header";
import { BreadcrumbType } from "./BreadCrumbs";
import { AsideLink } from "@/data/data";

export function Main({
  children,
  breadcrumbs,
  links,
}: {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbType[];
  links: AsideLink[];
}) {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AsideNav links={links} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header breadcrumbs={breadcrumbs} />
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

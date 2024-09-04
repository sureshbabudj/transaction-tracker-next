import Link from "next/link";

interface Tab {
  label: string;
  href: string;
  active?: boolean;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({tabs}: TabsProps) {
  const activeClassNames = "w-full flex justify-center font-medium px-5 py-2 border-t border-b bg-gray-900 text-white  border-gray-900 hover:bg-gray-800";
  const normalClassNames = "w-full flex justify-center font-medium rounded-l px-5 py-2 border bg-white text-gray-800 border-gray-200 hover:bg-gray-100";
  return (
    <div className="flex w-full md:max-w-xl mx-4 rounded shadow">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={tab.active ? activeClassNames : normalClassNames}
        >
          {tab.label}
        </Link>
      ))}
   </div>
  );
}
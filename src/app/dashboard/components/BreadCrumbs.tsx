"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

export interface BreadcrumbType {
  label: string;
  path: string;
}

export interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbType[];
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={`item-${breadcrumb.label}-${index}`}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                {index < breadcrumbs.length - 1 ? (
                  <Link href={breadcrumb.path}>{breadcrumb.label}</Link>
                ) : (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

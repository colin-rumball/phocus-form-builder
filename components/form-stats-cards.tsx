"use client";

import { api } from "@/convex/_generated/api";
import { Doc, type Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";

type FormStatsCardsProps = ComponentPropsWithoutRef<"div"> & {
  form: Doc<"forms">;
};

const FormStatsCards = ({ className, form }: FormStatsCardsProps) => {
  // const form = useQuery(api.forms.get, { id: formId });

  if (form === undefined)
    return (
      // TODO: loading skeleton for stats cards
      <>Loading stats cards</>
    );

  if (form === null) {
    console.log("form null");
    return null;
    // throw new Error(`Form ${formId} not found`);
  }

  const { visits, submissions } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <div
      className={cn(
        "container grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      <StatsCard
        title="Total visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        value={visits.toLocaleString() || ""}
        loading={false}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={submissions.toLocaleString() || ""}
        loading={false}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Submission rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visits that result in form submission"
        value={submissionRate.toLocaleString() + "%" || ""}
        loading={false}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leaves without interacting"
        value={bounceRate.toLocaleString() + "%" || ""}
        loading={false}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
};

export default FormStatsCards;

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs pt-1 text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  );
}

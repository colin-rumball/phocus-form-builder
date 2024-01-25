"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Suspense, type ComponentPropsWithoutRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type FormStatsProps = ComponentPropsWithoutRef<"div">;

export default function FormStats({ className }: FormStatsProps) {
  return (
    <div className={cn("", className)}>
      <Suspense fallback={<StatsCards loading={true} />}>
        <StatsCardsWrapper />
      </Suspense>
    </div>
  );
}

const StatsCardsWrapper = () => {
  const stats = useQuery(api.forms.stats);
  return <StatsCards loading={stats === undefined} stats={stats} />;
};

type StatsCardsProps = {
  stats?: typeof api.forms.stats._returnType;
  loading: boolean;
};

const StatsCards = ({ stats, loading }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-xl md:grid-cols-4">
      <StatsCard
        title="Visits"
        loading={loading}
        value={stats?.visits.toLocaleString()}
      />
      <StatsCard
        title="Submission"
        loading={loading}
        value={stats?.submissions.toLocaleString()}
      />
      <StatsCard
        title="Submission Rate"
        loading={loading}
        value={stats?.submissionRate.toLocaleString() + "%"}
      />
      <StatsCard
        title="Bounce Rate"
        loading={loading}
        value={stats?.bounceRate.toLocaleString() + "%"}
      />
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  className,
  loading,
}: {
  title: string;
  value?: string;
  className?: string;
  loading?: boolean;
}) => {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="absolute inset-0" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
};

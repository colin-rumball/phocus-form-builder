"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "./ui/button";
import CreateFormButton from "./create-form-button";
import { Badge } from "./ui/badge";
import { formatDistance } from "date-fns";

const FormCardList = () => {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <FormCards />
    </div>
  );
};

export default FormCardList;

const FormCards = () => {
  const forms = useQuery(api.forms.list);

  if (forms === undefined) {
    return (
      <>
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
      </>
    );
  }

  if (forms === null) {
    return <>something went wrong</>;
  }

  return (
    <>
      <CreateFormButton />
      {forms.map((form) => (
        <FormCard key={form._id} {...form} />
      ))}
    </>
  );
};

const FormCardSkeleton = () => {
  return <Skeleton className="border-primary/20 h-[190px] border-2" />;
};

const FormCard = ({
  name,
  description,
  published,
  _creationTime,
}: {
  name: string;
  description: string;
  published: boolean;
  _creationTime: number;
}) => {
  return (
    <Button className="border-primary/20 group flex h-[190px] flex-col items-center justify-center border">
      <div>{name}</div>
      <div>{description}</div>
      {formatDistance(_creationTime, Date.now(), { addSuffix: true })}
      <Badge variant={published ? "default" : "secondary"}>
        {published ? "published" : "draft"}
      </Badge>
    </Button>
  );
};

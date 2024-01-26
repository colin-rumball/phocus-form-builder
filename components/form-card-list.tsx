"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "./ui/button";
import CreateFormButton from "./create-form-button";
import { Badge } from "./ui/badge";
import { formatDistance } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LuView } from "react-icons/lu";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { Link } from "./ui/link";
import { BiRightArrowAlt } from "react-icons/bi";
import {} from "react-icons/fa";

const FormCardList = () => {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
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
  return <Skeleton className="h-[190px] border-2 border-primary/20" />;
};

const FormCard = ({
  name,
  description,
  published,
  visits,
  submissions,
  _id,
  _creationTime,
}: {
  name: string;
  description: string;
  published: boolean;
  visits: number;
  submissions: number;
  _id: string;
  _creationTime: number;
}) => {
  return (
    <Card className="h-[190px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate font-bold">{name}</span>
          {published && <Badge variant={"default"}>published</Badge>}
          {!published && <Badge variant={"destructive"}>draft</Badge>}
        </CardTitle>
        <CardDescription className="flex flex-col">
          <span className="">
            {formatDistance(_creationTime, Date.now(), { addSuffix: true })}
          </span>
          {published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span className="">{visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span className="">{submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate">
        {description ? description : "No description"}
      </CardContent>
      <CardFooter>
        {published && (
          <Button asChild className="mt-2 w-full gap-4">
            <Link href={`/forms/${_id}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!published && (
          <Button variant={"secondary"} asChild className="mt-2 w-full gap-4">
            <Link href={`/builder/${_id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

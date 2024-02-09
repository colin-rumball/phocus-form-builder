"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
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
import { FaEdit, FaWpforms } from "react-icons/fa";
import { Link } from "./ui/link";
import { BiRightArrowAlt } from "react-icons/bi";
import {} from "react-icons/fa";
import Headline from "./ui/headline";
import Section from "./ui/section";
import { Separator } from "./ui/separator";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { type Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { LuView } from "react-icons/lu";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const FormCardList = () => {
  return (
    <div className="py-xl">
      <FormCards />
    </div>
  );
};

export default FormCardList;

const FormCards = () => {
  const forms = useQuery(api.forms.list);

  if (!forms) {
    return (
      <Section className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
      </Section>
    );
  }

  return (
    <>
      <Section>
        <Headline as="h2" className="mt-xl">
          Published
        </Headline>
        <Separator className="mb-lg" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {forms
            .filter((f) => f.published)
            .map((form) => (
              <FormCard key={form._id} {...form} />
            ))}
        </div>
      </Section>
      <Section className="mt-xl">
        <Headline as="h2" className="mt-xl">
          Drafts
        </Headline>
        <Separator className="mb-lg" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
          <CreateFormButton />
          {forms
            .filter((f) => !f.published)
            .map((form) => (
              <FormCard key={form._id} {...form} />
            ))}
        </div>
      </Section>
    </>
  );
};

const FormCardSkeleton = () => {
  return <Skeleton className="h-[190px] border-2 border-primary/20" />;
};

const FormCard = ({
  name,
  published,
  visits,
  submissions,
  content,
  _id,
  _creationTime,
  updatedAt,
}: {
  name: string;
  published: boolean;
  visits: number;
  submissions: number;
  content: string;
  _id: string;
  _creationTime: number;
  updatedAt?: number;
}) => {
  const [nameInput, setNameInput] = useState(name);
  const createForm = useMutation(api.forms.create);
  const deleteForm = useMutation(api.forms.deleteForm);
  const updateForm = useMutation(api.forms.update);

  const onDuplicateClicked = async () => {
    const formId = await createForm({
      name: `${name} (copy)`,
    });

    if (!formId) {
      console.error("Failed to duplicate form");
      return;
    }

    await updateForm({
      id: formId,
      data: {
        content: content,
        published: false,
      },
    });
  };

  const onDeleteClicked = async () => {
    await deleteForm({ id: _id as Id<"forms"> });
  };

  const onNameChanged = async (newName: string) => {
    if (newName === "") setNameInput(name);
    if (newName === name) return;

    await updateForm({ id: _id as Id<"forms">, data: { name: newName } });
  };

  return (
    <Card className="flex h-[210px] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => onNameChanged(nameInput)}
            className="ml-0 mr-5 h-6 truncate rounded-none border-none bg-card px-0 py-0 text-lg focus-visible:ring-foreground"
          />
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDotsVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={onDuplicateClicked}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
                >
                  <AlertDialogTrigger className="w-full">
                    Delete form
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  form <strong>{name}</strong> and remove all the form
                  submissions from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteClicked}>
                  Delete form
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span className="">
            Created{" "}
            {formatDistance(_creationTime, Date.now(), { addSuffix: true })}
          </span>
          {published && (
            <span className="grid grid-cols-2 items-center gap-x-1">
              <LuView className="text-muted-foreground" />
              <span className="">{visits.toLocaleString()}</span>

              <FaWpforms className="text-muted-foreground" />
              <span className="">{submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col items-center justify-end">
        {published && (
          <Button asChild className="mt-2 w-full gap-4">
            <Link href={`/form/${_id}`}>
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
      </CardContent>
    </Card>
  );
};

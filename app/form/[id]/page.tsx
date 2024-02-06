import {
  type ElementsType,
  type FormElementInstance,
} from "@/components/form-elements";
import FormShareButton from "@/components/form-share-btn";
import FormStatsCards from "@/components/form-stats-cards";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Headline from "@/components/ui/headline";
import Page from "@/components/ui/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VisitBtn from "@/components/visit-btn";
import { api } from "@/convex/_generated/api";
import { type Doc, type Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";
import { format, formatDistance } from "date-fns";
import { type ReactNode } from "react";

export default async function FormPage({ params }: { params: { id: string } }) {
  const token = await getAuthToken();
  const form = await fetchQuery(
    api.forms.get,
    {
      id: params.id as Id<"forms">,
    },
    { token },
  );

  if (form === null) {
    throw new Error("Form not found");
  }

  const submissions = await fetchQuery(
    api.submissions.list,
    { formId: params.id as Id<"forms"> },
    { token },
  );

  if (submissions === null) {
    throw new Error("Submissions not found");
  }

  return (
    <Page className="gap-xl">
      <div className="border-y border-muted py-10">
        <div className="container flex justify-between">
          <Headline as="h2">{form?.name}</Headline>
          <VisitBtn formId={params.id} />
        </div>
      </div>
      <div className="border-b border-muted py-4">
        <div className="container flex items-center justify-between gap-2">
          <FormShareButton formId={params.id} />
        </div>
      </div>
      <FormStatsCards form={form} />

      <SubmissionsTable form={form} submissions={submissions} />
    </Page>
  );
}

async function SubmissionsTable({
  form,
  submissions,
}: {
  form: Doc<"forms">;
  submissions: Doc<"submissions">[];
}) {
  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label as string,
          required: element.extraAttributes?.required as boolean,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  type Row = Record<string, string | Date> & {
    submittedAt: Date;
  };

  const rows: Row[] = [];
  submissions.forEach((submission) => {
    const content = JSON.parse(submission.content) as Record<string, string>;

    rows.push({
      ...content,
      submittedAt: new Date(submission._creationTime),
    });
  });

  return (
    <>
      <h1 className="text-2xl my-4 font-bold">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right uppercase text-muted-foreground">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id] as string}
                  />
                ))}
                <TableCell className="text-right text-muted-foreground">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}

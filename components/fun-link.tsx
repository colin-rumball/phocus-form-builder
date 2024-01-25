import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
};

const FunLink = ({ href, children }: Props) => {
  return (
    <a
      className={cn(
        "rounded px-4 py-2 font-bold no-underline transition-[background-size_0.3s]",
        "bg-gradient-to-r from-blue-500 to-green-500 bg-[length:0%_3px] bg-[left_1.7em] bg-no-repeat",
        "hover:bg-[length:100%_3px]",
      )}
      href={href}
    >
      {children}
    </a>
  );
};

export default FunLink;

import ConvexProvider from "./convex-provider";
import { ThemeProvider } from "./theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProvider>{children}</ConvexProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default Providers;

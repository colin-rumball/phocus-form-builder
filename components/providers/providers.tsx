import { DesignerContextProvider } from "../contexts/designer-context";
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
      <ClerkProvider publishableKey="pk_test_ZGlzY3JldGUtZ29sZGZpc2gtNjcuY2xlcmsuYWNjb3VudHMuZGV2JA">
        <ConvexProvider>
          <DesignerContextProvider>{children}</DesignerContextProvider>
        </ConvexProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default Providers;

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/layout/queryClient";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

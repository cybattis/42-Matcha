import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {ThemeProvider} from "next-themes";
import {StrictMode} from "react";
import {RouterProvider, createRouter} from "@tanstack/react-router";
import {createRoot} from "react-dom/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {routeTree} from "./routeTree.gen";
import {AuthProvider, useAuth} from "@/auth.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import axios from "axios";

const queryClient = new QueryClient();

axios.defaults.baseURL = "http://localhost:5163";

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultPreload: "intent",
  // // Since we're using React Query, we don't want loader calls to ever be stale
  // // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 30000,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{auth}}/>;
}

function App() {
  
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <InnerApp/>
            <Toaster/>
          </ThemeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App/>
    </StrictMode>
  );
}

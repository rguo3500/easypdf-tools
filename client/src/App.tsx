import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";
import NotFound from "@/pages/NotFound";
import { toolRouteRegistry } from "@shared/toolRoutes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {toolRouteRegistry.map(route => <Route key={route.path} path={route.path}><ToolPage tool={route.tool} /></Route>)}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

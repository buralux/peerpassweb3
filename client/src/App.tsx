import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppContainer from "@/components/AppContainer";
import HomePage from "@/pages/home";
import CardsPage from "@/pages/cards";
import CreatePage from "@/pages/create";
import ScanPage from "@/pages/scan";
import ProfilePage from "@/pages/profile";
import CardDetailsPage from "@/pages/card-details";
import SharePage from "@/pages/share";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/cards" component={CardsPage} />
      <Route path="/create" component={CreatePage} />
      <Route path="/scan" component={ScanPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/card/:id" component={CardDetailsPage} />
      <Route path="/share/:id" component={SharePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <AppContainer>
        <Router />
      </AppContainer>
    </TooltipProvider>
  );
}

export default App;

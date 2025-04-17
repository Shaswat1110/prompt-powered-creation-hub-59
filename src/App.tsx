
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Trends from "@/pages/Trends";
import Savings from "@/pages/Savings";
import Import from "@/pages/Import";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/transactions" element={
            <MainLayout>
              <Transactions />
            </MainLayout>
          } />
          <Route path="/trends" element={
            <MainLayout>
              <Trends />
            </MainLayout>
          } />
          <Route path="/savings" element={
            <MainLayout>
              <Savings />
            </MainLayout>
          } />
          <Route path="/import" element={
            <MainLayout>
              <Import />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

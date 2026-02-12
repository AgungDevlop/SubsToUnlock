import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import TermsAndConditions from "./pages/TermsAndConditions";
import { PageLink } from "./pages/PageLink";
import { GetLink } from "./pages/GetLink";

interface ErrorFallbackProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({error}) => {
  const routeError = useRouteError() as Error | undefined;
  const displayError = error || routeError;

  return (
    <div className="text-center text-red-500 p-4 min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
      <p className="mb-2">
        {displayError?.message || "Maaf, terjadi kesalahan yang tidak terduga."}
      </p>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.reload()}
      >
        Muat Ulang Halaman
      </button>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <Home /> },
      { path: ":key", element: <PageLink /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "contact", element: <Contact /> },
      { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "getlink", element: <GetLink /> },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary
        fallback={<ErrorFallback />}
        onError={(error: Error, errorInfo: React.ErrorInfo) => {
          console.error("Error caught by ErrorBoundary:", error, errorInfo);
        }}
      >
        <RouterProvider router={router} />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
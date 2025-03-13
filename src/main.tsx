import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import TermsAndConditions from "./pages/TermsAndConditions";
import { PageLink } from "./pages/PageLink";

// Tipe untuk ErrorFallbackProps
interface ErrorFallbackProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

// Komponen ErrorFallback
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo }) => {
  const routeError = useRouteError() as Error | undefined;
  const displayError = error || routeError;

  return (
    <div className="text-center text-red-500 p-4 min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
      <p className="mb-2">
        {displayError?.message || "Maaf, terjadi kesalahan yang tidak terduga."}
      </p>
      {displayError && (
        <div className="text-left bg-gray-100 p-4 rounded text-black mb-4 max-w-2xl mx-auto">
          <p className="font-bold">Detail Error:</p>
          <pre className="whitespace-pre-wrap">{displayError.toString()}</pre>
          {errorInfo && (
            <>
              <p className="font-bold mt-2">Stack Trace:</p>
              <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
            </>
          )}
        </div>
      )}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.reload()}
      >
        Muat Ulang Halaman
      </button>
    </div>
  );
};

// Tipe untuk ErrorBoundaryProps
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

// Definisikan router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorFallback />, // Menangani error routing
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <ErrorFallback />,
      },
      {
        path: ":key",
        element: <PageLink />,
        errorElement: <ErrorFallback />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
        errorElement: <ErrorFallback />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
        errorElement: <ErrorFallback />,
      },
      {
        path: "contact",
        element: <Contact />,
        errorElement: <ErrorFallback />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
        errorElement: <ErrorFallback />,
      },
    ],
  },
]);

// Render aplikasi
createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error: Error, errorInfo: React.ErrorInfo) => {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
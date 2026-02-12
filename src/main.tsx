import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = React.lazy(() => import("./pages/Home"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const Contact = React.lazy(() => import("./pages/Contact"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));
const PageLink = React.lazy(() => import("./pages/PageLink").then(module => ({ default: module.PageLink })));
const GetLink = React.lazy(() => import("./pages/GetLink").then(module => ({ default: module.GetLink })));

interface ErrorFallbackProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error}) => {
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
        onClick={() => {
          window.history.replaceState({}, "", "/");
          window.location.reload();
        }}
      >
        Kembali ke Beranda
      </button>
    </div>
  );
};

const currentPath = window.location.pathname;
if (currentPath.endsWith("/index.html")) {
  const newPath = currentPath.replace(/\/index\.html$/, "") || "/";
  window.history.replaceState({}, "", newPath);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorFallback />,
    children: [
      { 
        index: true, 
        element: (
          <React.Suspense fallback={<Loading />}>
            <Home />
          </React.Suspense>
        ) 
      },
      { 
        path: "privacy-policy", 
        element: (
          <React.Suspense fallback={<Loading />}>
            <PrivacyPolicy />
          </React.Suspense>
        ) 
      },
      { 
        path: "about-us", 
        element: (
          <React.Suspense fallback={<Loading />}>
            <AboutUs />
          </React.Suspense>
        ) 
      },
      { 
        path: "contact", 
        element: (
          <React.Suspense fallback={<Loading />}>
            <Contact />
          </React.Suspense>
        ) 
      },
      { 
        path: "terms-and-conditions", 
        element: (
          <React.Suspense fallback={<Loading />}>
            <TermsAndConditions />
          </React.Suspense>
        ) 
      },
      { 
        path: "getlink", 
        element: (
          <React.Suspense fallback={<Loading />}>
            <GetLink />
          </React.Suspense>
        ) 
      },
      { 
        path: ":key", 
        element: (
          <React.Suspense fallback={<Loading />}>
            <PageLink />
          </React.Suspense>
        ) 
      },
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
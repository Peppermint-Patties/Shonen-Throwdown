import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import "@/styles/globals.css";
import Navbar from "../components/layout/navbar";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "@/store";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps, router }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <Provider store={store}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Navbar />
        <AnimatePresence node="wait">
          <Component key={router.route} {...pageProps} />
        </AnimatePresence>
      </SessionContextProvider>
    </Provider>
  );
}

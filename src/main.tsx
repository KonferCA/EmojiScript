import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Router } from "@utils";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Router />
    </StrictMode>
);


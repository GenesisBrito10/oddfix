import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { PlatformPage } from "./pages/PlatformPage";
import { LivePage } from "./pages/LivePage";
import { AffiliatePage } from "./pages/AffiliatePage";
import { MyLinkPage } from "./pages/MyLinkPage";
import { IndicadosPage } from "./pages/IndicadosPage";
import { ExtratoPage } from "./pages/ExtratoPage";
import { MaterialPage } from "./pages/MaterialPage";
import { SolicitarSaquePage } from "./pages/SolicitarSaquePage";
import { AccountPage } from "./pages/AccountPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: PlatformPage },
      { path: "live", Component: LivePage },
      { path: "afiliados", Component: AffiliatePage },
      { path: "afiliados/meu-link", Component: MyLinkPage },
      { path: "afiliados/indicados", Component: IndicadosPage },
      { path: "afiliados/extrato", Component: ExtratoPage },
      { path: "afiliados/material", Component: MaterialPage },
      { path: "afiliados/solicitar-saque", Component: SolicitarSaquePage },
      { path: "account", Component: AccountPage },
      { path: "logout", Component: () => <Navigate to="/login" replace /> },
      { path: "*", Component: () => <Navigate to="/" replace /> },
    ],
  },
]);
import { Container, CssBaseline, CssVarsProvider } from "@mui/joy";
import { ServerContextProvider } from "./communication/ServerContext";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { MainPage } from "./app/MainPage";
import RoomPage from "./app/[id]/RoomPage";
import { DisconnectedPage } from "./app/DisconnectedPage";

const router = createHashRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: ":roomId",
    element: <RoomPage />,
  },
  {
    path: "disconnected",
    element: <DisconnectedPage />,
  },
]);

export const App = () => {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <ServerContextProvider>
        <Container maxWidth={"xs"} sx={{ height: "100vh", display: "flex" }}>
          <RouterProvider router={router} />
        </Container>
      </ServerContextProvider>
    </CssVarsProvider>
  );
};

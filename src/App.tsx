import { Container, CssBaseline, CssVarsProvider, Stack } from "@mui/joy";
import { ServerContextProvider } from "./ServerProvider/ServerContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainPage } from "./app/page";
import RoomPage from "./app/[id]/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: ":roomId",
    element: <RoomPage />,
  },
]);

export const App = () => {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <ServerContextProvider>
        <Container maxWidth={"sm"}>
          <Stack
            height="100vh"
            justifyContent={"space-around"}
            sx={{
              py: 4,
            }}
          >
            <RouterProvider router={router} />
          </Stack>
        </Container>
      </ServerContextProvider>
    </CssVarsProvider>
  );
};

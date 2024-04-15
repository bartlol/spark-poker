import {
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { PokerGame } from "./PokerGame";
import {
  AppState,
  UserRole,
  appStateSchema,
  createEnterGameActionMessage,
} from "../../communication/messages";
import {
  OnCloseHandler,
  OnDataHandler,
  OnErrorHandler,
  OnOpenHandler,
  useConnect,
} from "../../hooks/usePeerClient";
import { Controller, useForm } from "react-hook-form";
import { NewPlayerInput, newPlayerSchema } from "../../inputSchemas/newPlayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoOutlined } from "@mui/icons-material";
import { usePersistentPlayerName } from "../../hooks/usePersistentPlayerName";
import { useNavigate } from "react-router-dom";

type Props = {
  serverId: string;
};

export const PokerClient = ({ serverId }: Props) => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);

  const { playerName, persistPlayerName } = usePersistentPlayerName();
  const { handleSubmit, control } = useForm<NewPlayerInput>({
    defaultValues: {
      name: playerName,
    },
    resolver: zodResolver(newPlayerSchema),
  });
  const [appState, setAppState] = useState<AppState | null>(null);
  const onDataHandler: OnDataHandler = useCallback((data) => {
    console.log("Client received", data);
    const newState = appStateSchema.parse(data);
    setAppState(newState);
  }, []);
  const onErrorHandler: OnErrorHandler = useCallback((err) => {
    console.warn("Error event in connection", err);
  }, []);
  const onCloseHandler: OnCloseHandler = useCallback(() => {
    setConnected(false);
    navigate("/disconnected");
  }, [navigate]);
  const onOpenHandler: OnOpenHandler = useCallback(() => {
    setConnected(true);
  }, []);
  const [chosenName, setChosenName] = useState<string>("");
  const [chosenRole, setRole] = useState<UserRole | null>(null);
  const connection = useConnect(
    serverId,
    onDataHandler,
    onErrorHandler,
    onCloseHandler,
    onOpenHandler
  );

  const nameChosen = chosenName !== "";

  const onSubmit = (role: UserRole) => (data: NewPlayerInput) => {
    persistPlayerName(data.name);
    setRole(role);
    // connection?.send(createEnterGameActionMessage(data.name, role));
    setChosenName(data.name);
    console.log(connected, nameChosen, chosenRole);
  };

  useEffect(() => {
    if (connected && nameChosen && chosenRole !== null) {
      connection?.send(createEnterGameActionMessage(playerName, chosenRole));
    }
  }, [connected, nameChosen, chosenRole]);

  if (connected && nameChosen && appState) {
    return (
      <PokerGame
        appState={appState!}
        myId={connection!.label}
        sendMessage={(data) => connection?.send(data)}
      />
    );
  }
  return (
    <Stack justifyContent={"space-evenly"} flex={1}>
      <Card>
        <Typography level="h3">Join room</Typography>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <FormControl error={fieldState.invalid}>
              <FormLabel>Name</FormLabel>
              <Input
                error={fieldState.invalid}
                onChange={field.onChange}
                value={field.value}
              />
              {fieldState.invalid && (
                <FormHelperText>
                  <InfoOutlined />
                  {fieldState.error?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        {nameChosen && !connected ? (
          <Stack alignItems={"center"}>
            <CircularProgress />
            <Typography level="body-md">Joining as {chosenRole}</Typography>
          </Stack>
        ) : (
          <>
            <Button onClick={handleSubmit(onSubmit("player"))}>
              Join as Player
            </Button>
            <Button
              onClick={handleSubmit(onSubmit("spectator"))}
              variant="soft"
            >
              Join as Spectator
            </Button>
          </>
        )}
      </Card>
    </Stack>
  );
};

import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useCallback, useState } from "react";
import { PokerGame } from "./PokerGame";
import {
  AppState,
  UserRole,
  appStateSchema,
  createEnterGameActionMessage,
} from "../../ServerProvider/messages";
import { OnDataHandler, useConnect } from "../../messages/usePeerClient";
import { Controller, useForm } from "react-hook-form";
import { NewPlayerInput, newPlayerSchema } from "../../inputSchemas/newPlayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoOutlined } from "@mui/icons-material";

type Props = {
  serverId: string;
};

export const PokerClient = ({ serverId }: Props) => {
  const { handleSubmit, control } = useForm<NewPlayerInput>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(newPlayerSchema),
  });
  const [appState, setAppState] = useState<AppState | null>(null);
  const onDataHandler: OnDataHandler = useCallback((data) => {
    console.log("Client received", data);
    const newState = appStateSchema.parse(data);
    setAppState(newState);
  }, []);

  const [chosenName, setChosenName] = useState<string>("");
  const connection = useConnect(serverId, onDataHandler);
  const connected = connection.current !== null;
  const nameChosen = chosenName !== "";

  if (connected && nameChosen && appState) {
    return (
      <PokerGame
        appState={appState!}
        myId={connection.current!.label}
        sendMessage={(data) => connection.current?.send(data)}
      />
    );
  }

  const onSubmit = (role: UserRole) => (data: NewPlayerInput) => {
    connection.current?.send(createEnterGameActionMessage(data.name, role));
    setChosenName(data.name);
  };
  return (
    <Stack component={"form"} alignContent={"center"}>
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

        <Button
          onClick={handleSubmit(onSubmit("player"))}
          loading={!connected && nameChosen}
        >
          Join as Player
        </Button>
        <Button
          onClick={handleSubmit(onSubmit("spectator"))}
          loading={!connected && nameChosen}
          variant="soft"
        >
          Join as Spectator
        </Button>
      </Card>
    </Stack>
  );
};

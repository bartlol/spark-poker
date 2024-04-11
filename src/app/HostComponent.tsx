import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ServerContext } from "../ServerProvider/ServerContext";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoOutlined } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import {
  AllowedValuesInput,
  allowedValuesInputSchema,
} from "../inputSchemas/allowedValues";

export const HostComponent = () => {
  const { handleSubmit, control, formState } = useForm<AllowedValuesInput>({
    defaultValues: {
      values: "1,2,4,8,16",
    },
    resolver: zodResolver(allowedValuesInputSchema),
  });
  const runServer = useContext(ServerContext);
  const navigate = useNavigate();

  const onSubmit = (data: AllowedValuesInput) => {
    const parsedValues = data.values.split(",").map(Number);
    const roomId = uuidv4();
    console.log("Creating room with id", roomId);
    runServer!(roomId, parsedValues);
    navigate(roomId);
  };

  const onError = (err: unknown) => {
    console.error(err);
  };

  console.log(formState);
  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        borderRadius: 8,
      }}
    >
      <Typography level="h1">SparkPoker</Typography>

      <Controller
        control={control}
        name="values"
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.invalid}>
            <FormLabel>Values</FormLabel>
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

      <Button onClick={handleSubmit(onSubmit, onError)} size="lg">
        Create new room
      </Button>
    </Sheet>
  );
};

import { Button } from "@mui/joy";
import { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
export const CopyToClipboard = () => {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <Button
      sx={{
        minWidth: "128px",
      }}
      color={copied ? "success" : "primary"}
      variant={copied ? "soft" : "outlined"}
      startDecorator={copied ? <DoneIcon /> : <PersonAddAlt1OutlinedIcon />}
      onClick={
        copied
          ? undefined
          : () => {
              if (window !== undefined) {
                setCopied(true);
                window.navigator.clipboard.writeText(window.location.href);
                setTimeout(() => setCopied(false), 3000);
              }
            }
      }
    >
      {copied ? "Link copied!" : "Invite players"}
    </Button>
  );
};

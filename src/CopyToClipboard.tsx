import { Button } from "@mui/joy";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";

export const CopyToClipboard = () => {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <Button
      sx={{
        minWidth: "128px",
      }}
      color={copied ? "success" : "primary"}
      variant={copied ? "soft" : "solid"}
      startDecorator={copied ? <DoneIcon /> : <ContentCopyIcon />}
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
      {copied ? "Done" : "Copy link"}
    </Button>
  );
};

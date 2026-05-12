import { Box, TextField } from "@mui/material";
import FormBase from "../FormBases/FormBase";
import { useEffect, useState } from "react";
import { usersService } from "@services/users";
import { enqueueSnackbar } from "notistack";

type UsernameFormProps = {
  open: boolean;
  onClose: () => void;
  username: string;
  asyncUsername: (state: string) => void;
};

const UsernameForm = ({
  open,
  onClose,
  username,
  asyncUsername,
}: UsernameFormProps) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (open)
      setName(username);
  }, [open]);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleUpdateUsername = async () => {
    try {
      let user = await usersService.updateUsername(name);
      asyncUsername(user);
      onClose();
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <FormBase
      className="username-form"
      title="New Name"
      open={open}
      onClose={onClose}
      actionButtonOnClick={handleUpdateUsername}
      actionButtonLabel="Update"
    >
      <Box>
        {/* username */}
        <TextField
          value={name}
          placeholder="Title"
          onChange={handleChangeName}
          slotProps={{
            input: {
              endAdornment: `${name?.length ?? 0}/50`,
            },
          }}
        />
      </Box>
    </FormBase>
  );
};

export default UsernameForm;

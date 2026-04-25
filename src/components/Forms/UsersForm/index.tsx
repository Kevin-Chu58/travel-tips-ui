import type { UserSimple } from "@services/users";
import UserCard from "@components/Cards/UserCard";
import PersonIcon from "@mui/icons-material/Person";
import FormBase from "../FormBases/FormBase";
import { Box, Typography } from "@mui/material";

type UsersFormProps = {
  open: boolean;
  onClose: () => void;
  title: string | React.JSX.Element;
  users: UserSimple[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
};

const UsersForm = ({
  open,
  onClose,
  title,
  users,
  containerRef,
  onScroll,
}: UsersFormProps) => {
  return (
    <FormBase
      open={open}
      onClose={onClose}
      title={title}
      headerIcon={<PersonIcon />}
      closeButtonLabel="Close"
      closeButtonVariant="contained"
      contentRef={containerRef}
      onScroll={onScroll}
      panel
    >
      <Box>
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        ) : (
          <Typography>No users available.</Typography>
        )}
      </Box>
    </FormBase>
  );
};

export default UsersForm;

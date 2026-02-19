import { Avatar, Box, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { UserSimple } from "@services/users";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type UserCardProps = {
  user: UserSimple;
  hasMobileView?: boolean;
};

const UserCard = ({ user, hasMobileView = false }: UserCardProps) => {
  // window
  const isMobile = useIsMobile();

  // handle

  // navigate to user public profile
  const handleUsernameClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // TODO - navigate to user public profile, replace this with nav button and typography as child
  };

  const handleUserIdCopy = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(user.userId);
      enqueueSnackbar("Copied user id to clipboard!", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <Box className={clsx("user-card-container", hasMobileView && isMobile && "mobile")}>
      <Avatar
        alt={user.username}
        src={user.picture}
        slotProps={{ img: { loading: "lazy" } }}
      />
      <Box className="section">
        <Typography
          className="username"
          variant={isMobile ? "body2" : "body1"}
          onClick={handleUsernameClick}
        >
          {user.username}
        </Typography>
        <Box className="user-id-box" onClick={handleUserIdCopy}>
          <Typography className="too-long" variant="caption">{user.userId}</Typography>
          <ContentCopyIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default UserCard;

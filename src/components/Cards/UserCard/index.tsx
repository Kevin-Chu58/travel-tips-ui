import { Box, Typography } from "@mui/material";
import type { UserSimple } from "@services/users";
import { useIsMobile } from "@hooks/useIsMobile";
import UserAvatar from "@components/UserAvatar";
import clsx from "clsx";
import "./index.scss";
import { useNavToProfile } from "@hooks/useNavToProfile";

type UserCardProps = {
  user: UserSimple;
  hasMobileView?: boolean;
  navigate?: boolean;
};

const UserCard = ({
  user,
  hasMobileView = false,
  navigate = true,
}: UserCardProps) => {
  // window
  const isMobile = useIsMobile();
  // nav to profile
  const navToProfile = useNavToProfile(user);

  // handle

  // navigate to user public profile
  const handleUsernameClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!navigate) return;

    e.stopPropagation();
    navToProfile();
  };

  // const handleUserIdCopy = async (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation();

  //   try {
  //     await navigator.clipboard.writeText(user.userId);
  //     enqueueSnackbar("Copied user id to clipboard!", { variant: "success" });
  //   } catch (e) {
  //     if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
  //   }
  // };

  return (
    <Box
      className={clsx(
        "user-card-container",
        hasMobileView && isMobile && "mobile",
      )}
    >
      <UserAvatar user={user} />
      <Typography
        className="username"
        variant={isMobile ? "body2" : "body1"}
        onClick={handleUsernameClick}
      >
        {user.username}
        <span className="helper">
          <br />ID: {user.id}
        </span>
      </Typography>
    </Box>
  );
};

export default UserCard;

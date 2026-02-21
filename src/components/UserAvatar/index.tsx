import { Avatar } from "@mui/material";
import type { UserSimple } from "@services/users";
import clsx from "clsx";
import "./index.scss";

type UserAvatarProps = {
  user?: UserSimple;
  highlight?: boolean;
  onClick?: (state: any) => void;
  className?: string;
};

const UserAvatar = ({
  user,
  highlight = false,
  onClick,
  className,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={clsx(
        "user-avatar",
        highlight && "heavy-box-shadow",
        className,
      )}
      alt={user?.username}
      src={user?.picture}
      slotProps={{ img: { loading: "lazy" } }}
      onClick={onClick}
    />
  );
};

export default UserAvatar;

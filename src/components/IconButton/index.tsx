import type { Theme } from '@emotion/react';
import { IconButton as MuiIconButton, type SxProps } from '@mui/material';

type IconButtonProps = {
    children: React.ReactNode,
    sx?: SxProps<Theme>
    onClick?: () => void,
}

const IconButton = ({sx, children, onClick}: IconButtonProps) => {

    return (
        <MuiIconButton disableRipple sx={sx} onClick={onClick}>
            {children}
        </MuiIconButton>
    )
}

export default IconButton;
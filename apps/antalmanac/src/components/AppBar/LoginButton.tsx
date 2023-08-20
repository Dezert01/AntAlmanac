import { useState, MouseEvent, useEffect } from 'react';
import { AssignmentReturn, AssignmentReturned } from '@mui/icons-material';
import { Button, Avatar, Box, MenuItem, MenuList, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from '$lib/api/endpoints';
import AppStore, { User } from '$stores/AppStore';

const StyledButton = styled(Button)({
    display: 'flex',
    alignItems: 'center',
});

const StyledAvatar = styled(Avatar)({
    width: 30,
    height: 30,
});

const LoginButton = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [authUser, setAuthUser] = useState<User | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);

    const login = () => {
        if (AppStore.schedule.wasScheduleChanged()) {
            setDialogOpen(true);
        } else {
            window.location.href = LOGIN_ENDPOINT;
        }
    };

    const logout = async () => {
        await fetch(LOGOUT_ENDPOINT, {
            method: 'POST',
            credentials: 'include',
        });
        // force page reload
        window.location.reload();
    };
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const cacheSchedule = () => {
        window.localStorage.setItem('tempUserData', JSON.stringify(AppStore.schedule.getScheduleAsSaveState()));
    };

    useEffect(() => {
        const updateAuthUser = async () => {
            const user = AppStore.user;
            setAuthUser(user);
        };
        updateAuthUser();
        AppStore.on('userAuthChange', updateAuthUser);

        return () => {
            AppStore.removeListener('userAuthChange', updateAuthUser);
        };
    });

    return (
        <>
            {authUser !== undefined ? (
                <>
                    <StyledButton onClick={handleClick} color="inherit">
                        <StyledAvatar
                            alt={authUser.name}
                            src={authUser.picture}
                            imgProps={{ referrerPolicy: 'no-referrer' }}
                        />
                    </StyledButton>

                    <Popover
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuList>
                            <MenuItem style={{ pointerEvents: 'none' }}>
                                <Box display="flex" justifyContent="center" width="100%">
                                    <Typography variant="button" align="center">
                                        {authUser.name}
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem>
                                <Button onClick={logout} color="inherit" startIcon={<AssignmentReturn />}>
                                    Logout
                                </Button>
                            </MenuItem>
                        </MenuList>
                    </Popover>
                </>
            ) : (
                <Button onClick={login} color="inherit" startIcon={<AssignmentReturned />}>
                    Login
                </Button>
            )}

            <Dialog open={dialogOpen}>
                <DialogTitle>Before logging in, should we import current schedules?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Would you like to import these current schedules into your AntAlmanac account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            cacheSchedule();
                            window.localStorage.removeItem('userID');
                            window.location.href = LOGIN_ENDPOINT;
                        }}
                        color="primary"
                    >
                        Import
                    </Button>
                    <Button
                        onClick={() => {
                            window.location.href = LOGIN_ENDPOINT;
                        }}
                    >
                        Don&apos;t Import
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default LoginButton;

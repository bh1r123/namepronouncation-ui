import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Logout from '@mui/icons-material/Logout';
import Loader from './Loader'
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router'
import jwt_decode from 'jwt-decode'
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

import './Header.css'

export default function Header(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const StyledAppbar = styled(AppBar)(({ theme }) => ({
    backgroundColor: "#d71e28"
  }));

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSettings = (event) => {
    navigate('/settings', { replace: false });
  }

  const handleHomeClick = (event) => {
    navigate('/dashboard', { replace: false });
  }

  const handleLogout = (event) => {
    sessionStorage.clear();
    navigate('/', { replace: true })
  }

  useEffect(() => {
    console.log(props)
  }, [props])

  const [userInformation, setUserInformation] = React.useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    var token = sessionStorage.getItem('token');
    if (token != undefined && token != "") {
      setUserInformation(true);
      var decodeToken = jwt_decode(token);
      console.log(decodeToken)
      setName(decodeToken.firstName + " " + decodeToken.lastName);
      console.log(decodeToken);
    }
  }, [])

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
    </Menu>
  );
  //https://www17.wellsfargomedia.com/assets/images/rwd/wf_logo_220x23.png
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <StyledAppbar position="static" >
          {
            userInformation ? (<Toolbar>
              
              <img src="https://www17.wellsfargomedia.com/assets/images/rwd/wf_logo_220x23.png" />
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                  size="large"
                  onClick={handleHomeClick}
                  color="inherit"
                >
                  <HomeIcon />
                </IconButton>

              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                  size="large"
                  onClick={handleSettings}
                  color="inherit"
                >
                  <SettingsIcon />
                </IconButton>

              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Typography variant="h6" color="inherit" component="div">
                  {name}
                </Typography>
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                  size="large"
                  
                  color="inherit"
                  onClick={handleLogout}
                >
                  <Logout />
                </IconButton>

              </Box>
            </Toolbar>) : (<Toolbar>
              <img src="https://www17.wellsfargomedia.com/assets/images/rwd/wf_logo_220x23.png" />
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>)
          }

        </StyledAppbar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <div className="defaulrmargin">
        {props.children}
        <Loader open={props.open == undefined ? false : props.open} />
      </div>
    </div>
  );
}

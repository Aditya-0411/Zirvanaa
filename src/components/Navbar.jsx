// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const response = await api.get("/catalog/cart/");
      if (response.data?.items) {
        const count = response.data.items.reduce(
          (total, item) => total + item.qty,
          0
        );
        setCartCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sellerStatus = user?.seller_status;
  const isApprovedSeller = sellerStatus === "approved";

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  // 🔹 Style for all nav buttons
  const linkButton = {
    color: "#fff",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.95rem",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.15)",
    },
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #1976d2, #2196f3)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: "1.4rem",
            }}
          >
            ZIRVANAA
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button component={Link} to="/products" sx={linkButton}>
              Shop
            </Button>
            <Button component={Link} to="/about" sx={linkButton}>
              About
            </Button>

            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{ position: "relative" }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon sx={{ color: "#fff" }} />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <Button component={Link} to="/orders" sx={linkButton}>
                  Orders
                </Button>
                <Button component={Link} to="/vouchers/purchase" sx={linkButton}>
                  Buy Voucher
                </Button>
                <Button component={Link} to="/vouchers" sx={linkButton}>
                  My Vouchers
                </Button>
                {isApprovedSeller && (
                  <Button component={Link} to="/seller/dashboard" sx={linkButton}>
                    Seller
                  </Button>
                )}
                <Button component={Link} to="/profile" sx={linkButton}>
                  Profile
                </Button>
                <Button onClick={handleLogout} sx={linkButton}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={linkButton}>
                  Login
                </Button>
                <Button component={Link} to="/signup" sx={linkButton}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button component={Link} to="/products" onClick={toggleDrawer(false)}>
              <ListItemText primary="Shop" />
            </ListItem>
            <ListItem button component={Link} to="/about" onClick={toggleDrawer(false)}>
              <ListItemText primary="About" />
            </ListItem>
            <Divider />
            {isAuthenticated ? (
              <>
                <ListItem button component={Link} to="/orders" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Orders" />
                </ListItem>
                <ListItem button component={Link} to="/vouchers/purchase" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Buy Voucher" />
                </ListItem>
                <ListItem button component={Link} to="/vouchers" onClick={toggleDrawer(false)}>
                  <ListItemText primary="My Vouchers" />
                </ListItem>
                {isApprovedSeller && (
                  <ListItem button component={Link} to="/seller/dashboard" onClick={toggleDrawer(false)}>
                    <ListItemText primary="Seller Dashboard" />
                  </ListItem>
                )}
                <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleLogout();
                    toggleDrawer(false)();
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/signup" onClick={toggleDrawer(false)}>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;

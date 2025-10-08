// src/pages/seller/SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Tabs, Tab, CircularProgress, Alert } from "@mui/material";
import api from "../../api";
import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";

export default function SellerDashboard() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [statusPayload, setStatusPayload] = useState(null);
  const [error, setError] = useState("");

  // Use seller/register/ endpoint to check seller status (your backend provides it)
  const checkSeller = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/accounts/seller/register/");
      // data: either { exists: false } or SellerProfileSerializer data + exists true
      setStatusPayload(data);
      if (data?.exists && data?.status === "approved") {
        setApproved(true);
      } else {
        setApproved(false);
        if (!data?.exists) setError("You are not registered as a seller yet.");
        else if (data?.status === "pending") setError("Your seller application is pending approval.");
        else if (data?.status === "rejected") setError("Your seller application was rejected.");
      }
    } catch (err) {
      console.error("Seller status fetch failed", err);
      if (err.response?.status === 401) setError("Not authenticated. Please login.");
      else setError("Failed to fetch seller status. Check your connection.");
      setApproved(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSeller();
    // re-check when tab changes? not necessary
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  // when not approved show message & link to registration
  if (!approved) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || "Seller access is not available."}
        </Alert>
        {statusPayload?.exists ? (
          <Typography variant="body2">Current status: <b>{statusPayload.status}</b></Typography>
        ) : (
          <Typography variant="body2">Please register as a seller at <b>/seller/register</b>.</Typography>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)}>
          <Tab label="My Products" />
          <Tab label="My Orders" />
        </Tabs>
      </Box>

      <Box sx={{ pt: 2 }}>
        {tab === 0 && <SellerProducts />}
        {tab === 1 && <SellerOrders />}
      </Box>
    </Container>
  );
}
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  CardMedia,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import propertyimg from "./prop.webp";
import "./Property.css"; // Import the CSS file for styling
import LimitBidButton from "./BidButton";
import MarketBidButton from "./BidButton2";
import LimitSellButton from "./SellButton";
import MarketSellButton from "./SellButton2";
import ConfirmationDialog from "./ConfirmationDialogue";

function BasicTable({ buyBids, sellBids }) {
  // Sort rows by buybid in ascending order and sellbid in descending order
  const sortedRows = buyBids.map((buyBid, index) => ({
    buyBid,
    sellBid: sellBids[index],
  }));

  return (
    <TableContainer component={Paper} className="Table">
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="Table-cell">Top buy bids</TableCell>
            <TableCell className="Table-cell">Top sell bids</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.buyBid}
              </TableCell>
              <TableCell>{row.sellBid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Property() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [userId, setUserId] = useState(1); // Replace with the actual user ID
  const [buyBids, setBuyBids] = useState([]);
  const [sellBids, setSellBids] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [actionType, setActionType] = useState("");

  const handleAddToWatchlist = () => {
    setActionType("add");
    setDialogMessage("Are you sure you want to add this property to your wishlist?");
    setOpenDialog(true);
  };

  const handleRemoveFromWatchlist = () => {
    setActionType("remove");
    setDialogMessage("Are you sure you want to remove this property from your wishlist?");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = async () => {
    setOpenDialog(false);
    try {
      const response = await fetch(`http://localhost:8000/api/watchlist/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: actionType,
          property_id: propertyId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Action successful:", data.message);
        // Handle success, e.g., show a success message
      } else {
        const errorData = await response.json();
        console.error("Action failed:", errorData);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("Error performing action:", error);
      // Handle error, e.g., show an error message
    }
  };

  useEffect(() => {
    // Fetch property data from the server based on propertyId
    const fetchData = async () => {
      try {
        const propertyResponse = await fetch(
          `http://localhost:8000/api/properties/${propertyId}`
        );
        if (!propertyResponse.ok) {
          throw new Error("Failed to fetch property");
        }
        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        // Fetch top buy orders
        const buyResponse = await fetch(
          `http://localhost:8000/api/orders/buy/${propertyId}`
        );
        if (!buyResponse.ok) {
          throw new Error("Failed to fetch buy orders");
        }
        const buyData = await buyResponse.json();
        const buyBidsArray = buyData.map((order) => order.price);
        setBuyBids(buyBidsArray);

        // Fetch top sell orders
        const sellResponse = await fetch(
          `http://localhost:8000/api/orders/sell/${propertyId}`
        );
        if (!sellResponse.ok) {
          throw new Error("Failed to fetch sell orders");
        }
        const sellData = await sellResponse.json();
        const sellBidsArray = sellData.map((order) => order.price);
        setSellBids(sellBidsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use default property values if fetch fails
        const defaultProperty = {
          name: "Property Title",
          category: "Property Category",
          location: "Property Location",
          ltp: "Property LTP",
          description:
            "Welcome to your dream home! Nestled in the heart of a vibrant community, this charming property boasts modern comforts and classic appeal.",
        };
        setProperty(defaultProperty);
        setBuyBids([0, 0, 0, 0, 0]); // Default buy bids
        setSellBids([0, 0, 0, 0, 0]); // Default sell bids
      }
    };

    if (propertyId) {
      fetchData();
    } else {
      // Default property object if no propertyId is passed
      const defaultProperty = {
        name: "Property Title",
        category: "Property Category",
        location: "Property Location",
        ltp: "Property LTP",
        description:
          "Welcome to your dream home! Nestled in the heart of a vibrant community, this charming property boasts modern comforts and classic appeal.",
      };
      setProperty(defaultProperty);
      setBuyBids([0, 0, 0, 0, 0]); // Default buy bids
      setSellBids([0, 0, 0, 0, 0]); // Default sell bids
    }
  }, [propertyId]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="property-container" sx={{ mt: 4 }}>
      <ConfirmationDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        message={dialogMessage}
      />
      <div className="property-content">
        <CardMedia
          component="img"
          image={property.image || propertyimg}
          alt="property image"
          sx={{ width: 650, objectFit: "cover" }}
          className="property-image"
        />
        <div className="property-buttons">
          <MarketBidButton bidAmount={property.ltp} userId={userId} propertyId={propertyId} />
          <LimitBidButton userId={userId} propertyId={propertyId} />
          <MarketSellButton bidAmount={property.ltp} userId={userId} propertyId={propertyId} />
          <LimitSellButton userId={userId} propertyId={propertyId} />
          <Button
            variant="outlined"
            color="primary"
            className="wishlist-button"
            onClick={handleAddToWatchlist}
          >
            Add to Wishlist
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="wishlist-button"
            onClick={handleRemoveFromWatchlist}
          >
            Remove from Wishlist
          </Button>
          <BasicTable buyBids={buyBids} sellBids={sellBids} />
        </div>
      </div>
      <div className="property-details">
        <Typography variant="h4" className="property-title" gutterBottom>
          {property.name}
        </Typography>
        <Typography variant="h6" className="property-category" gutterBottom>
          Category: {property.category}
        </Typography>
        <Typography variant="h6" className="property-location" gutterBottom>
          Location: {property.location}
        </Typography>
        <Typography variant="subtitle1" className="property-ltp" gutterBottom>
          Market Order Price: {property.ltp}
        </Typography>
        <Typography
          variant="body1"
          className="property-description"
          gutterBottom
        >
          {property.description}
        </Typography>
      </div>
    </Container>
  );
}

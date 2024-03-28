'use client'
import * as React from "react";
import { Typography, Button, Card, CardMedia, ThemeProvider, Breadcrumbs, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CardDetailsPage = () => {
    const router = useRouter();
    const theme = useTheme();

    // Hard-coded card details
    const cardDetails = {
        name: "Pokemon Card",
        imageURL: "/images/pokemon.jpg",
        description: "This is a rare and powerful Pokemon card. It's a must-have for any serious collector.",
        price: "$10",
        rarity: "Rare",
        category: "Pokemon",
        condition: "Mint",
        seller: "John Doe",
        location: "New York, USA",
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                {/* Breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: theme.spacing(2) }}>
                    <Link color="inherit" href="/" onClick={() => router.push('/')}>
                        Home
                    </Link>
                    <Typography color="text.primary">Card Details</Typography>
                </Breadcrumbs>

                {/* Image and Details Section */}
                <div style={{ display: 'flex', marginTop: theme.spacing(2) }}>
                    {/* Image Section */}
                    <Card style={{ boxShadow: 'none', marginRight: theme.spacing(2) }}>
                        <CardMedia
                            component="img"
                            image={cardDetails.imageURL}
                            alt={cardDetails.name}
                            style={{ width: 300, height: "auto" }}
                        />
                    </Card>

                    {/* Details Section */}
                    <div style={{ maxWidth: 600, paddingLeft: theme.spacing(2), borderRadius: theme.shape.borderRadius }}>
                        <Typography variant="h4" gutterBottom>
                            {cardDetails.name}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Price: {cardDetails.price}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Description: {cardDetails.description}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Rarity: {cardDetails.rarity}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Category: {cardDetails.category}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Condition: {cardDetails.condition}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Seller: {cardDetails.seller}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Location: {cardDetails.location}
                        </Typography>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: theme.spacing(1), marginTop: theme.spacing(2) }}>
                            <Button
                                variant="contained"
                                color="accent"
                                style={{ color: theme.palette.background.paper }}
                                startIcon={<ShoppingCartIcon />}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"

                                startIcon={<FavoriteIcon />}
                            >
                                Add to Favorites
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default CardDetailsPage;

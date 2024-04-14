'use client'
import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Link, Box } from '@mui/material';
import { useTheme } from '@mui/system';

const Team = () => {
    const theme = useTheme();

    const sectionStyle = {
        marginTop: theme.spacing(4),
        textAlign: 'center',
    };

    const cardStyle = {
        width: 320,
        margin: '24 auto',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const mediaStyle = {
        height: 200,
        objectFit: 'cover',
    };


    const teamMembers = [
        {
            name: 'Cesar Lopez',
            description: 'Frontend Developer',
            githubUsername: 'wowgr8',
            image: '/images/cesar-lopez.png',
            width: 200,
            height: 200,
        },
        {
            name: 'Liubov Rodin',
            description: 'Frontend Developer',
            githubUsername: 'LiubovCass ',
            image: '/images/liubov-rodin.png',
            width: 200,
            height: 200,
        },


        {
            name: 'Oksana Feterovskaya',
            description: 'Frontend Developer',
            githubUsername: 'ofeterovskaya',
            image: '/images/oksana-feterovskaya.png',
            width: 200,
            height: 200,
        },


        {
            name: 'Victoria Taiwo',
            description: 'Frontend Developer',
            githubUsername: 'Victoria240',
            image: '/images/victoria-taiwo.jpg',
            width: 200,
            height: 200,
        },


        {
            name: 'Elena Cherpakova',
            description: 'Full Stack Developer',
            githubUsername: 'ElenaCherpakova',
            image: '/images/elena-cherpakova.png',
            width: 200,
            height: 200,
        },


        {
            name: 'Anna Pestova',
            description: 'Full Stack Developer',
            githubUsername: 'AnnaPestova1 ',
            image: '/images/anna-pestova.png',
            width: 200,
            height: 200,
        },


        {
            name: 'Anna Solovykh',
            description: 'Full Stack Developer',
            githubUsername: 'AnnaSolovykh',
            image: '/images/anna-solovykh.png',
            width: 200,
            height: 200,
        },


    ];




    const teamMentors = [
        {
            name: 'Matthew Walters',
            description: 'Frontend Developer',
            githubUsername: 'WaltersMatthew',
            image: '/images/matthew-walters.png',
            width: 200,
            height: 200,
        },
        {
            name: 'Munir Nuristani',
            description: 'Backend Developer',
            githubUsername: 'MunirNuristani',
            image: '/images/munir-nuristani.png',
            width: 200,
            height: 200,
        }
    ];


    return (
        <Box>
            <Box sx={sectionStyle}>
                <Typography variant="h3" gutterBottom style={{ color: theme.palette.accent.main, backgroundColor: theme.palette.primary.main, padding: '80px' }}>About Playtrade</Typography>
                <Typography variant="body1" gutterBottom style={{ width: '80%', margin: '0 auto', textAlign: 'center', marginTop: theme.spacing(4) }}>
                    Playtrade is a premier online card trading platform, offering users a seamless and secure marketplace to buy, sell, and trade a diverse range of collectible cards. Our platform is designed to cater to the needs of both casual collectors and serious enthusiasts, providing a user-friendly interface, robust security features, and a vibrant community atmosphere. Whether you are searching for rare gems to add to your collection or looking to connect with fellow enthusiasts, Playtrade is your ultimate destination for all things card trading.
                </Typography>
            </Box>
            <Box sx={sectionStyle}>
                <Typography variant="h3" gutterBottom style={{ color: theme.palette.accent.main }}>Meet the team</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom style={{ marginBottom: theme.spacing(4) }}>TEAM MEMBERS</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {teamMembers.map((member, index) => (
                                <Card key={index} sx={{ ...cardStyle, marginRight: theme.spacing(2), marginBottom: theme.spacing(2) }}>
                                    <CardMedia
                                        sx={mediaStyle}
                                        image={member.image}
                                        title={member.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h5" component="h3" gutterBottom>{member.name}</Typography>
                                        <Typography variant="body2" component="p">{member.description}</Typography>
                                        <Link href={`https://github.com/${member.githubUsername}`} target="_blank" rel="noopener noreferrer">
                                            GitHub
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom >TEAM MENTORS</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {teamMentors.map((member, index) => (
                                <Card key={index} sx={{ ...cardStyle, marginRight: theme.spacing(2), marginBottom: theme.spacing(2) }}>
                                    <CardMedia
                                        sx={mediaStyle}
                                        image={member.image}
                                        title={member.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h5" component="h3" gutterBottom>{member.name}</Typography>
                                        <Typography variant="body2" component="p">{member.description}</Typography>
                                        <Link href={`https://github.com/${member.githubUsername}`} target="_blank" rel="noopener noreferrer">
                                            GitHub
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Team;

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../login';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Alert, AlertTitle } from '@mui/material';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUpPage() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString() || "";
        const password = data.get('password')?.toString() || "";
        const location = data.get('location')?.toString() || "";
        const phone = data.get('phone')?.toString() || "";
        const name = data.get('hotelName')?.toString() || "";
        try {
            await signup(name, phone, location, email, password);
            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrorMessage(error.response?.data || error.message);
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {
                                errorMessage && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">
                                            <AlertTitle>{errorMessage}</AlertTitle>
                                        </Alert>
                                    </Grid>
                                )
                            }


                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    autoComplete='hotelName'
                                    name="hotelName"
                                    required
                                    fullWidth
                                    id="hotelName"
                                    label="HotelName"
                                    autoFocus
                                />
                            </Grid>

                            {/*Phone*/}
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete='phone'
                                    name="phone"
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    autoFocus
                                />
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete='location'
                                    name="location"
                                    required
                                    fullWidth
                                    id="location"
                                    label="Location"
                                    autoFocus
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/login">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>

            </Container>

        </ThemeProvider>
    );
}
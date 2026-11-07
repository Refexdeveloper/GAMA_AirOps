import axios from 'axios';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Link,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

import Logo from 'src/components/logo';

import Iconify from '../components/iconify';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 'auto',
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [user, setUser] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      axios
        .post(`/auth/verify_token/${token}`)
        .then((response) => {
          if (response.data.status) {
            setIsValidToken(true);
            setUser(response.data.results.user);
          }
        })
        .catch((error) => {
          setIsValidToken(false);
          console.log(error);
          setMessage(error.response.data.message);
        });
    } catch (error) {
      setIsValidToken(false);
      setMessage('Unexpected error occurred!');
    }
  }, [token]);

  const handleSubmit = (event) => {
    setLoading(true);
    setMessage('');
    event.preventDefault();
    if (!password) {
      setTimeout(() => {
        setMessage('Password is required.');
        setLoading(false);
      }, 1000);
    } else if (!confirmPassword) {
      setTimeout(() => {
        setMessage('Confirm Password is required.');
        setLoading(false);
      }, 1000);
    } else {
      try {
        axios
          .patch(`/auth/reset_password/${token}`, {
            password,
            confirm_password: confirmPassword,
          })
          .then((response) => {
            if (response.data.status) {
              setTimeout(() => {
                setStatus(true);
                setLoading(false);
                setMessage(response.data.message);
              }, 1000);
            }
          })
          .catch((error) => {
            setTimeout(() => {
              setStatus(false);
              setLoading(false);
              setMessage(error.response.data.message);
            }, 1000);
          });
      } catch (error) {
        setStatus(false);
        setLoading(false);
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Reset Password | GAMA AirOps </title>
      </Helmet>
      <Box
        component="header"
        sx={{
          top: 0,
          left: 0,
          width: 1,
          lineHeight: 0,
          position: 'fixed',
          p: (theme) => ({ xs: theme.spacing(3, 3, 0), sm: theme.spacing(5, 5, 0) }),
        }}
      >
        <Logo />
      </Box>
      {isValidToken ? (
        <Container>
          <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h3"
                color={!status ? 'inherit' : (theme) => theme.palette.success.main}
                paragraph
              >
                {!status ? 'Reset your password!' : message}
              </Typography>
              {!status && (
                <>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Please provide a new password for user{' '}
                    <Typography display="inline" sx={{ color: 'text.primary' }}>
                      {user.email}
                    </Typography>
                  </Typography>

                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ my: 2 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirm_password"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm_password"
                      autoComplete="current-password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              <Iconify
                                icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <LoadingButton
                      fullWidth
                      loading={loading}
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 1 }}
                    >
                      Reset Password
                    </LoadingButton>

                    <Typography
                      mt={1}
                      variant="subtitle1"
                      color={status ? (theme) => theme.palette.success.main : 'error'}
                      align="center"
                    >
                      {message}
                    </Typography>
                  </Box>
                </>
              )}
              <Typography
                variant="subtitle1"
                display="inline-block"
                color="info"
                sx={{ fontWeight: 900 }}
              >
                <Link href="/login" underline="hover">
                  Go To Login Page
                </Link>
              </Typography>
            </Card>
          </StyledContent>
        </Container>
      ) : (
        <Container>
          <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h3" paragraph>
              {message}
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t load the password reset form.
            </Typography>

            <Box
              component="img"
              src="/assets/illustrations/illustration_404.svg"
              sx={{ height: 260, mx: 'auto', my: { xs: 4, sm: 6 } }}
            />

            <Button to="/login" size="large" variant="contained" component={RouterLink}>
              Go To Login Page
            </Button>
          </StyledContent>
        </Container>
      )}
    </>
  );
}

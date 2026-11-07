import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@mui/material/InputAdornment';
import { Checkbox, FormControlLabel } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { useAuth } from 'src/context/AuthContext';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SSO_ERROR_MESSAGES = {
  no_code: 'SSO did not return an authorization code. Try again.',
  not_configured: 'SSO is not configured. Contact admin.',
  token_failed: 'SSO sign-in failed (token). Try again.',
  profile_failed: 'Could not load your SSO profile.',
  no_email: 'Your SSO account has no email.',
  user_not_found: 'Your email is not registered or account is inactive. Contact admin.',
  login_failed: 'SSO sign-in failed. Try again.',
};

export default function LoginView() {
  const router = useRouter();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginStatusMessage, setLoginStatusMessage] = useState(' ');
  const [showPassword, setShowPassword] = useState(false);
  const [ssoProviders, setSsoProviders] = useState([]);

  useEffect(() => {
    axios
      .get('/auth/sso-providers')
      .then((res) => setSsoProviders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSsoProviders([]));
  }, []);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err && SSO_ERROR_MESSAGES[err]) {
      setLoginStatus(false);
      setLoginStatusMessage(SSO_ERROR_MESSAGES[err]);
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          next.delete('error');
          return next;
        },
        { replace: true }
      );
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginStatusMessage(' ');
    setLoading(true);
    if (email === '' || email === null || password === '' || password === null) {
      setTimeout(() => {
        setLoginStatusMessage('Email and Password is required.');
        setLoading(false);
      }, 1000);
    } else {
      axios
        .post(`/auth/login`, { email, password, remember })
        .then((response) => {
          setLoginStatus(response.data.status);
          if (response.data.status) {
            login(remember, response.data.token, response.data.user_data);
            setLoginStatusMessage(response.data.message);
            setLoading(false);
            router.push('/dashboard');
          }
        })
        .catch((error) => {
          console.error('Login error:', error);
          setTimeout(() => {
            if (error.response?.data?.status_code === 400) {
              setLoginStatusMessage(error.response.data.results.errors[0].msg);
            } else {
              setLoginStatusMessage(error.response?.data?.message);
            }
            setLoading(false);
          }, 1000);
        });
    }
  };

  const renderForm = (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 8, width: '100%' }}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          autoFocus
          id="email"
          name="email"
          label="Email address"
          margin="normal"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="password"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
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
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={() => {
                setRemember((prev) => !prev);
              }}
              color="primary"
            />
          }
          label="Remember me"
        />
        <Link
          href="forgot_password"
          variant="subtitle2"
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Forgot password?
        </Link>
      </Stack>

      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mb: 1, minHeight: 20 }}
        color={loginStatus ? 'text.success' : 'error'}
        align="center"
      >
        {loginStatusMessage}
      </Typography>

      <LoadingButton
        fullWidth
        loading={loading}
        size="large"
        type="submit"
        variant="contained"
        sx={{ mb: 1 }}
      >
        Login
      </LoadingButton>

      {ssoProviders.length > 0 && (
        <>
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Or sign in with
            </Typography>
          </Divider>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            {ssoProviders.map((provider) => {
              const iconUrl = provider.iconUrl?.trim() || '';
              const label = provider.displayName?.trim() || provider.provider;
              return (
                <IconButton
                  key={provider.provider}
                  component="a"
                  href={`/auth/sso/${encodeURIComponent(provider.provider)}?state=${encodeURIComponent(window.location.origin)}`}
                  aria-label={label}
                  title={label}
                  sx={{
                    width: 56,
                    height: 56,
                    p: 0,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {iconUrl ? (
                    <Box
                      component="img"
                      src={iconUrl}
                      alt={label}
                      sx={{ width: 32, height: 32, objectFit: 'contain' }}
                    />
                  ) : (
                    <Iconify icon="eva:shield-outline" width={28} />
                  )}
                </IconButton>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        xs={false}
        sm={8}
        md={8.1}
        sx={{
          ...bgGradient({
            direction: '90deg',
            startColor: 'rgba(40, 121, 182, 0.55) 25%',
            middleColor: 'rgba(125, 194, 68, 0.55) 50%',
            endColor: 'rgb(238, 106, 49,0.55) 100%',
            imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
          }),
        }}
      />
      <CssBaseline />
      <Grid xs={12} sm={4} md={3.9} component={Paper} elevation={6} square>
        <Box
          sx={{
            height: 1,
            pt: { xs: 8, sm: 8, md: 9 },
            px: { xs: 3, sm: 2, md: 7 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Typography component="h1" variant="h5">
            <img src="/assets/logo/logo.png" alt="logo" height={100} />
          </Typography>
          {renderForm}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ position: 'absolute', bottom: 0 }}
          >
            <Typography color="text.disabled">
              Developed&nbsp;by&nbsp;
              <Link
                color="inherit"
                target="_blank"
                href="https://refex.co.in/"
                rel="noopener noreferrer"
              >
                Refex IT
              </Link>
              &nbsp;© {new Date().getFullYear()}
              &nbsp;|&nbsp;
              <Link color="inherit" target="_blank" href="/privacy_policy">
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import {
  Box,
  Link,
  Card,
  Stack,
  Switch,
  Divider,
  Container,
  TextField,
  Typography,
  Breadcrumbs,
  FormControlLabel,
} from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const EMPTY_CONFIG = {
  host: '',
  port: '',
  secure: true,
  user: '',
  password: '',
  fromEmail: '',
  fromName: '',
};

export default function SmtpConfigView() {
  const { enqueueSnackbar } = useSnackbar();
  const [smtpConfig, setSmtpConfig] = useState(EMPTY_CONFIG);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testMessage, setTestMessage] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await axios.get('/api/smtp-config');
        const cfg = res.data.results;
        if (cfg) {
          setSmtpConfig({
            host: cfg.host || '',
            port: cfg.port ?? '',
            secure: cfg.secure !== false,
            user: cfg.user || '',
            password: cfg.password || '',
            fromEmail: cfg.fromEmail || '',
            fromName: cfg.fromName || '',
          });
        }
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || error.message, { variant: 'error' });
      }
    };
    loadConfig();
  }, [enqueueSnackbar]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        host: smtpConfig.host.trim(),
        port: smtpConfig.port === '' ? null : Number(smtpConfig.port),
        secure: smtpConfig.secure,
        user: smtpConfig.user.trim(),
        fromEmail: smtpConfig.fromEmail.trim(),
        fromName: smtpConfig.fromName.trim(),
      };
      if (smtpConfig.password && smtpConfig.password !== '••••••') {
        payload.password = smtpConfig.password;
      }
      const res = await axios.put('/api/smtp-config', payload);
      const cfg = res.data.results;
      if (cfg) {
        setSmtpConfig({
          host: cfg.host || '',
          port: cfg.port ?? '',
          secure: cfg.secure !== false,
          user: cfg.user || '',
          password: cfg.password || '',
          fromEmail: cfg.fromEmail || '',
          fromName: cfg.fromName || '',
        });
      }
      enqueueSnackbar(res.data.message || 'SMTP configuration saved', {
        variant: res.data.status ? 'success' : 'error',
      });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail.trim()) {
      setTestMessage({ type: 'error', text: 'Enter a test email address' });
      return;
    }
    try {
      setTestLoading(true);
      setTestMessage(null);
      const res = await axios.post('/api/smtp-config/test', { testEmail: testEmail.trim() });
      setTestMessage({
        type: 'success',
        text: res.data.message || 'Test email sent successfully. Check the inbox (and spam).',
      });
    } catch (error) {
      setTestMessage({
        type: 'error',
        text: error?.response?.data?.message || error.message || 'Failed to send test email',
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            SMTP Configuration
          </Typography>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="/admin">
              Admin
            </Link>
            <Link underline="hover" color="inherit" href="/admin/settings">
              Settings
            </Link>
            <Typography color="text.primary">SMTP Config</Typography>
          </Breadcrumbs>
        </Box>
      </Stack>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Configure outgoing email for password resets and notifications. Save first, then use Test
          SMTP.
        </Typography>

        <Stack component="form" spacing={2.5} onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              <TextField
                required
                fullWidth
                size="small"
                label="SMTP Host"
                value={smtpConfig.host}
                onChange={(e) => setSmtpConfig((p) => ({ ...p, host: e.target.value }))}
                placeholder="smtp.gmail.com"
              />
            </Grid>
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Port"
                type="number"
                value={smtpConfig.port}
                onChange={(e) => setSmtpConfig((p) => ({ ...p, port: e.target.value }))}
                placeholder="465"
              />
            </Grid>
            <Grid xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={smtpConfig.secure}
                    onChange={(e) => setSmtpConfig((p) => ({ ...p, secure: e.target.checked }))}
                  />
                }
                label="Use SSL/TLS (secure)"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                required
                fullWidth
                size="small"
                label="SMTP User"
                value={smtpConfig.user}
                onChange={(e) => setSmtpConfig((p) => ({ ...p, user: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                type="password"
                label="SMTP Password"
                value={smtpConfig.password}
                onChange={(e) => setSmtpConfig((p) => ({ ...p, password: e.target.value }))}
                placeholder="Leave blank to keep existing"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="From Email"
                value={smtpConfig.fromEmail}
                onChange={(e) => setSmtpConfig((p) => ({ ...p, fromEmail: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="From Name"
                value={smtpConfig.fromName}
                onChange={(e) => setSmtpConfig((p) => ({ ...p, fromName: e.target.value }))}
                placeholder="GAMA AirOps"
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              type="submit"
              variant="outlined"
              color="success"
              loading={saving}
              startIcon={<Iconify icon="eva:save-fill" />}
            >
              Save SMTP Configuration
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={1}>
          Test SMTP
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Send a test email to verify your SMTP settings.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            fullWidth
            size="small"
            type="email"
            label="Test email address"
            value={testEmail}
            onChange={(e) => {
              setTestEmail(e.target.value);
              setTestMessage(null);
            }}
            placeholder="you@example.com"
          />
          <LoadingButton
            variant="contained"
            loading={testLoading}
            onClick={handleTest}
            sx={{ flexShrink: 0, minWidth: 140 }}
          >
            Test SMTP
          </LoadingButton>
        </Stack>

        {testMessage && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="body2"
              color={testMessage.type === 'success' ? 'success.main' : 'error.main'}
            >
              {testMessage.text}
            </Typography>
          </>
        )}
      </Card>
    </Container>
  );
}

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useToast } from '../hooks/useToast';
import api from '../api/api';
import { DataContext } from '../Context/DataContext';

const SignUpForm = () => {
  const { setLoggedIn } = useContext(DataContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const payload = { name, email, password, role };
    try {
      const res = await api.post('/users/register', payload,{withCredentials:true});
      setLoggedIn(true);
      if(setLoggedIn) console.log("Sign up is successful")
      if (res.status == 200) navigate('/home');
      showToast('Account created successfully.', 'success');
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '400px' },
        mx: 'auto',
        mt: '10vh',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        Sign Up
      </Typography>
      <form onSubmit={handleSignup}>
        <Stack spacing={3}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Select Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            fullWidth
            type="submit"
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(DataContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast, ToastComponent } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = { email, password };
    try {
      const res = await api.post('/users/login', payload);
      setLoggedIn(true);
      if (res.status === 200) navigate('/home');
      showToast('Login successful.', 'success');
      setEmail('');
      setPassword('');
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '400px' },
        mx: 'auto',
        mt: '10vh',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            fullWidth
            type="submit"
          >
            Login
          </Button>
        </Stack>
      </form>
      <Link to="/forgot-password" style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
        Forgot Password?
      </Link>
      {ToastComponent}
    </Box>
  );
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/forgot-password', { email });
      if (res.status === 200) {
        showToast('OTP sent to your email for password reset.', 'success');
        setOtpSent(true);
      }
    } catch (error) {
      showToast('Failed to send OTP. Try again later.', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/reset-password', { email, otp, newPassword });
      if (res.status === 200) {
        showToast('Password reset successfully.', 'success');
        navigate('/login');
      }
    } catch (error) {
      showToast('Failed to reset password. Please check the OTP and try again.', 'error');
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '90%', sm: '400px' },
        mx: 'auto',
        mt: '10vh',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid rgba(0, 0, 0, 0.12)', 
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        {otpSent ? 'Reset Password' : 'Forgot Password'}
      </Typography>
      <form onSubmit={otpSent ? handleResetPassword : handleForgotPassword}>
        <Stack spacing={3}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={otpSent}
          />
          {otpSent && (
            <>
              <TextField
                label="OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
              />
              <TextField
                label="New Password"
                variant="outlined"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
              />
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            fullWidth
            type="submit"
          >
            {otpSent ? 'Reset Password' : 'Send OTP'}
          </Button>
        </Stack>
      </form>
      {ToastComponent} {/* Render the toast here */}
    </Box>
  );
};

export { SignUpForm, LoginForm, ForgotPasswordForm };

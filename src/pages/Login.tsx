import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Email, PersonAdd } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, verifyCode, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      let success = false;
      
      if (tab === 0) {
        success = await login(email);
        setMessage(success ? 'Verification code sent to your email!' : 'Login failed');
      } else {
        success = await register(username, email);
        setMessage(success ? 'Registration successful! Check your email for verification code.' : 'Registration failed');
      }
      
      if (success) {
        setStep('verify');
      }
    } catch {
      setMessage('An error occurred');
    }
    
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const success = await verifyCode(code);
    
    if (success) {
      navigate('/');
    } else {
      setMessage('Invalid verification code');
    }
    
    setLoading(false);
  };

  if (step === 'verify') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Verify Email
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Enter the verification code sent to {email}
            </Typography>
            
            {message && (
              <Alert severity={message.includes('Invalid') ? 'error' : 'info'} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={loading || !code}
              size="large"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => setStep('input')}
              sx={{ mt: 1 }}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Minimal Chef
          </Typography>
          
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Login" icon={<Email />} />
            <Tab label="Register" icon={<PersonAdd />} />
          </Tabs>
          
          {message && (
            <Alert severity={message.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          
          {tab === 1 && (
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !email || (tab === 1 && !username)}
            size="large"
          >
            {loading ? 'Processing...' : tab === 0 ? 'Send Login Code' : 'Create Account'}
          </Button>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Passwordless authentication - we'll email you a code to login
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
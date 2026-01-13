import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import PredictionForm from './PredictionForm';
import './App.css';
import {
  Favorite,
  Warning,
  Info,
  Refresh,
  Download,
  Share,
  Timeline
} from '@mui/icons-material';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePrediction = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Failed to connect to the server. Make sure the backend is running on port 5000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (probability) => {
    if (probability < 30) return '#00ff88';
    if (probability < 60) return '#ffaa00';
    if (probability < 80) return '#ff3366';
    return '#ff0066';
  };

  const getRiskGradient = (probability) => {
    if (probability < 30) return 'linear-gradient(135deg, #00ff88, #00cc6a)';
    if (probability < 60) return 'linear-gradient(135deg, #ffaa00, #ff8800)';
    if (probability < 80) return 'linear-gradient(135deg, #ff3366, #ff0066)';
    return 'linear-gradient(135deg, #ff0066, #cc0052)';
  };

  const handleClearResults = () => {
    setResult(null);
    setError(null);
  };

  const handleExportReport = () => {
    // Export functionality placeholder
    alert('Report export feature would be implemented here');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f0b1f', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Favorite sx={{ fontSize: 40, color: '#ff3366' }} />
                <Box>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                    <span className="gradient-text">HeartRisk AI</span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#a5b4fc' }}>
                    Advanced Cardiovascular Disease Risk Assessment
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Timeline />} 
                  label="Real-time Analysis" 
                  sx={{ bgcolor: 'rgba(109, 40, 217, 0.2)', color: '#a5b4fc' }} 
                />
                <Chip 
                  icon={<Warning />} 
                  label="ML Powered" 
                  sx={{ bgcolor: 'rgba(255, 51, 102, 0.2)', color: '#ff85a2' }} 
                />
                <Chip 
                  icon={<Info />} 
                  label="12 Parameters" 
                  sx={{ bgcolor: 'rgba(0, 255, 136, 0.2)', color: '#85ffc7' }} 
                />
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
        </Box>

        <Grid container spacing={3}>
          {/* Left side - Form */}
          <Grid item xs={12} lg={6}>
            <PredictionForm onSubmit={handlePrediction} loading={loading} />
            
            {error && (
              <Paper elevation={0} className="glass-card" sx={{ mt: 3, p: 2 }}>
                <Alert 
                  severity="error"
                  action={
                    <Button color="inherit" size="small" onClick={() => setError(null)}>
                      DISMISS
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Paper>
            )}
          </Grid>

          {/* Right side - Results */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={0} className="glass-card" sx={{ height: '100%', minHeight: '600px' }}>
              {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="600px">
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <CircularProgress 
                      size={100} 
                      thickness={2}
                      sx={{ color: 'rgba(139, 92, 246, 0.2)' }}
                    />
                    <CircularProgress
                      variant="indeterminate"
                      size={100}
                      thickness={2}
                      sx={{
                        color: '#8b5cf6',
                        position: 'absolute',
                        left: 0,
                        animationDuration: '1.5s',
                      }}
                    />
                    <Favorite sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#ff3366',
                      fontSize: 40
                    }} />
                  </Box>
                  <Typography variant="h5" sx={{ color: '#a5b4fc', mb: 1 }}>
                    Analyzing Cardiovascular Data
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Processing 12 health parameters with ML algorithms...
                  </Typography>
                </Box>
              ) : result ? (
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                      Risk Assessment Report
                    </Typography>
                    <Box>
                      <IconButton onClick={handleExportReport} sx={{ color: '#a5b4fc' }}>
                        <Download />
                      </IconButton>
                      <IconButton onClick={handleClearResults} sx={{ color: '#a5b4fc' }}>
                        <Refresh />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Risk Score Display */}
                  <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Box sx={{ 
                      width: 200, 
                      height: 200, 
                      mx: 'auto', 
                      borderRadius: '50%',
                      background: getRiskGradient(result.probability),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 40px ${getRiskColor(result.probability)}50`,
                      mb: 2
                    }}>
                      <Box sx={{ 
                        width: 180, 
                        height: 180, 
                        borderRadius: '50%',
                        bgcolor: '#0f0b1f',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h1" sx={{ 
                          fontWeight: 'bold',
                          background: `linear-gradient(90deg, ${getRiskColor(result.probability)}, #ffffff)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {result.probability}%
                        </Typography>
                        <Typography variant="h6" sx={{ color: getRiskColor(result.probability), fontWeight: 'bold' }}>
                          {result.risk_category.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Risk Breakdown */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Paper elevation={0} className="glass-card" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>PREDICTION</Typography>
                        <Typography variant="h6" sx={{ color: '#ffffff' }}>{result.prediction}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper elevation={0} className="glass-card" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>CONFIDENCE</Typography>
                        <Typography variant="h6" sx={{ color: '#00ff88' }}>High</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Recommendations */}
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning sx={{ color: '#ffaa00' }} /> Health Recommendations
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {result.recommendations && result.recommendations.map((rec, index) => (
                      <Paper 
                        key={index} 
                        elevation={0}
                        className="glass-card"
                        sx={{ 
                          p: 2, 
                          mb: 1,
                          borderLeft: '3px solid',
                          borderColor: getRiskColor(result.probability),
                          transition: 'all 0.3s'
                        }}
                      >
                        <Typography sx={{ color: '#e2e8f0' }}>
                          {rec}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>

                  {/* Risk Indicators */}
                  <Paper elevation={0} className="glass-card" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>RISK INDICATORS</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {result.probability < 30 && ['✅ Low BP', '✅ Normal Cholesterol', '✅ Active Lifestyle'].map((item, idx) => (
                        <Chip key={idx} label={item} size="small" sx={{ bgcolor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }} />
                      ))}
                      {result.probability >= 30 && result.probability < 60 && ['⚠️ Monitor BP', '⚠️ Check Cholesterol', '💪 Increase Activity'].map((item, idx) => (
                        <Chip key={idx} label={item} size="small" sx={{ bgcolor: 'rgba(255, 170, 0, 0.1)', color: '#ffaa00' }} />
                      ))}
                      {result.probability >= 60 && ['❗ High Risk Factors', '❗ Medical Consult', '🏥 Regular Checkups'].map((item, idx) => (
                        <Chip key={idx} label={item} size="small" sx={{ bgcolor: 'rgba(255, 51, 102, 0.1)', color: '#ff3366' }} />
                      ))}
                    </Box>
                  </Paper>
                </CardContent>
              ) : (
                <Box sx={{ 
                  height: '600px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 3
                }}>
                  <Favorite sx={{ fontSize: 80, color: 'rgba(139, 92, 246, 0.3)', mb: 2 }} />
                  <Typography variant="h5" sx={{ color: '#a5b4fc', mb: 1, fontWeight: 'bold' }}>
                    Awaiting Patient Data
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                    Complete the form to generate a comprehensive cardiovascular risk assessment report.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Chip label="Real-time Analysis" sx={{ bgcolor: 'rgba(109, 40, 217, 0.2)', color: '#a5b4fc' }} />
                    <Chip label="ML Algorithm" sx={{ bgcolor: 'rgba(255, 51, 102, 0.2)', color: '#ff85a2' }} />
                    <Chip label="12 Parameters" sx={{ bgcolor: 'rgba(0, 255, 136, 0.2)', color: '#85ffc7' }} />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Paper elevation={0} className="glass-card" sx={{ mt: 4, p: 3 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
            ⚕️ This AI-powered tool provides cardiovascular risk assessment based on machine learning analysis. 
            It is intended for informational purposes only and is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or qualified health provider.
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: '#64748b', textAlign: 'center', mt: 1 }}>
            Model Version 2.1 | Accuracy: ~74.2% | Last Updated: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
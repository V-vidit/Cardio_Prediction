import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  IconButton,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScaleIcon from '@mui/icons-material/Scale';

const steps = ['Patient Info', 'Vitals', 'Lifestyle'];

const PredictionForm = ({ onSubmit, loading }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: 2,
    height: 170,
    weight: 70,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1,
    age: 50,
  });

  const [bmi, setBmi] = useState(24.22);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    setFormData(prev => {
      const newData = { ...prev, [field]: Number(value) };
      
      if (field === 'height' || field === 'weight') {
        const heightM = newData.height / 100;
        const calculatedBmi = newData.weight / (heightM * heightM);
        setBmi(calculatedBmi.toFixed(2));
      }
      
      return newData;
    });
  };

  const handleSliderChange = (field) => (event, newValue) => {
    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.checked ? 1 : 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      gender: 2,
      height: 170,
      weight: 70,
      ap_hi: 120,
      ap_lo: 80,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
      age: 50,
    });
    setBmi(24.22);
    setActiveStep(0);
  };

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return 'Normal';
    if (systolic < 130 && diastolic < 80) return 'Elevated';
    if (systolic < 140 || diastolic < 90) return 'Stage 1 Hypertension';
    return 'Stage 2 Hypertension';
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getAgeCategory = (age) => {
    if (age < 30) return 'Young Adult';
    if (age < 50) return 'Middle Age';
    if (age < 65) return 'Senior';
    return 'Elderly';
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#a5b4fc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FavoriteIcon /> Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleChange('gender')}
                  label="Gender"
                  sx={{ 
                    '& .MuiSelect-select': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' }
                  }}
                >
                  <MenuItem value={1}>Female</MenuItem>
                  <MenuItem value={2}>Male</MenuItem>
                  <MenuItem value={3}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, bgcolor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Age</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={formData.age}
                    onChange={handleSliderChange('age')}
                    min={18}
                    max={100}
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="h6" sx={{ color: '#ffffff', minWidth: 60 }}>
                    {formData.age}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#a5b4fc' }}>
                  {getAgeCategory(formData.age)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#a5b4fc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospitalIcon /> Health Measurements
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, bgcolor: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <HeightIcon sx={{ color: '#00ff88' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Height (cm)</Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.height}
                  onChange={handleChange('height')}
                  InputProps={{ 
                    inputProps: { min: 100, max: 250 },
                    sx: { color: '#ffffff' }
                  }}
                />
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, bgcolor: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MonitorWeightIcon sx={{ color: '#ffaa00' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Weight (kg)</Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.weight}
                  onChange={handleChange('weight')}
                  InputProps={{ 
                    inputProps: { min: 30, max: 200 },
                    sx: { color: '#ffffff' }
                  }}
                />
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" icon={<ScaleIcon />}>
                <Typography variant="body2">
                  <strong>BMI: {bmi}</strong> ({getBMICategory(bmi)}) • Height: {formData.height}cm • Weight: {formData.weight}kg
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: '#a5b4fc', mb: 2 }}>Blood Pressure</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, bgcolor: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Systolic</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Slider
                        value={formData.ap_hi}
                        onChange={handleSliderChange('ap_hi')}
                        min={80}
                        max={200}
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="h6" sx={{ color: '#ffffff', minWidth: 60 }}>
                        {formData.ap_hi}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, bgcolor: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Diastolic</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Slider
                        value={formData.ap_lo}
                        onChange={handleSliderChange('ap_lo')}
                        min={50}
                        max={120}
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="h6" sx={{ color: '#ffffff', minWidth: 60 }}>
                        {formData.ap_lo}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              <Alert 
                severity={
                  formData.ap_hi < 120 && formData.ap_lo < 80 ? "success" :
                  formData.ap_hi < 140 && formData.ap_lo < 90 ? "warning" : "error"
                }
                sx={{ mt: 2 }}
              >
                {getBloodPressureStatus(formData.ap_hi, formData.ap_lo)}
              </Alert>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#a5b4fc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmokingRoomsIcon /> Lifestyle & Medical
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Cholesterol</InputLabel>
                <Select
                  value={formData.cholesterol}
                  onChange={handleChange('cholesterol')}
                  label="Cholesterol"
                  sx={{ 
                    '& .MuiSelect-select': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' }
                  }}
                >
                  <MenuItem value={1}>Normal</MenuItem>
                  <MenuItem value={2}>Above Normal</MenuItem>
                  <MenuItem value={3}>Well Above Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Glucose</InputLabel>
                <Select
                  value={formData.gluc}
                  onChange={handleChange('gluc')}
                  label="Glucose"
                  sx={{ 
                    '& .MuiSelect-select': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' }
                  }}
                >
                  <MenuItem value={1}>Normal</MenuItem>
                  <MenuItem value={2}>Above Normal</MenuItem>
                  <MenuItem value={3}>Well Above Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="subtitle1" sx={{ color: '#a5b4fc', mb: 2 }}>Lifestyle Factors</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 51, 102, 0.1)' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.smoke === 1}
                            onChange={handleSwitchChange('smoke')}
                            color="error"
                          />
                        }
                        label={
                          <Box>
                            <SmokingRoomsIcon sx={{ mb: 0.5 }} />
                            <Typography variant="caption" display="block" sx={{ color: '#ffffff' }}>
                              Smoking
                            </Typography>
                          </Box>
                        }
                        labelPlacement="top"
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 170, 0, 0.1)' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.alco === 1}
                            onChange={handleSwitchChange('alco')}
                            color="warning"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="h6" sx={{ color: '#ffaa00' }}>🍷</Typography>
                            <Typography variant="caption" display="block" sx={{ color: '#ffffff' }}>
                              Alcohol
                            </Typography>
                          </Box>
                        }
                        labelPlacement="top"
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(0, 255, 136, 0.1)' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.active === 1}
                            onChange={handleSwitchChange('active')}
                            color="success"
                          />
                        }
                        label={
                          <Box>
                            <FitnessCenterIcon sx={{ color: '#00ff88' }} />
                            <Typography variant="caption" display="block" sx={{ color: '#ffffff' }}>
                              Active
                            </Typography>
                          </Box>
                        }
                        labelPlacement="top"
                      />
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Paper elevation={0} className="glass-card" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Patient Assessment Form
        </Typography>
        <Tooltip title="Reset Form">
          <IconButton onClick={handleReset} sx={{ color: '#a5b4fc' }}>
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ 
              '& .MuiStepLabel-label': { color: '#94a3b8 !important' },
              '& .MuiStepIcon-root.Mui-active': { color: '#8b5cf6' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#00ff88' }
            }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ color: '#a5b4fc' }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <LoadingButton
              type="submit"
              variant="contained"
              startIcon={<CalculateIcon />}
              loading={loading}
              loadingPosition="start"
              sx={{ px: 4 }}
            >
              Analyze Risk
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ px: 4 }}
            >
              Next
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default PredictionForm;
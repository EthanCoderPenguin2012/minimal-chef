import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  Mic,
  MicOff,
} from '@mui/icons-material';

// @ts-ignore: Allow use of webkitSpeechRecognition in browsers
// eslint-disable-next-line
const SpeechRecognitionType =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceChef = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const recipe = {
    title: 'Spaghetti Carbonara',
    steps: [
      'Bring a large pot of salted water to boil',
      'Cook spaghetti according to package directions until al dente',
      'While pasta cooks, whisk eggs and parmesan cheese in a bowl',
      'Cook pancetta in a large skillet until crispy',
      'Drain pasta, reserving 1 cup of pasta water',
      'Add hot pasta to the skillet with pancetta',
      'Remove from heat and quickly stir in egg mixture',
      'Add pasta water gradually until creamy',
      'Season with black pepper and serve immediately',
    ],
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new SpeechRecognitionType();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event: any) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.toLowerCase();

        if (transcript.includes('next')) {
          nextStep();
        } else if (
          transcript.includes('previous') ||
          transcript.includes('back')
        ) {
          previousStep();
        } else if (transcript.includes('repeat')) {
          speakStep(currentStep);
        }
      };

      setRecognition(speechRecognition);
    }
  }, [currentStep]);

  const speakStep = (stepIndex: number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(recipe.steps[stepIndex]);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
    } else {
      speakStep(currentStep);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Voice Chef
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {recipe.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Step {currentStep + 1} of {recipe.steps.length}
            </Typography>
            <Chip
              label={isListening ? 'Listening...' : 'Voice Commands Off'}
              color={isListening ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={((currentStep + 1) / recipe.steps.length) * 100}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 3, minHeight: '60px' }}>
            {recipe.steps[currentStep]}
          </Typography>

          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}
          >
            <IconButton onClick={previousStep} disabled={currentStep === 0}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={togglePlayback}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={nextStep}
              disabled={currentStep === recipe.steps.length - 1}
            >
              <SkipNext />
            </IconButton>
            <IconButton onClick={() => speakStep(currentStep)}>
              <VolumeUp />
            </IconButton>
            <IconButton
              onClick={toggleListening}
              color={isListening ? 'success' : 'default'}
            >
              {isListening ? <Mic /> : <MicOff />}
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            Say "next", "previous", or "repeat" while voice commands are active
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Steps
          </Typography>
          <List>
            {recipe.steps.map((step, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor:
                    index === currentStep ? 'action.selected' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={`${index + 1}. ${step}`}
                  sx={{ opacity: index === currentStep ? 1 : 0.7 }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VoiceChef;

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { PlayArrow, Pause, Stop, Remove, Alarm } from '@mui/icons-material';

const RecipeTimer = () => {
  const [timers, setTimers] = useState<
    Array<{
      id: number;
      name: string;
      duration: number;
      remaining: number;
      isActive: boolean;
    }>
  >([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.isActive && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1;
            if (newRemaining === 0) {
              new Notification(`Timer "${timer.name}" finished!`);
              return { ...timer, remaining: 0, isActive: false };
            }
            return { ...timer, remaining: newRemaining };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTimer = (name: string, minutes: number) => {
    const duration = minutes * 60;
    setTimers((prev) => [
      ...prev,
      {
        id: nextId,
        name,
        duration,
        remaining: duration,
        isActive: false,
      },
    ]);
    setNextId((prev) => prev + 1);
  };

  const toggleTimer = (id: number) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, isActive: !timer.isActive } : timer
      )
    );
  };

  const resetTimer = (id: number) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, remaining: timer.duration, isActive: false }
          : timer
      )
    );
  };

  const removeTimer = (id: number) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const presetTimers = [
    { name: 'Pasta', minutes: 8 },
    { name: 'Eggs', minutes: 3 },
    { name: 'Rice', minutes: 18 },
    { name: 'Bread', minutes: 25 },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipe Timers
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Alarm sx={{ mr: 1 }} />
        Set multiple cooking timers and get notifications when they finish
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Timers
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {presetTimers.map((preset) => (
              <Button
                key={preset.name}
                variant="outlined"
                size="small"
                onClick={() => addTimer(preset.name, preset.minutes)}
              >
                {preset.name} ({preset.minutes}m)
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {timers.map((timer) => (
        <Card key={timer.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">{timer.name}</Typography>
              <Chip
                label={
                  timer.remaining === 0 ? 'DONE!' : formatTime(timer.remaining)
                }
                color={
                  timer.remaining === 0
                    ? 'success'
                    : timer.isActive
                      ? 'primary'
                      : 'default'
                }
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={
                ((timer.duration - timer.remaining) / timer.duration) * 100
              }
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => toggleTimer(timer.id)}
                disabled={timer.remaining === 0}
              >
                {timer.isActive ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton onClick={() => resetTimer(timer.id)}>
                <Stop />
              </IconButton>
              <IconButton onClick={() => removeTimer(timer.id)} color="error">
                <Remove />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {timers.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          No active timers. Add one using the quick timers above!
        </Typography>
      )}
    </Box>
  );
};

export default RecipeTimer;

import { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, TextField, Button, Switch, FormControlLabel, Chip,
} from '@mui/material';

export default function ProfileSettings() {
  const [interests, setInterests] = useState(['LLM', 'AI Safety', 'NLP']);
  const [input, setInput] = useState('');

  const addInterest = () => {
    if (!input.trim()) return;
    setInterests((prev) => [...prev, input.trim()]);
    setInput('');
  };

  return (
    <Box>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Personal Info</Typography>
            <Avatar sx={{ width: 64, height: 64, mb: 1.5 }}>DU</Avatar>
            <TextField label="Name" fullWidth defaultValue="Dr. User" sx={{ mb: 1.2 }} />
            <TextField label="Email" fullWidth defaultValue="user@university.edu" sx={{ mb: 1.2 }} />
            <TextField label="Affiliation" fullWidth defaultValue="University Lab" sx={{ mb: 1.2 }} />
            <TextField label="Role" fullWidth defaultValue="Researcher" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Change Password</Typography>
            <TextField label="Current Password" type="password" fullWidth sx={{ mb: 1.2 }} />
            <TextField label="New Password" type="password" fullWidth sx={{ mb: 1.2 }} />
            <TextField label="Confirm Password" type="password" fullWidth />
          </Paper>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Notification Preferences</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
            <FormControlLabel control={<Switch defaultChecked />} label="In-app notifications" />
            <TextField select label="Frequency" fullWidth defaultValue="daily" sx={{ mt: 1 }}>
              <option value="instant">Instant</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
            </TextField>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Research Interests</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.2, flexWrap: 'wrap' }}>{interests.map((i) => <Chip key={i} label={i} onDelete={() => setInterests(interests.filter((x) => x !== i))} />)}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}><TextField label="Add keyword" value={input} onChange={(e) => setInput(e.target.value)} size="small" /><Button onClick={addInterest} variant="outlined">Add</Button></Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

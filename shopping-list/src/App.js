import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, IconButton, Box, Stack } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const App = () => {
  const [items, setItems] = useState([]); // Danh sách mặc định rỗng
  const [inputValue, setInputValue] = useState('');

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Shopping List
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Add an item..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <IconButton color="primary">
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};
export default App;
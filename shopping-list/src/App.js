import React, { useState } from 'react';
import { 
  Container, Paper, Typography, TextField, IconButton, 
  Box, List, ListItem, ListItemText, Checkbox, ListItemSecondaryAction 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const App = () => {
  const [items, setItems] = useState([]); 
  const [inputValue, setInputValue] = useState('');

  const handleAddButtonClick = () => {
    if (!inputValue.trim()) return;
    const newItem = { 
      itemName: inputValue.trim(), 
      quantity: 1, 
      isSelected: false 
    };
    setItems([...items, newItem]);
    setInputValue('');
  };

  // 1. Hàm Toggle trạng thái hoàn thành (Đoạn bạn yêu cầu)
  const toggleComplete = (index) => {
    const newItems = [...items];
    newItems[index].isSelected = !newItems[index].isSelected;
    setItems(newItems);
  };

  // 2. Hàm thay đổi số lượng (Đoạn bạn yêu cầu)
  const handleQuantityChange = (index, delta) => {
    const newItems = [...items];
    const newQty = newItems[index].quantity + delta;
    if (newQty >= 1) { // Đảm bảo không giảm xuống dưới 1
      newItems[index].quantity = newQty;
      setItems(newItems);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Shopping List
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            label="Add an item..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddButtonClick()}
          />
          <IconButton color="primary" onClick={handleAddButtonClick}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Box>

        <List>
          {items.map((item, index) => (
            <ListItem key={index} divider>
              {/* Checkbox để gọi hàm toggleComplete */}
              <Checkbox 
                checked={item.isSelected} 
                onChange={() => toggleComplete(index)} 
              />
              
              <ListItemText 
                primary={item.itemName} 
                sx={{ 
                  textDecoration: item.isSelected ? 'line-through' : 'none',
                  color: item.isSelected ? 'text.disabled' : 'text.primary'
                }}
              />

              {/* Khu vực nút bấm để gọi hàm handleQuantityChange */}
              <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" onClick={() => handleQuantityChange(index, -1)}>
                  <ChevronLeftIcon />
                </IconButton>
                
                <Typography sx={{ mx: 1, fontWeight: 'bold' }}>
                  {item.quantity}
                </Typography>
                
                <IconButton size="small" onClick={() => handleQuantityChange(index, 1)}>
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default App;
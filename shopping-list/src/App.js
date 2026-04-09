import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, IconButton, 
  Box, List, ListItem, ListItemText, Checkbox, 
  ListItemSecondaryAction, Alert, Divider, Stack 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const App = () => {
  const [items, setItems] = useState([]); 
  const [inputValue, setInputValue] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [error, setError] = useState(''); // State để quản lý thông báo lỗi trùng tên

  // 1. Logic tính tổng: Chỉ tính những mục CHƯA hoàn thành (isSelected === false)
  useEffect(() => {
    const total = items
      .filter(item => !item.isSelected) // Lọc lấy các món chưa tick
      .reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(total);
  }, [items]);

  // 2. Logic thêm món đồ: Kiểm tra trùng lặp
  const handleAddButtonClick = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Kiểm tra xem tên đã tồn tại chưa (không phân biệt hoa thường)
    const isDuplicate = items.some(
      (item) => item.itemName.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      setError('This item is already in the list!');
      return;
    }

    const newItem = { 
      itemName: trimmedValue, 
      quantity: 1, 
      isSelected: false 
    };

    setItems([...items, newItem]);
    setInputValue('');
    setError(''); // Xóa thông báo lỗi sau khi thêm thành công
  };

  const toggleComplete = (index) => {
    const newItems = [...items];
    newItems[index].isSelected = !newItems[index].isSelected;
    setItems(newItems);
  };

  const handleQuantityChange = (index, delta) => {
    const newItems = [...items];
    const newQty = newItems[index].quantity + delta;
    if (newQty >= 1) {
      newItems[index].quantity = newQty;
      setItems(newItems);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: '#fafafa' }}>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <ShoppingBagIcon color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2' }}>
            Shopping List
          </Typography>
        </Stack>

        {/* Khu vực nhập liệu & Hiển thị lỗi trùng tên */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Add an item..."
              variant="outlined"
              value={inputValue}
              error={!!error} // Viền đỏ nếu có lỗi
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(''); // Xóa lỗi khi người dùng bắt đầu gõ lại
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddButtonClick()}
            />
            <IconButton color="primary" onClick={handleAddButtonClick} sx={{ p: 1 }}>
              <AddCircleIcon sx={{ fontSize: 45 }} />
            </IconButton>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Danh sách hiển thị */}
        <List sx={{ minHeight: '150px' }}>
          {items.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
              Danh sách đang trống...
            </Typography>
          ) : (
            items.map((item, index) => (
              <ListItem 
                key={index} 
                divider 
                sx={{ bgcolor: item.isSelected ? '#f0f0f0' : 'white', borderRadius: 2, mb: 1 }}
              >
                <Checkbox 
                  checked={item.isSelected} 
                  onChange={() => toggleComplete(index)}
                  color="success"
                />
                <ListItemText 
                  primary={item.itemName} 
                  sx={{ 
                    textDecoration: item.isSelected ? 'line-through' : 'none',
                    color: item.isSelected ? 'text.disabled' : 'text.primary'
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton size="small" onClick={() => handleQuantityChange(index, -1)} disabled={item.isSelected}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography variant="body1" component="span" sx={{ mx: 1, fontWeight: 'bold' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => handleQuantityChange(index, 1)} disabled={item.isSelected}>
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>

        {/* Hiển thị tổng số lượng theo yêu cầu */}
        <Box sx={{ 
          mt: 3, p: 2, 
          bgcolor: '#e3f2fd', 
          borderRadius: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Total (Uncompleted):</Typography>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>
            {totalItemCount}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
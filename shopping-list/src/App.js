import React, { useState } from 'react';
import { 
  Container, Paper, Typography, TextField, IconButton, 
  Box, List, ListItem, ListItemText, Divider 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const App = () => {
  // 1. Khởi tạo State
  const [items, setItems] = useState([]); 
  const [inputValue, setInputValue] = useState('');

  // 2. Hàm xử lý khi click nút thêm (Đoạn bạn yêu cầu)
  const handleAddButtonClick = () => {
    if (!inputValue.trim()) return; // Không thêm nếu chỉ toàn khoảng trắng
    
    const newItem = { 
      itemName: inputValue.trim(), 
      quantity: 1, 
      isSelected: false 
    };

    setItems([...items, newItem]); // Cập nhật danh sách mới
    setInputValue(''); // Xóa nội dung trong ô nhập sau khi thêm
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Shopping List
        </Typography>

        {/* Khu vực nhập liệu */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            label="Add an item..."
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // Cho phép nhấn Enter để thêm
            onKeyPress={(e) => e.key === 'Enter' && handleAddButtonClick()}
          />
          <IconButton color="primary" onClick={handleAddButtonClick}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Box>

        <Divider />

        {/* Khu vực hiển thị danh sách (Đoạn bạn yêu cầu) */}
        <List>
          {items.length === 0 ? (
            <Typography align="center" sx={{ py: 3, color: 'text.secondary' }}>
              Your list is empty
            </Typography>
          ) : (
            items.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText 
                  primary={item.itemName} 
                  secondary={item.isSelected ? "Completed" : "Pending"}
                />
                <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold' }}>
                  {item.quantity}
                </Typography>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default App;
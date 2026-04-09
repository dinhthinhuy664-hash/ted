import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, IconButton, 
  List, ListItem, ListItemText, Checkbox, 
  ListItemSecondaryAction, Alert, Divider, Box, Stack 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Import kết nối Firebase
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  updateDoc, 
  doc, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

const App = () => {
  const [items, setItems] = useState([]); 
  const [inputValue, setInputValue] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [error, setError] = useState('');

  // 1. Lắng nghe dữ liệu Real-time từ Firestore
  useEffect(() => {
    const q = query(collection(db, "shopping-items"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArray = [];
      querySnapshot.forEach((doc) => {
        itemsArray.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArray);
    });

    return () => unsubscribe(); // Hủy lắng nghe khi component unmount
  }, []);

  // 2. Tự động tính tổng (Chỉ tính các món chưa hoàn thành)
  useEffect(() => {
    const total = items
      .filter(item => !item.isSelected)
      .reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(total);
  }, [items]);

  // 3. Hàm thêm món mới lên Firebase (Có check trùng tên)
  const handleAddButtonClick = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    const isDuplicate = items.some(
      (item) => item.itemName.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      setError('This item is already in the list!');
      return;
    }

    try {
      await addDoc(collection(db, "shopping-items"), {
        itemName: trimmedValue,
        quantity: 1,
        isSelected: false,
        createdAt: serverTimestamp() // Lưu thời gian để sắp xếp
      });
      setInputValue('');
      setError('');
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  // 4. Hàm Toggle hoàn thành lên Firebase
  const toggleComplete = async (id, currentStatus) => {
    const itemRef = doc(db, "shopping-items", id);
    await updateDoc(itemRef, { isSelected: !currentStatus });
  };

  // 5. Hàm thay đổi số lượng lên Firebase
  const handleQuantityChange = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      const itemRef = doc(db, "shopping-items", id);
      await updateDoc(itemRef, { quantity: newQty });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={10} sx={{ p: 4, borderRadius: 4, bgcolor: '#ffffff' }}>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
          <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', letterSpacing: 1 }}>
            MY SHOPPING LIST
          </Typography>
        </Stack>

        {/* Input Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="What do you need to buy?"
              variant="outlined"
              value={inputValue}
              error={!!error}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddButtonClick()}
            />
            <IconButton color="primary" onClick={handleAddButtonClick} sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}>
              <AddCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
          {error && <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>{error}</Alert>}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* List Section */}
        <List sx={{ minHeight: '200px' }}>
          {items.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 8, fontStyle: 'italic' }}>
              Your list is empty. Start adding items!
            </Typography>
          ) : (
            items.map((item) => (
              <ListItem 
                key={item.id} 
                divider 
                sx={{ 
                  mb: 1, 
                  borderRadius: 2, 
                  bgcolor: item.isSelected ? '#f8f9fa' : 'white',
                  transition: '0.3s'
                }}
              >
                <Checkbox 
                  checked={item.isSelected} 
                  onChange={() => toggleComplete(item.id, item.isSelected)}
                  color="success"
                />
                <ListItemText 
                  primary={item.itemName} 
                  sx={{ 
                    textDecoration: item.isSelected ? 'line-through' : 'none',
                    color: item.isSelected ? 'text.disabled' : 'text.primary'
                  }}
                />
                <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)} 
                    disabled={item.isSelected}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  
                  <Typography sx={{ mx: 1.5, fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)} 
                    disabled={item.isSelected}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>

        {/* Total Summary Section */}
        <Box sx={{ 
          mt: 4, p: 3, 
          bgcolor: '#1976d2', 
          color: 'white',
          borderRadius: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Items to Buy:</Typography>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {totalItemCount}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
import { useState } from 'react'
import axios from 'axios'
import type { StripeItem, CheckoutResponse, ErrorResponse } from './types/stripe'
import './App.css'

const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [items, setItems] = useState<StripeItem[]>([
    { priceId: 'price_1RZSZjRolsevXpbsgvNaEkiQ', quantity: 0 },  // RX-7
    { priceId: 'price_1RZQyKRolsevXpbsNj9RsI4z', quantity: 0 }   // レビン
  ]);

  const handleQuantityChange = (index: number, value: string): void => {
    const newItems = [...items];
    newItems[index].quantity = parseInt(value) || 0;
    setItems(newItems);
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const selectedItems = items.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      alert('どちらかの商品を選択してください');
      return;
    }
    
    try {
      const response = await axios.post<CheckoutResponse>(`${API_BASE_URL}/create-checkout-session`, {
        items: selectedItems
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data 
        ? (error.response.data as ErrorResponse).error 
        : 'エラーが発生しました';
      alert(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h1>商品選択</h1>
      <form onSubmit={handleCheckout}>
        <div style={{ marginBottom: '20px' }}>
          <h3>おみやげRX-7</h3>
          <p>700万円</p>
          <label>
            数量:
            <input
              type="number"
              value={items[0].quantity}
              onChange={(e) => handleQuantityChange(0, e.target.value)}
              min="0"
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>おみやげレビン</h3>
          <p>250万円</p>
          <label>
            数量:
            <input
              type="number"
              value={items[1].quantity}
              onChange={(e) => handleQuantityChange(1, e.target.value)}
              min="0"
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <button 
          type="submit"
          style={{
            backgroundColor: '#6772e5',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          チェックアウト
        </button>
      </form>
    </div>
  )
}

export default App

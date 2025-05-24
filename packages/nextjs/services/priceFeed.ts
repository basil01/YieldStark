const PRAGMA_API_KEY = 'FHVBLftpfYWWqgOuOkD28gJ9DZixgSl4';
const PRAGMA_API_URL = 'https://api.devnet.pragma.build/node/v1';
const PRAGMA_WS_URL = 'wss://ws.devnet.pragma.build/node/v1';

export interface PriceData {
  components: {
    price: string;
    source: string;
    timestamp: number;
  }[];
  decimals: number;
  num_sources_aggregated: number;
  pair_id: string;
  price: string;
  timestamp: number;
}

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds
let reconnectTimeout: NodeJS.Timeout | null = null;

const connectWebSocket = (onMessage: (data: PriceData) => void, onError: (error: string) => void) => {
  if (ws) {
    console.log('Closing existing WebSocket connection');
    ws.close();
    ws = null;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  try {
    console.log('Connecting to WebSocket...');
    ws = new WebSocket(PRAGMA_WS_URL);
    
    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      reconnectAttempts = 0;
      
      // Subscribe to BTC-USD price updates
      const subscribeMessage = {
        type: 'subscribe',
        pair: 'BTC-USD',
        api_key: PRAGMA_API_KEY
      };
      
      try {
        console.log('Sending subscribe message:', subscribeMessage);
        ws?.send(JSON.stringify(subscribeMessage));
      } catch (error) {
        console.error('Error sending subscribe message:', error);
        onError('Failed to subscribe to price updates');
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        
        // Check if the message is a price update
        if (data.price && data.pair_id === 'BTC-USD') {
          onMessage(data as PriceData);
        } else {
          console.log('Received non-price message:', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        onError('Error processing price update');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError('Connection error - Retrying...');
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        
        reconnectTimeout = setTimeout(() => {
          connectWebSocket(onMessage, onError);
        }, RECONNECT_DELAY);
      } else {
        console.log('Max reconnection attempts reached');
        onError('Connection lost - Please refresh the page');
      }
    };
  } catch (error) {
    console.error('Error creating WebSocket:', error);
    onError('Failed to establish connection');
  }
};

export const getBTCPrice = async (): Promise<PriceData> => {
  try {
    console.log('Fetching initial BTC price...');
    const response = await fetch(`${PRAGMA_API_URL}/prices/latest?pair=BTC-USD`, {
      method: 'GET',
      headers: {
        'x-api-key': PRAGMA_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch price: ${response.status}`);
    }

    const data = await response.json();
    console.log('Initial price fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    throw error;
  }
};

export const subscribeToPriceUpdates = (
  onPriceUpdate: (data: PriceData) => void,
  onError: (error: string) => void
) => {
  console.log('Setting up price subscription...');
  connectWebSocket(onPriceUpdate, onError);
  
  return () => {
    console.log('Cleaning up WebSocket connection...');
    if (ws) {
      ws.close();
      ws = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };
};

// Helper function to convert hex price to decimal
export const hexToDecimal = (hexPrice: string): number => {
  try {
    // Remove '0x' prefix if present
    const cleanHex = hexPrice.startsWith('0x') ? hexPrice.slice(2) : hexPrice;
    const decimalPrice = parseInt(cleanHex, 16);
    return decimalPrice / Math.pow(10, 18); // Assuming 18 decimals
  } catch (error) {
    console.error('Error converting hex price:', error);
    return 0;
  }
};

// Function to format price with 2 decimal places
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}; 
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { RecoilRoot } from 'recoil';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Adjust path if needed

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </ThemeProvider>
    </RecoilRoot>
  // </StrictMode>
);

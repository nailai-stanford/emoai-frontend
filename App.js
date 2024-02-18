import * as React from 'react';
import {AuthenticationProvider} from './src/providers/AuthenticationProvider';
import { CartContextProvider } from './src/providers/CartContextProvider';
import { TaskStatusProvider } from './src/providers/TaskContextProvider';

import {AppContent} from './src/AppContent';
import {ModalPortal} from 'react-native-modals';
import {StripeProvider} from '@stripe/stripe-react-native';

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51OcfN1L5ulKo7XnL8DdBR4GX6xuSUQf7z1ggD3OyfgpxzsrP3r643O7u9wVD1lJGWYHWvgKBwOq9oM0oBzOCt85Z00yP4sRSOW">
      <AuthenticationProvider>
        <CartContextProvider>
          <TaskStatusProvider>
            <AppContent />
            <ModalPortal />
          </TaskStatusProvider>
        </CartContextProvider>
      </AuthenticationProvider>
    </StripeProvider>
  );
}

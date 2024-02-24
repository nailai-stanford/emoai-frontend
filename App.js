import * as React from 'react';
import {AuthenticationProvider} from './src/providers/AuthenticationProvider';
import { CartContextProvider } from './src/providers/CartContextProvider';
import { TaskStatusProvider } from './src/providers/TaskContextProvider';

import {AppContent} from './src/AppContent';
import {ModalPortal} from 'react-native-modals';
import {StripeProvider} from '@stripe/stripe-react-native';
import { ToastProvider } from 'react-native-toast-notifications'

export default function App() {
  return (
    <StripeProvider publishableKey="pk_live_51Ogh2DGn4Xylrbu3e20kvPFBxXZI0AwK7YbSj8oKPn1M14SgB8iaKktxVsK4nAYn2tve3AKgQadak5thZ7jlZsu600HCPHMiuh">
      <AuthenticationProvider>
        <ToastProvider>
          <CartContextProvider>
            <TaskStatusProvider>
              <AppContent />
              <ModalPortal />
            </TaskStatusProvider>
          </CartContextProvider>
        </ToastProvider>
      </AuthenticationProvider>
    </StripeProvider>
  );
}

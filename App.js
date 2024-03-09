import * as React from 'react';
import {AuthenticationProvider} from './src/providers/AuthenticationProvider';
import { CartContextProvider } from './src/providers/CartContextProvider';

import {AppContent} from './src/AppContent';
import {ModalPortal} from 'react-native-modals';
import {StripeProvider} from '@stripe/stripe-react-native';
import { ToastProvider } from 'react-native-toast-notifications'
import { LocalLoginStatusContextProvider } from './src/providers/LocalLoginStatusContextProvider';

export default function App() {
  return (
    <StripeProvider publishableKey="pk_live_51Ogh2DGn4Xylrbu3e20kvPFBxXZI0AwK7YbSj8oKPn1M14SgB8iaKktxVsK4nAYn2tve3AKgQadak5thZ7jlZsu600HCPHMiuh">
      <AuthenticationProvider>
        <ToastProvider>
          <CartContextProvider>
            <LocalLoginStatusContextProvider>
              <AppContent />
              <ModalPortal />
            </LocalLoginStatusContextProvider>
          </CartContextProvider>
        </ToastProvider>
      </AuthenticationProvider>
    </StripeProvider>
  );
}

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
    <StripeProvider publishableKey="pk_test_51Ogh2DGn4Xylrbu3bN8sXhkSyf3QRe6ZZkn5TdPd7T0OSwz7ub8Tg3oPXgkPpRSJEiBlZ1sqzNPhEfFivA2DIdIs00Sapta1nZ">
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

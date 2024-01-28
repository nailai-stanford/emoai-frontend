import * as React from 'react';
import {AuthenticationProvider} from './src/providers/AuthenticationProvider';
import {DesignProvider} from './src/providers/DesignProvider';
import {TagsProvider} from './src/providers/TagsProvider';
import {AppContent} from './src/AppContent';
import {ModalPortal} from 'react-native-modals';
import {StripeProvider} from '@stripe/stripe-react-native';
import {StyleSheet, ImageBackground} from 'react-native';
import {Image} from 'react-native-elements';
import {Dimensions} from 'react-native';

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51OcfN1L5ulKo7XnL8DdBR4GX6xuSUQf7z1ggD3OyfgpxzsrP3r643O7u9wVD1lJGWYHWvgKBwOq9oM0oBzOCt85Z00yP4sRSOW">
      <AuthenticationProvider>
        <DesignProvider>
          <TagsProvider>
            <AppContent />
            <ModalPortal />
          </TagsProvider>
        </DesignProvider>
      </AuthenticationProvider>
    </StripeProvider>
  );
}

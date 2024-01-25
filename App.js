import * as React from "react";
import { AuthenticationProvider } from "./src/providers/AuthenticationProvider";
import { DesignProvider } from "./src/providers/DesignProvider";
import { TagsProvider } from "./src/providers/TagsProvider"; 
import { AppContent } from "./src/AppContent";
import { ModalPortal } from 'react-native-modals';

import { StyleSheet, ImageBackground } from "react-native";
import { Image } from "react-native-elements";
import { Dimensions } from 'react-native'


export default function App() {
  return (

    <AuthenticationProvider>
      <DesignProvider>
        <TagsProvider>
          <AppContent />
          <ModalPortal />
        </TagsProvider>
      </DesignProvider>
    </AuthenticationProvider>
  );


}

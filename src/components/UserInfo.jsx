import axios from "axios";
import React from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";

import { APIs, getHeader } from "../utils/API";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";

export const UserInfo = (props) => {
  const { userInfo, signout } = useAuthenticationContext();
  const { onSignout } = props;
  const headers = getHeader(userInfo.idToken);

  const avatarSize = 110;

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          width: "100%",
          height: avatarSize,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}>
          <Image
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            }}
            source={{
              uri: userInfo && userInfo.user.photo,
            }}
          />
        </View>
        <View style={{ flex: 2, alignSelf: "center", marginLeft: 20 }}>
          <MenuHeader>{userInfo && userInfo.user.name}</MenuHeader>
          <P $colored={true} $alignLeft={true}>Modern Artist</P>
          <ButtonAction $isWhite={true} style={{alignSelf: "flex-start", marginLeft:0}}
            onPress={() => {
              signout();
              onSignout();
            }}>
              <P style={{color:COLORS.white}}>Sign Out</P>
          </ButtonAction>
        </View>
      </View>

      

      <View
        style={{
          marginTop: 20,
          height: 100,
          paddingVertical: 20,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <P style={{ flex: 1 }}>68</P>
          <P style={{ flex: 1, fontWeight: "bold" }}>Collection</P>
        </View>

        <View
          style={{
            flex: 1,
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <P style={{ flex: 1}}>245</P>
          <P style={{ flex: 1, fontWeight: "bold" }}>
            My Design
          </P>
        </View>

        <View
          style={{
            flex: 1,
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <P style={{ flex: 1}}>25</P>
          <P style={{ flex: 1, alignSelf: "center", fontWeight: "bold" }}>Followers</P>
        </View>
      </View>
      {/* <ButtonAction
        onPress={() => {
          signout();
          onSignout();
        }}>
          <P style={{color:COLORS.white}}>Sign Out</P>
      </ButtonAction> */}
    </View>
  );
};

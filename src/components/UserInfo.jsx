import React from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";

import { useAuthenticationContext } from "../providers/AuthenticationProvider";

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, GradientP} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";
import { useLocalLoginStatusContext } from "../providers/LocalLoginStatusContextProvider";

export const UserInfo = (props) => {
  const {myDesignNum, myCollectionNum, followersNum} = props;
  const { userInfo, signout } = useAuthenticationContext();
  const { onSignout } = props;
  const {localLogin} = useLocalLoginStatusContext()

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
              uri: localLogin && userInfo && userInfo.user.photo ? userInfo.user.photo : "https://emobackend.s3.amazonaws.com/app_assets/portrait-frog2.jpg",
            }}
          />
        </View>
        <View style={{ flex: 2, alignSelf: "center", marginLeft: 20 }}>
          <MenuHeader>{localLogin ? userInfo.user.name : "Visitor"}</MenuHeader>
          {localLogin && <GradientP $colored={true} $alignLeft={true}>Modern Artist</GradientP>}
          {localLogin && <ButtonAction $isWhite={true} style={{alignSelf: "flex-start", marginLeft:0}}
            onPress={() => {
              signout();
              onSignout();
            }}>
              <P style={{color:COLORS.white}}>Sign Out</P>
          </ButtonAction>
          }
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
          <P style={{ flex: 1 }}>{localLogin ? myCollectionNum : 0}</P>
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
          <P style={{ flex: 1}}>{localLogin ? myDesignNum: 0}</P>
          <P style={{ flex: 1, fontWeight: "bold" }}>
            My Design
          </P>
        </View>

        {/* <View
          style={{
            flex: 1,
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <P style={{ flex: 1}}>0</P>
          <P style={{ flex: 1, alignSelf: "center", fontWeight: "bold" }}>Followers</P>
        </View> */}
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

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AiIcon from "../icons/aiIcon";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface ButtonMainTalkProps {
  scrollY?: number;
}

const ButtonMainTalk = ({ scrollY }: ButtonMainTalkProps) => {
  const router = useRouter();

  //States
  const [isHidden, setIsHidden] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  //Effects

  useEffect(() => {
    const triggerY = 90;
    //console.log("scrollY", scrollY);

    Animated.timing(fadeAnim, {
      toValue: !scrollY ? 1000000 : scrollY < triggerY ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();

    if (scrollY) {
        if (scrollY < triggerY) {
          setIsHidden(false);
        } else {
          setTimeout(() => {
            setIsHidden(true);
          }, 150);
        }
    }



  }, [scrollY, fadeAnim]);

  const handleOpenChat = () => {
    router.navigate({
      pathname: "/home/chat",
      params: {
        from: "dashboard",
      },
    });
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["#00000000", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.9 }}
    >
      {
        !isHidden &&
        <TouchableWithoutFeedback onPress={handleOpenChat}>
          <Animated.View style={[styles.button, { opacity: fadeAnim }]}>
            <Text style={styles.text}> Let's talk.. </Text>
            <AiIcon />
          </Animated.View>
        </TouchableWithoutFeedback>
      }
    </LinearGradient>
  );
};

export default ButtonMainTalk;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,

    width: "100%",
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
  },

  button: {
    width: "100%",
    height: 60,
    borderRadius: 30,

    paddingLeft: 20,
    paddingRight: 20,

    backgroundColor: "#242224",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF60",
    fontSize: 18,
    fontFamily: "MontserratMedium",
  },
});

import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Rect, Text } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const LOGO_WIDTH = Math.min(150, width * 0.4);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    );

    const timer = setTimeout(() => {
      router.navigate("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedSvg
        width="129"
        height="79"
        viewBox="0 0 129 79"
        fill="none"
        style={animatedStyle}
      >
        <Rect
          x="0.138153"
          y="0.614746"
          width="128"
          height="77.8769"
          rx="38.9384"
          fill="#0061FF"
        />
        <Path
          d="M24.035 54.0562V25.0504H42.2258V30.1057H29.0903V35.9897H39.5117V41.045H29.0903V49.0009H42.2258V54.0562H24.035Z"
          fill="white"
        />
        <Path
          d="M56.6151 54.0562L46.0901 25.0504H51.4562L59.8472 48.1515L68.2588 25.0504H73.6042L63.0792 54.0562H56.6151Z"
          fill="white"
        />
        <Path
          d="M89.9456 54.5949C87.9842 54.5949 86.1403 54.2082 84.4137 53.4347C82.6872 52.6474 81.1679 51.5631 79.8557 50.1819C78.5435 48.8007 77.5145 47.2053 76.7686 45.3959C76.0228 43.5727 75.6498 41.6252 75.6498 39.5533C75.6498 37.4815 76.0228 35.5408 76.7686 33.7314C77.5145 31.9082 78.5435 30.306 79.8557 28.9248C81.1679 27.5435 82.6872 26.4662 84.4137 25.6927C86.1403 24.9054 87.9842 24.5117 89.9456 24.5117C91.9207 24.5117 93.7716 24.9054 95.4981 25.6927C97.2247 26.4662 98.744 27.5435 100.056 28.9248C101.368 30.306 102.39 31.9082 103.123 33.7314C103.868 35.5408 104.241 37.4815 104.241 39.5533C104.241 41.6252 103.868 43.5727 103.123 45.3959C102.39 47.2053 101.368 48.8007 100.056 50.1819C98.744 51.5631 97.2247 52.6474 95.4981 53.4347C93.7716 54.2082 91.9207 54.5949 89.9456 54.5949ZM89.9456 49.5396C91.2163 49.5396 92.4111 49.2772 93.5299 48.7523C94.6487 48.2274 95.6293 47.5092 96.4719 46.5976C97.3283 45.6722 97.9912 44.6086 98.4609 43.407C98.9443 42.2053 99.186 40.9207 99.186 39.5533C99.186 38.1859 98.9443 36.9014 98.4609 35.6997C97.9774 34.4842 97.3075 33.4207 96.4512 32.509C95.6086 31.5974 94.6279 30.8792 93.5091 30.3543C92.4042 29.8295 91.2163 29.567 89.9456 29.567C88.6748 29.567 87.4801 29.8295 86.3613 30.3543C85.2425 30.8792 84.2549 31.6043 83.3985 32.5298C82.556 33.4414 81.893 34.498 81.4096 35.6997C80.94 36.9014 80.7051 38.1859 80.7051 39.5533C80.7051 40.9346 80.9469 42.226 81.4303 43.4277C81.9137 44.6293 82.5767 45.6929 83.4193 46.6183C84.2756 47.5299 85.2563 48.2482 86.3613 48.773C87.4801 49.2841 88.6748 49.5396 89.9456 49.5396Z"
          fill="white"
        />
      </AnimatedSvg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010616",
    justifyContent: "center",
    alignItems: "center",
  },
});

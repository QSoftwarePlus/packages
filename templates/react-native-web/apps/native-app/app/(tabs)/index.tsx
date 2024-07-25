import React from "react";
import { Image, StyleSheet, Platform, Text } from "react-native";
import { ParallaxScrollView, View } from "ui";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import ProtectedRoute from "@/ui/custom/ProtectedRoute";

export function HelloWave() {
  const rotationAnimation = useSharedValue(0);

  rotationAnimation.value = withRepeat(
    withSequence(
      withTiming(25, { duration: 150 }),
      withTiming(0, { duration: 150 })
    ),
    4 // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text>👋</Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <ProtectedRoute>
      <ParallaxScrollView
        headerImage={
          <Image
            source={require("../../assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <View className="flex-1 justify-center items-center bg-secondary">
          <Text>Welcome!!!!</Text>
          <HelloWave />
        </View>
        <View style={styles.stepContainer}>
          <Text>Step 1: Try it</Text>
          <Text>
            Edit <Text>app/(tabs)/index.tsx</Text> to see changes. Press{" "}
            <Text>
              {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
            </Text>{" "}
            to open developer tools.
          </Text>
        </View>
        <View style={styles.stepContainer}>
          <Text>Step 2: Explore</Text>
          <Text>
            Tap the Explore tab to learn more about what's included in this
            starter app.
          </Text>
        </View>
        <View style={styles.stepContainer}>
          <Text>Step 3: Get a fresh start</Text>
          <Text>
            When you're ready, run <Text>npm run reset-project</Text> to get a
            fresh <Text>app</Text> directory. This will move the current{" "}
            <Text>app</Text> to <Text>app-example</Text>.
          </Text>
        </View>
      </ParallaxScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";

function HomePage() {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
    </View>
  );
}

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

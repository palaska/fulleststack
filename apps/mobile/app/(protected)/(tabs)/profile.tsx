import { signOut } from "@/lib/auth-client";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

function ProfilePage() {
  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
}

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

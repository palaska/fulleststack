import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { signOut } from "@/lib/auth-client";
import { Button } from "react-native";

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

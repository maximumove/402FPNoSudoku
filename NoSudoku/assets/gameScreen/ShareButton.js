import React from "react";
import { View, Button, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

const ShareButton = ({ seed }) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(seed);
    Alert.alert("Copied!", `Seed "${seed}" is ready to paste`);
  };

  return (
    <View>
      <Button title="Share Seed" onPress={copyToClipboard} />
    </View>
  );
};

export default ShareButton;

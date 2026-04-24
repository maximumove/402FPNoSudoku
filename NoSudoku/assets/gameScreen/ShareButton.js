import React from "react";
import { View, Button, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useSeed } from "../../context/SeedContext";

const ShareButton = ({ seed }) => {
  const { seed: globalSeed } = useSeed();
  const activeSeed = seed ?? globalSeed;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(String(activeSeed));
    Alert.alert("Copied!", `Seed "${activeSeed}" is ready to paste`);
  };

  return (
    <View>
      <Button title="Share Seed" onPress={copyToClipboard} />
    </View>
  );
};

export default ShareButton;

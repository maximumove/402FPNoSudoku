import React, { useContext } from "react";
import { View, Button, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useGame } from "../../context/GameContext";

const ShareButton = () => {
  const { seed } = useGame();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(String(seed));
    Alert.alert("Copied!", `Seed "${seed}" is ready to paste`);
  };

  return (
    <View>
      <Button title="Share Seed" onPress={copyToClipboard} />
    </View>
  );
};

export default ShareButton;

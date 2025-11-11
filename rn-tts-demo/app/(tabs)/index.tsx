import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_KEY = "tts_text_draft_v1";

export default function App() {
  const [text, setText] = useState("Hello! This is a Text to Speech demo.");
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(DRAFT_KEY);
      if (saved) setText(saved);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(DRAFT_KEY, text).catch(() => {});
  }, [text]);

  const speak = () => {
    if (!text.trim()) return;
    setSpeaking(true);
    Speech.speak(text.trim(), {
      language: "en-US",
      pitch,
      rate: Platform.OS === "ios" ? rate : Math.min(rate, 1.5),
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const stop = () => {
    Speech.stop();
    setSpeaking(false);
  };

  const bump = (setter: any, val: number, min: number, max: number) => {
    setter((prev: number) => {
      const next = Math.max(min, Math.min(max, Number((prev + val).toFixed(2))));
      return next;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 70, paddingHorizontal: 18 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>Text to Speech Demo</Text>
      <Text style={{ color: "#666", marginBottom: 16 }}>
        Type some text and let the device read it aloud. Adjust pitch and rate to hear the difference.
      </Text>

      <Text style={{ fontWeight: "600" }}>Text</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter text to speak..."
        multiline
        style={{
          marginTop: 6,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
          height: 140,
          textAlignVertical: "top",
          fontSize: 16,
          backgroundColor: "#fafafa",
        }}
      />

      {/* Pitch */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
        <Text style={{ width: 70, fontWeight: "600" }}>Pitch</Text>
        <TouchableOpacity
          onPress={() => bump(setPitch, -0.1, 0.5, 2.0)}
          style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginRight: 8 }}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={{ width: 60, textAlign: "center" }}>{pitch.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={() => bump(setPitch, +0.1, 0.5, 2.0)}
          style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginLeft: 8 }}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      {/* Rate*/}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <Text style={{ width: 70, fontWeight: "600" }}>Rate</Text>
        <TouchableOpacity
          onPress={() => bump(setRate, -0.1, 0.1, 2.0)}
          style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginRight: 8 }}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={{ width: 60, textAlign: "center" }}>{rate.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={() => bump(setRate, +0.1, 0.1, 2.0)}
          style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginLeft: 8 }}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      {/* button*/}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <TouchableOpacity
          onPress={speak}
          disabled={speaking || !text.trim()}
          style={{
            backgroundColor: speaking || !text.trim() ? "#cbd3ff" : "#2f6fed",
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 10,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>{speaking ? "Speaking..." : "Speak"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stop}
          style={{
            backgroundColor: "#ff6b6b",
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Stop</Text>
        </TouchableOpacity>
      </View>

      {/* note*/}
//       <Text style={{ marginTop: 12, color: "#888" }}>
//         Tip: Different platforms and voices may sound slightly different. Try changing pitch and rate.
//       </Text>
    </View>
  );
}

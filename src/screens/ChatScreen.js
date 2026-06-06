import React, { useEffect, useState, useContext } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import { io } from "socket.io-client";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function ChatScreen({ route }) {
  const { user } = useContext(AuthContext);
  const { matchId } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Conectar a Socket.io
  //////
  const socket = io("http://192.168.1.15:4000"); // tu IP local
  //////

  useEffect(() => {
    socket.emit("joinRoom", matchId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Cargar historial
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await API.get(`/api/message/${matchId}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msgData = { roomId: matchId, message: newMessage, senderId: user.id };
    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.senderId === user.id && styles.myMessage]}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe un mensaje..."
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: { padding: 10, backgroundColor: "#eee", borderRadius: 10, marginVertical: 5 },
  myMessage: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, padding: 10, marginRight: 10 },
});
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
	const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>Iniciar sesión</Text>

      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, width: "100%", padding: 10, marginBottom: 15, borderRadius: 8 }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={{ borderWidth: 1, width: "100%", padding: 10, marginBottom: 15, borderRadius: 8 }}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "tomato", padding: 15, borderRadius: 8, width: "100%" }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ marginTop: 15, color: "blue" }}>Crear una cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
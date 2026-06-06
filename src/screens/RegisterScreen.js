import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
	const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
	const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      Alert.alert("Cuenta creada", "Ya puedes iniciar sesión");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "No se pudo registrar");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>Crear cuenta</Text>

      <TextInput
        placeholder="Nombre"
        style={{ borderWidth: 1, width: "100%", padding: 10, marginBottom: 15, borderRadius: 8 }}
        value={name}
        onChangeText={setName}
      />
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
        onPress={handleRegister}
        style={{ backgroundColor: "tomato", padding: 15, borderRadius: 8, width: "100%" }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 15, color: "blue" }}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
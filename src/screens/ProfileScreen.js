import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");

  // Cargar datos del perfil
  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/user/me");
      setProfile(res.data);
      setName(res.data.name || "");
      setBio(res.data.bio || "");
      setPhoto(res.data.photo || "");
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Actualizar perfil
  const saveProfile = async () => {
    try {
      await API.put("/api/user/me", { name, bio, photo });
      Alert.alert("✅ Perfil actualizado");
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      Alert.alert("❌ Error al actualizar perfil");
    }
  };

  // Elegir imagen desde galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  if (!profile) return <Text style={{ margin: 20 }}>Cargando perfil...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <Image
        source={{ uri: user.photos?.find(p => p.isPrimary)?.url || "https://placekitten.com/200" }}
        style={styles.photo}
      />

      <Button title="Cambiar foto" onPress={pickImage} />

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Biografía</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <Button title="Guardar cambios" onPress={saveProfile} />

			<View style={{ marginTop: 30 }}>
				<Button title="Gestionar fotos" onPress={() => navigation.navigate("Photos")} />
			</View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { alignSelf: "flex-start", marginTop: 15, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginTop: 5,
  },
  photo: { width: 150, height: 150, borderRadius: 75, marginBottom: 15 },
});
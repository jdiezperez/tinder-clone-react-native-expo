import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import API from "../api/api";

export default function PhotoManagerScreen() {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    try {
      const res = await API.get("/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error("Error al obtener fotos:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const addPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhoto = { url: result.assets[0].uri };
      await API.post("/api/photos", newPhoto);
      fetchPhotos();
    }
  };

  const deletePhoto = async (id) => {
    Alert.alert("Eliminar", "¿Seguro que deseas eliminar esta foto?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          await API.delete(`/api/photos/${id}`);
          fetchPhotos();
        },
      },
    ]);
  };

  const makePrimary = async (id) => {
    await API.put(`/api/photos/${id}/primary`);
    fetchPhotos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Fotos</Text>

      <Button title="Añadir nueva foto" onPress={addPhoto} />

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={() => makePrimary(item.id)}>
              <Image source={{ uri: item.url }} style={styles.photo} />
            </TouchableOpacity>
            {item.isPrimary && <Text style={styles.primary}>⭐ Principal</Text>}
            <Button title="Eliminar" color="red" onPress={() => deletePhoto(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  photoContainer: {
    alignItems: "center",
    margin: 10,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 5,
  },
  primary: { color: "gold", fontWeight: "bold", marginBottom: 5 },
});
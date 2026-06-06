import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

export default function HomeScreen({navigation}) {
  const { user, logout } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState(null);

  // Obtener feed de usuarios
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/user/feed");
      setProfiles(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Enviar swipe (like/dislike)
  const handleSwipe = async (cardIndex, liked) => {
    const swipedUser = profiles[cardIndex];
    if (!swipedUser) return;

    try {
      const res = await API.post(
        "/api/swipe",
        { userBId: swipedUser.id, liked }
      );
      if (res.data.match) {
        setMatchUser(swipedUser);
      }
    } catch (err) {
      console.error("Error al enviar swipe:", err);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      {profiles.length > 0 ? (
        <Swiper
          cards={profiles}
          cardIndex={index}
          renderCard={(card) => (
            <View style={styles.card}>
              <Image source={{ uri: card.photo || "https://placekitten.com/300" }} style={styles.image} />
              <Text style={styles.name}>{card.name}</Text>
              <Text style={styles.bio}>{card.bio || "Sin descripción"}</Text>
            </View>
          )}
          onSwipedLeft={(i) => handleSwipe(i, false)} // dislike
          onSwipedRight={(i) => handleSwipe(i, true)} // like
          backgroundColor={"#f8f9fa"}
          stackSize={3}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 50 }}>No hay más usuarios disponibles 😅</Text>
      )}

      <Modal visible={!!matchUser} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.matchText}>🎉 ¡Es un Match!</Text>
            <Image
              source={{ uri: matchUser?.photo || "https://placekitten.com/300" }}
              style={styles.matchImage}
            />
            <Text style={styles.matchName}>{matchUser?.name}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setMatchUser(null)}>
              <Text style={styles.closeButtonText}>Seguir deslizando ➡️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ marginTop: 30 }}>
				<Button title="Mi Perfil" onPress={() => navigation.navigate("Profile")} />
	    </View>

      <View style={{ marginTop: 30 }}>
				<Button title="Ver Matches ❤️" onPress={() => navigation.navigate("Matches")} />
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Cerrar sesión" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 0.7,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 300,
    height: 350,
    borderRadius: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  bio: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: 300,
  },
  matchText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E94057",
    marginBottom: 15,
  },
  matchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  matchName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#E94057",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
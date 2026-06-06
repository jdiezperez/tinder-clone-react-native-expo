import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

export default function MatchesScreen() {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await API.get("/api/match");
      setMatches(res.data);
    } catch (err) {
      console.error("Error al cargar matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      {matches.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50 }}>No tienes matches aún 😅</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.matchId.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.photo || "https://placekitten.com/100" }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
});
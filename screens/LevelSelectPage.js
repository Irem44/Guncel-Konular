import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable"; // Animatable import

const LevelSelectPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Animatable.Text
        style={[styles.title, { paddingBottom: 20 }]}
        animation="fadeInDown" // Animasyon ekledik
        duration={1500} // 1.5 saniye sürecek
      >
        Seviye Seçin
      </Animatable.Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]} // Kolay için yeşil
        onPress={() => navigation.navigate("Game", { level: "easy" })}
      >
        <Text style={styles.buttonText}>Kolay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ffc107" }]} // Orta için sarı
        onPress={() => navigation.navigate("GameM", { level: "medium" })}
      >
        <Text style={styles.buttonText}>Orta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc3545" }]} // Zor için kırmızı
        onPress={() => navigation.navigate("GameH", { level: "hard" })}
      >
        <Text style={styles.buttonText}>Zor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCEFCB", // Arka plan rengini #FAD59A olarak ayarladık
    padding: 20,
  },
  title: {
    fontSize: 35,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#3E7B27", // Daha dikkat çekici bir renk
    textShadowColor: "#E1FFBB", // Gölgeleme
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10, // Gölgelendirme etkisi
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2, // Butonlara kenarlık ekledik
    borderColor: "#FCEFCB", // Kenarlık rengi beyaz
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // Buton metni için beyaz
  },
});

export default LevelSelectPage;

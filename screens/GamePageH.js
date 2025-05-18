import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import wordsEasy from "../data/words_hard.json";
import oyunZemini from "../images/oyunZemini.png";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const GamePageH = ({ navigation }) => {
  const [word, setWord] = useState("");
  const [letters, setLetters] = useState([]);
  const [sound, setSound] = useState(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [translation, setTranslation] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [componentKey, setComponentKey] = useState(0);
  const [congratulationsFade] = useState(new Animated.Value(0));
  const [translationFade] = useState(new Animated.Value(0));
  const [applauseSound, setApplauseSound] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(true);

  const handlePlaybackStatusUpdate = (status) => {
    setIsSoundPlaying(status.isPlaying);
  };

  const playSound = async () => {
    if (sound && !isSoundPlaying) {
      await sound.replayAsync();
      setTimeout(() => {
        sound.stopAsync();
      }, 500);
    }
  };

  const playApplause = async () => {
    if (applauseSound) {
      await applauseSound.replayAsync();
    }
  };

  const loadRandomWord = () => {
    setLetters([]);
    setPlacedLetters([]);
    setGameFinished(false);
    setTranslation("");

    let availableWords = wordsEasy.words.filter(
      (word) => !usedWords.includes(word.word)
    );

    if (availableWords.length === 0) {
      setModalVisible(true);
      return;
    }

    const randomWordData =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    setUsedWords((prevUsedWords) => [...prevUsedWords, randomWordData.word]);
    setWord(randomWordData.word);
    setTranslation(randomWordData.translation);

    setLetters(
      shuffleArray(randomWordData.word.split("")).map((char) => ({
        char,
        revealed: false,
      }))
    );
    setPlacedLetters(Array(randomWordData.word.length).fill(""));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setUsedWords([]);
    loadRandomWord();
  };

  const handleNextLevel = () => {
    setModalVisible(false);
    navigation.navigate("Game");
  };

  const revealLetter = (index) => {
    setLetters((prevLetters) => {
      const updatedLetters = [...prevLetters];
      if (!updatedLetters[index].revealed) {
        updatedLetters[index].revealed = true;
        playSound();

        const clickedChar = updatedLetters[index].char;

        const originalIndex = word
          .split("")
          .findIndex(
            (char, idx) => char === clickedChar && placedLetters[idx] === ""
          );

        if (originalIndex !== -1) {
          setPlacedLetters((prevPlaced) => {
            const newPlaced = [...prevPlaced];
            newPlaced[originalIndex] = clickedChar;
            return newPlaced;
          });
        }
      }

      if (updatedLetters.every((letter) => letter.revealed) && !gameFinished) {
        setGameFinished(true);
        Animated.timing(congratulationsFade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        Animated.timing(translationFade, {
          toValue: 1,
          duration: 1000,
          delay: 500,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          playApplause();
        }, 1000);
      }

      return updatedLetters;
    });
  };

  const resetGameOnFocus = () => {
    loadRandomWord();
    setComponentKey((prevKey) => prevKey + 1);
  };

  useFocusEffect(
    React.useCallback(() => {
      resetGameOnFocus();

      const loadSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require("../sounds/kazmaSesi.mp3")
          );
          sound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
          setSound(sound);
        } catch (error) {
          console.error("Ses yüklenirken hata oluştu:", error);
        }
      };

      const loadApplauseSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require("../sounds/tebrikler.mp3")
          );
          setApplauseSound(sound);
        } catch (error) {
          console.error("Alkış sesi yüklenirken hata oluştu:", error);
        }
      };

      loadSound();
      loadApplauseSound();

      return () => {
        if (sound) {
          sound.unloadAsync();
        }
        if (applauseSound) {
          applauseSound.unloadAsync();
        }
      };
    }, [])
  );

  return (
    <ImageBackground source={oyunZemini} style={styles.oyunZemini}>
      <View style={styles.container} key={componentKey}>
        {gameFinished && (
          <View style={styles.congratulationsContainer}>
            <Animated.Text
              style={[
                styles.congratulationsText,
                { opacity: congratulationsFade },
              ]}
            >
              Tebrikler!
            </Animated.Text>
            <Animated.Text
              style={[styles.translationText, { opacity: translationFade }]}
            >
              {translation}
            </Animated.Text>
          </View>
        )}
        <View style={styles.triangleContainer}>
          {letters.map((letter, index) => (
            <TouchableOpacity
              key={`${index}-${letter.char}-${letter.revealed}`}
              style={[
                styles.bigCircle,
                {
                  bottom: index % 2 === 0 ? height * 0.025 : height * 0.1,
                  left: `${index * 30}%`,
                },
              ]}
              onPress={() => revealLetter(index)}
            >
              <Text style={styles.letterText}>
                {letter.revealed ? letter.char : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.smallCirclesContainer}>
          {placedLetters.map((char, idx) => (
            <View key={`placed-${idx}-${char}`} style={styles.smallCircle}>
              <Text style={styles.smallLetterText}>{char}</Text>
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={loadRandomWord}>
            <Text style={styles.nextButtonText}>Next Word</Text>
          </TouchableOpacity>
        </View>
        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Tüm kelimeler bitti!</Text>
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Yeniden Başlat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },
  oyunZemini: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  triangleContainer: {
    position: "absolute",
    left: "14%",
    right: 0,
    top: "87%", // Ekranın %50'sine konumlandır
    // height: height * 0.3, // Gerekirse bir yükseklik belirleyebilirsiniz
    justifyContent: "space-around", // Yuvarlakları yatayda dağıt
    alignItems: "center",
    flexDirection: "row", // Yuvarlakları yan yana sıralamak için
    transform: [{ translateY: -height * 0.15 }], // Tahmini yüksekliğin yarısı kadar yukarı kaydır (ayarlanabilir)
  },
  bigCircle: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  letterText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#fff",
  },
  smallCirclesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "30%",
  },
  smallCircle: {
    width: width * 0.2,
    height: width * 0.2,
    marginHorizontal: width * 0.012,
    borderRadius: width * 0.1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  smallLetterText: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#000",
  },
  congratulationsContainer: {
    position: "absolute",
    top: height * 0.04,
    left: "55%",
    transform: [{ translateX: -width * 0.2 }],
    backgroundColor: "rgba(62, 123, 39,0.7)",
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: "center",
  },
  congratulationsText: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#fff",
  },
  translationText: {
    fontSize: width * 0.045,
    color: "#fff",
    marginTop: width * 0.02,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: height * 0.01,
    justifyContent: "center",
    position: "absolute",
    bottom: 1,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    borderRadius: 5,
    marginBottom: height * 0.05,
  },
  nextButtonText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: width * 0.09,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: width * 0.045,
    marginBottom: height * 0.025,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default GamePageH;

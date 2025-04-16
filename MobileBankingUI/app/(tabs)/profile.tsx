import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Import router
import { useUser } from '../../context/UserContext';

const options = [
  { icon: "person-outline", text: "My account" },
 
  { icon: "lock-closed-outline", text: "Privacy policy" },
  { icon: "settings-outline", text: "Settings" }, // ✅ Settings ici
  { icon: "help-circle-outline", text: "Help and Support" },
  { icon: "mail-outline", text: "Contact Us" }, // ✅ Remplacer par Contact Us
];

export default function Profile() {
  const router = useRouter(); // ✅ Initialiser le router
  const [image, setImage] = useState<string>("https://randomuser.me/api/portraits/men/1.jpg");
  const [userName, setUserName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const { userData } = useUser();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Vous devez autoriser l'accès à la galerie.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNamePress = () => {
    setIsEditingName(true);
  };

  const handleNameSubmit = () => {
    setIsEditingName(false);
    // Ici vous pourriez sauvegarder le nom dans votre base de données/state global
  };

  return (
    <ScrollView style={styles.container}>
      {/* Titre Profile avec icône */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={28} color="#1E90FF" />
        <Text style={styles.title}> Profile</Text>
      </View>

      {/* Section Utilisateur */}
      <View style={styles.userSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={styles.nameInput}>{userData.fullName}</Text>
      </View>

      {/* Options de menu */}
      <View style={styles.menuContainer}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.text === "Settings") {
                router.push("/settings"); // ✅ Redirection
              } if (item.text === "Privacy policy") {
                router.push("/privacy"); // ✅ Redirection
              } if (item.text === "My account") {
                router.push("/myaccount"); // ✅ Redirection
              } if (item.text === "Contact Us") {
                router.push("/contact"); // ✅ Redirection pour Contact Us
              } 
              else {
                console.log(`${item.text} pressed`);
              }
            }}
          >
            <View style={styles.optionContent}>
              <Ionicons name={item.icon as any} size={22} color="#1E90FF" />
              <Text style={styles.menuText}>{item.text}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#1E90FF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Séparateur */}
      <View style={styles.separator} />

      {/* Bouton Déconnexion */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E90FF",
    marginLeft: 10,
  },
  userSection: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#1E90FF",
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: 'center',
  },
  placeholderName: {
    fontSize: 16,
    color: "#95a5a6",
    fontStyle: 'italic',
    textAlign: 'center',
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    padding: 5,
    textAlign: 'center',
    width: '80%',
  },
  menuContainer: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#34495E",
  },
  separator: {
    height: 1,
    backgroundColor: "#ECF0F1",
    marginVertical: 15,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

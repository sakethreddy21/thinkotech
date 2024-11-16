// screens/HomeScreen.js
import { useGlobalContext } from '@/context/GlobalProvider';
import React from 'react';
import { router } from "expo-router";
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';

export default function HomeScreen() {
  const { user, setUser, setIsLogged } = useGlobalContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <IconButton
    icon="exit-to-app"
    iconColor={MD3Colors.primary90}
    size={40}
    onPress={async () => {
      setUser(null);
      setIsLogged(false);
  
      router.replace("/(auth)");
    } }
  />
        <IconButton
    icon="face-recognition"
    iconColor={MD3Colors.neutralVariant40}
    size={40}
    onPress={async () => {
    } }
  />
   
      </View>
      <Text style={styles.title}>Welcome to the Home Page!</Text>
      <TouchableOpacity
  style={styles.mainButton}
  onPress={() => router.replace("/(core)/items")}
>
  <Text style={styles.buttonText}>Items</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.mainButton}
  onPress={() => router.replace("/(core)/orders")}
>
  <Text style={styles.buttonText}>Orders</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40, // Add some padding from the top
    position: 'absolute',
    width: '100%',
    top: 20,
    zIndex: 1, // Ensures buttons stay above other elements
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  mainButton: {
    width: '80%',
    paddingVertical: 20,
    backgroundColor: 'grey',
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

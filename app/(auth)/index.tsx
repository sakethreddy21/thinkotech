import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import SignInSignUp from '@/components/SignInSignUp';

export default function HomeScreen() {
  const [role, setRole] = useState(false); // State to store role, `true` for Admin, `false` for Student

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => setRole(true)}
          style={[styles.roleButton, role === true && styles.activeButton]} // Apply active style when Admin is selected
        >
          <ThemedText type="title" style={styles.buttonText}>
            Admin
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole(false)}
          style={[styles.roleButton, role === false && styles.activeButton]} // Apply active style when Student is selected
        >
          <ThemedText type="title" style={styles.buttonText}>
            Student
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Pass role to the SignInSignUp component */}
      <SignInSignUp role={role} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  roleButton: {
    padding: 10,
    backgroundColor: 'grey', // Default background color
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: 'transparent', // Active background color when button is selected
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

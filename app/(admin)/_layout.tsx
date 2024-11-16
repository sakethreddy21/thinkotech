import { StyleSheet, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';

const Layout = () => {
  // Initialize loading and isLogged state
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/(auth)" />;



  // Redirect if not loading and the user is logged in

  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="items"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="orders"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            headerShown: false,
          }}
        />
        
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

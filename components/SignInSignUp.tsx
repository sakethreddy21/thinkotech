import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createUser, getCurrentUser, signInOperation } from '@/lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
import { Link, router } from 'expo-router';

const SignInSignUp = ({ role = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [signIn, setSignIn] = useState(true);
  const {setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);




  const handleSubmit = async () => {
    if (signIn) {
      if (email === "" || password === "") {
        Alert.alert("Error", "Please fill in all fields");
        return;  // Stop further execution if fields are empty
      }

      setSubmitting(true);
      try {
        const result =  await signInOperation(email, password, role);
     
        setUser(result);
        setIsLogged(true);
        Alert.alert("Success", "User signed in successfully");
        router.replace("/home");
      } catch (error:any) {
        Alert.alert("Error", error.message || error.toString());
      } finally {
        setSubmitting(false);
      }
    } else {
      if (username === "" || email === "" || password === "") {
        Alert.alert("Error", "Please fill in all fields");
        return;  // Stop further execution if fields are empty
      }

      setSubmitting(true);
      try {
        const result = await createUser(email, password, username, role);
        setUser(result);
        setIsLogged(true);
        router.replace("/home");
      } catch (error:any) {
        Alert.alert("Error", error.message || error.toString());
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {signIn ? 'Sign In' : 'Sign Up'} As {role ? 'Admin' : 'Student'}
      </Text>

      {!signIn && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setUserName}
          value={username}
          placeholderTextColor='grey'
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        placeholderTextColor="grey" 
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        placeholderTextColor="grey" 
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{signIn ? 'Sign In' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <Text style={styles.toggleText}>
        {signIn ? "Don't have an account?" : "Already have an account?"}
      </Text>
      <TouchableOpacity onPress={() => setSignIn(!signIn)}>
        <Text style={styles.toggleActionText}>{signIn ? 'Sign Up' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInSignUp;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'grey'
  },
  input: {
    color:'grey',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'gray',
  },
  toggleActionText: {
    color: 'blue',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

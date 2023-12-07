import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../services/conexãoFirebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Menu');
      }
    });
  }, []);

  function handleLogin() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        navigation.navigate('Menu');
      })
      .catch((err) => {
        console.log(err);
        alert('Email ou senha incorretos!');
      });
  }

  function handleNavigateToCadastrar() {
    navigation.navigate('Cadastrar');
  }

  return (
    <View style={styles.container}>
    
      <Image style={styles.logo} source={require('../assets/Login.png')} />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="E-MAIL"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          placeholder="SENHA"
          keyboardType="default"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleNavigateToCadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE2B0",
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#A0CF94',
    paddingLeft: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 40,
  },
  button: {
    borderRadius: 25,
    padding: 15,
    backgroundColor: "#4CAF50",
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
  },
});

import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Cadastrar({ navigation }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jogador, setJogador] = useState('');

  async function cadastrar() {
    try {
      await signUp(email, password, jogador);
      alert('Usuário criado com sucesso: ' + email);
      // Voltar para a tela de login após o cadastro
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        alert('A senha deve ter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        alert('Email inválido');
      } else {
        alert('Ops, algo deu errado: ' + error.message);
      }
    }

    // Limpar os campos após o cadastro
    setEmail('');
    setPassword('');
    setJogador('');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="#4CAF50" />
      </TouchableOpacity>
      
      <Image style={styles.logo} source={require('../assets/Login.png')} />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="E-MAIL"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setJogador(text)}
        value={jogador}
        placeholder="Nome Jogador"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        placeholder="SENHA"
      />

      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#BAE2B0',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    marginTop: 10
  },
  titulo: {
    fontSize: 50,
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#A0CF94',
    paddingLeft: 15,
    height: 40,
    marginTop: 20,
    borderRadius: 5,
    width: 300,
  },
  button: {
    borderRadius: 25,
    padding: 15,
    backgroundColor: '#4CAF50',
    marginTop: 20,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#FFF',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

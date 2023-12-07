// Perfil.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente reutilizável para representar um card na tela de perfil
const Card = ({ title, onPress }) => (
  <TouchableOpacity style={styles.containerCard} onPress={onPress}>
    <Text style={styles.textoCard}>{title}</Text>
  </TouchableOpacity>
);

function Perfil({ navigation }) {
  const { jogador, points, coins, user, signOut, avatarSource } = useAuth();

  // Função para lidar com o logout do usuário
  const handleLogout = async () => {
    try {
      // Fazer logout
      await signOut();
      // Navegar de volta para a tela de login após o logout
      navigation.replace('Login');
      Alert.alert('Funcionalidade não implementada');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para lidar com a troca de senha do usuário
  const handleSenha = async () => {
    try {
      // Lógica para trocar a senha
      Alert.alert('Funcionalidade não implementada', 'Implemente a lógica para trocar a senha.');
    } catch (error) {
      console.error('Erro ao enviar email de redefinição de senha:', error);
      Alert.alert('Erro', 'Houve um erro ao enviar o email. Tente novamente mais tarde.');
    }
  };

  // Função para exibir o email do usuário
  const VerEmail = () => {
    Alert.alert('Email', `Seu email é: ${user.email}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        {avatarSource ? (
          <Image source={{ uri: avatarSource }} style={styles.imagemAvatar} />
        ) : (
          <Icon name="user-circle" size={100} color="#3BAEAE" />
        )}
      </TouchableOpacity>

      {jogador && (
        <Text style={styles.textoJogador}>{jogador}</Text>
      )}

      <View style={styles.containerEstatisticas}>
        <Text style={styles.textoEstatisticas}>
          <Icon name="star" size={20} color="#fff" /> {points} Pontos
        </Text>
        <Text style={styles.textoEstatisticas}>
          <Icon name="money" size={20} color="#33CC33" /> {coins} Moedas
        </Text>
      </View>

      <Card title="Trocar Senha" onPress={handleSenha} />
      <Card title="Ver Email" onPress={VerEmail} />
      <Card title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE2B0',
    paddingHorizontal: 20,
    paddingTop: 90,
    alignItems: 'center'
  },
  imagemAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#fff', 
  },
  textoJogador: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Centraliza o texto
  },
  containerEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  textoEstatisticas: {
    fontSize: 20,
    color: '#000000',
    marginTop: 5,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center', // Centraliza o texto
  },
  containerCard: {
    backgroundColor: '#4CAF50', 
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: 300,
  },
  textoCard: {
    fontSize: 20,
    color: '#fff', 
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Perfil;

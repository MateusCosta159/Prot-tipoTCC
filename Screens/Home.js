// Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProgressBar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

// Definição das diferentes patentes com seus requisitos de XP e ícones correspondentes
const Patentes = [
  { nome: 'Patente Verde', xpNecessario: 100, icon: 'rocket' },
  { nome: 'Patente EcoGuardião', xpNecessario: 400, icon: 'shield' },
  { nome: 'Patente RecicloMaster', xpNecessario: 450, icon: 'trophy' },
  { nome: 'Patente Lixo Zero Hero', xpNecessario: 5000, icon: 'star' },
  { nome: 'Sustentável Supremo', xpNecessario: 6000, icon: 'diamond' },
];

// Função para calcular a patente atual com base nos pontos de XP
function calcularPatenteXP(xpAtual) {
  for (let i = Patentes.length - 1; i >= 0; i--) {
    if (xpAtual >= Patentes[i].xpNecessario) {
      return {
        ...Patentes[i],
        proximaPatente: Patentes[i + 1] || null,
      };
    }
  }
  return null;
}

function Home() {
  const { user, points, coins, avatarSource, pickImage, saveAvatar, jogador } = useAuth();
  const [progress, setProgress] = useState(0);
  const [patenteAtual, setPatenteAtual] = useState(null);

  useEffect(() => {
    const patente = calcularPatenteXP(points);
    setPatenteAtual(patente);

    const progressoXP = (points - (patente ? patente.xpNecessario : 0)) / ((patente ? patente.proximaPatente.xpNecessario : 1) - (patente ? patente.xpNecessario : 0));
    setProgress(progressoXP);
  }, [points]);

  // Função para lidar com a escolha de imagem do usuário
  const handleImagePick = async () => {
    try {
      let result = await pickImage();

      if (!result.cancelled) {
        saveAvatar(result.uri);
      }
    } catch (error) {
      console.error('Erro ao escolher a imagem:', error);
    }
  };

  return (
    <View style={styles.container}>
  
      <TouchableOpacity onPress={handleImagePick}>
        {avatarSource ? (
          <Image source={{ uri: avatarSource }} style={styles.imagemAvatar} />
        ) : (
          <Icon name="user-circle" size={100} color="#3BAEAE" />
        )}
      </TouchableOpacity>

      <View style={styles.containerEstatisticas}>
        <Text style={styles.textoEstatisticas}>
          <Icon name="star" size={20} color="#fff" /> Pontos: {points}
        </Text>
        <Text style={styles.textoEstatisticas}>
          <Icon name="money" size={20} color="#33CC33" /> Moedas: {coins}
        </Text>
      </View>
      <Text style={styles.textoEstatisticas}>{jogador} </Text>
      <ProgressBar
        style={styles.barraProgresso}
        progress={progress}
        color="#3CB371" 
      />

      {patenteAtual && (
        <View style={[styles.containerPatente, styles.destaquePatente]}>
          <Text style={styles.textoEstatisticas}> {patenteAtual.nome}</Text>
          <Icon name={patenteAtual.icon} size={50} color="#3BAEAE" />
        </View>
      )}

      <TouchableOpacity
        style={styles.containerCard}
        onPress={() => {
          Linking.openURL('https://www.reciclasampa.com.br/artigo/descarte-correto');
        }}
      >
        <Text style={styles.textoCard}>Descarte correto de resíduos</Text>
        <Text style={styles.textoCard}>Conheça clicando aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#BAE2B0', 
  },
  imagemAvatar: {
    width: 200,
    height: 200,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#fff', 
  },
  containerEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  textoEstatisticas: {
    fontSize: 20,
    color: '#000000', 
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  
  barraProgresso: {
    width: 200,
    height: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1, 
    borderColor: 'black', 
  },
  
  containerPatente: {
    alignItems: 'center',
    marginTop: 20,
  },
  textoPatente: {
    fontSize: 20,
    color: '#fff', 
    marginBottom: 10,
  },
  iconePatente: {
    marginBottom: 20,
  },

  destaquePatente: {
    borderWidth: 10,
    borderColor: 'green', 
    borderRadius: 5
  },

  containerCard: {
    backgroundColor: '#fff', 
    padding: 20,
    borderRadius: 10,
    marginTop: 90,
  },
  textoCard: {
    fontSize: 20,
    color: '#333', 
    textAlign: 'center',
    width: 300,
    fontWeight: 'bold'
  },
});

export default Home;

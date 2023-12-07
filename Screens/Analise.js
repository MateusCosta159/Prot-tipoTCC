
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Componente funcional para detecção de garrafa de plástico com pontos
const Analise = () => {
  const [imageUri, setImageUri] = useState(null);
  const [objectDescriptions, setObjectDescriptions] = useState([]);
  const { adicionarPontosEMoedas, adicionarObjetoAnalisado } = useAuth();

  // Função para escolher e analisar uma imagem
  const escolherImg = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await AnalisarImg(uri);
      }
    } catch (error) {
      console.error('Erro: ', error);
    }
  };

  // Função para analisar uma imagem usando a API Vision do Google
  const AnalisarImg = async (uri) => {
    try {
      const apiKey = "";
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const base64ImageData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: 'LABEL_DETECTION' }],
          },
        ],
      };

      const apiResponse = await axios.post(apiURL, requestData);
      setObjectDescriptions(apiResponse.data.responses[0].labelAnnotations);

      // Define pontos e moedas para diferentes objetos detectados
      const objectRewards = {
        'Plastic-Bottle': { points: 60, coins: 5 },
        'Bottle': { points: 60, coins: 5 },
        'metal': { points: 2, coins: 10 },
        'cardboard': { points: 3, coins: 15 },
        'aluminum': { points: 4, coins: 20 },
        'aluminum-can': { points: 4, coins: 20 },
        'Tin': { points: 4, coins: 20 },
      };

      let totalPoints = 0;
      let totalCoins = 0;

      // Itera sobre as descrições e adiciona pontos e moedas conforme a detecção
      objectDescriptions.forEach(description => {
        const { description: objectDescription, score } = description;
        const reward = objectRewards[objectDescription];

        if (reward && score >= 0.7) {
          totalPoints += reward.points;
          totalCoins += reward.coins;
          adicionarObjetoAnalisado(objectDescription);
        }
      });

      // Adiciona os pontos e moedas ao contexto e ao banco de dados
      adicionarPontosEMoedas(totalPoints, totalCoins);
      
      Alert.alert('Imagem analisada! Tarefa concluída.');
    } catch (error) {
      console.error('Erro ao analisar imagens:', error);
      Alert.alert('Erro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Análise de Imagens</Text>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagem} />
      )}
      <ScrollView style={styles.scrollView}>
        {objectDescriptions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.rotulo}>Palavras-chave na Descrição:</Text>
            {objectDescriptions.map((description, index) => (
              <Text key={index} style={styles.textoSaida}>
                {description.description} - {Math.round(description.score * 100)}%
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity onPress={escolherImg} style={styles.botao}>
        <Text style={styles.texto}>Escolher e Analisar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE2B0',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30
  },
  scrollView: {
    maxHeight: 150,
    marginBottom: 20,
    width: '80%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    elevation: 2, // Adiciona sombra no Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 50
  },
  texto: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rotulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textoSaida: {
    fontSize: 16,
    marginBottom: 10,
  },
  imagem: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 8,
  },
});

export default Analise;

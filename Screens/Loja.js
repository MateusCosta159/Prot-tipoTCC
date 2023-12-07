// Store.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

// Dados dos produtos disponíveis na loja
const productsData = [
  { id: 1, name: 'Item 1', coinsPrice: 20, realPrice: 2.99 },
  { id: 2, name: 'Item 2', coinsPrice: 30, realPrice: 4.99 },
  { id: 3, name: 'Item 3', coinsPrice: 15, realPrice: 1.99 },
  { id: 4, name: 'Item 4', coinsPrice: 40, realPrice: 5.99 },
  { id: 5, name: 'Item 5', coinsPrice: 25, realPrice: 3.49 },
  { id: 6, name: 'Item 6', coinsPrice: 35, realPrice: 4.49 },
  { id: 7, name: 'Item 7', coinsPrice: 50, realPrice: 6.99 },
  { id: 8, name: 'Item 8', coinsPrice: 10, realPrice: 0.99 },
];

function Loja() {
  const { coins, adicionarPontosEMoedas } = useAuth();

  // Função para comprar um item da loja
  const comprarItem = (id, coinsPrice, realPrice) => {
    // Verifica se o usuário tem moedas suficientes para comprar o item
    if (coins >= coinsPrice) {
      Alert.alert('Compra realizada com sucesso!');
      adicionarPontosEMoedas(0, -coinsPrice); // Deduz as moedas do usuário
    } else {
      Alert.alert('Moedas insuficientes. Consiga mais moedas realizando tarefas.');
    }
  };

  // Função para renderizar cada item na FlatList
  const renderItem = ({ item }) => (
    <View style={styles.containerProduto}>
      <Text style={styles.nomeProduto}>{item.name}</Text>
      <Text style={styles.precoProduto}>Preço em moedas: {item.coinsPrice}  <Icon name="money" size={20} color="#33CC33" /></Text>
      <Text style={styles.precoProduto}>Preço em dinheiro real: ${item.realPrice}</Text>
      <TouchableOpacity
        style={styles.botaoComprar}
        onPress={() => comprarItem(item.id, item.coinsPrice, item.realPrice)}
      >
        <Text style={styles.textoBotao}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Loja</Text>
      <Text style={styles.moedas}>Moedas disponíveis: {coins}  <Icon name="money" size={20} color="#33CC33" /></Text>
      <FlatList
        data={productsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerFlatList} // Adiciona um estilo ao contêiner da FlatList
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BAE2B0',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 25,
  },
  moedas: {
    fontSize: 20,
    marginBottom: 20,
    flexDirection: 'row', // Para alinhar o ícone de moeda ao texto
    alignItems: 'center',
    fontWeight: 'bold'
  },
  containerProduto: {
    borderWidth: 1,
    borderColor: '#3BAEAE',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '48%',
    marginRight: 10,
    backgroundColor: '#FDE799',
  },
  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  precoProduto: {
    fontSize: 16,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoComprar: {
    backgroundColor: '#3BAEAE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerFlatList: {
    paddingHorizontal: 16,
  },
});

export default Loja;

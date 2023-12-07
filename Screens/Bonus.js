// BonusPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

// Componente funcional que representa uma página de bônus
const Bonus = () => {
  const { user, points, coins, adicionarPontosEMoedas } = useAuth();
  const [bonusLevels, setBonusLevels] = useState([]);

  // Efeito para atualizar os níveis de bônus sempre que os pontos mudam
  useEffect(() => {
    setBonusLevels(getBonusLevels(points));
  }, [points]);

  // Função para resgatar um bônus
  const regastarBonus = async (bonusAmount, index) => {
    const bonusKey = `bonus_${index}_${user.uid}`;
    const hasRedeemed = await AsyncStorage.getItem(bonusKey);

    if (!hasRedeemed) {
      adicionarPontosEMoedas(0, bonusAmount);
      Alert.alert(`Parabéns! Você resgatou um bônus de ${bonusAmount} moedas.`);

      await AsyncStorage.setItem(bonusKey, 'true');
      setBonusLevels((prevLevels) =>
        prevLevels.map((level, i) => (i === index ? { ...level, hasRedeemed: true } : level))
      );
    } else {
      Alert.alert('Você já resgatou este bônus.');
    }
  };

  // Função para obter os níveis de bônus com base nos pontos acumulados
  const getBonusLevels = (currentPoints) => {
    const levels = [
      { pointsRequired: 200, bonusAmount: 100, icon: 'star' },
      { pointsRequired: 500, bonusAmount: 200, icon: 'star' },
      { pointsRequired: 1000, bonusAmount: 300, icon: 'star' },
      { pointsRequired: 1500, bonusAmount: 300, icon: 'star' },
      { pointsRequired: 2000, bonusAmount: 300, icon: 'star' },
      { pointsRequired: 2500, bonusAmount: 300, icon: 'star' },
    ];

    return levels.map((level, index) => ({
      ...level,
      isAvailable: currentPoints >= level.pointsRequired,
      hasRedeemed: false,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bônus Disponíveis</Text>
      
      <View style={styles.containerInfo}>
        <View style={styles.info}>
          <Icon name="star" size={30} color="#fff" />
          <Text style={styles.textoPontos}>{points}</Text>
        </View>
        <View style={styles.info}>
          <Icon name="money" size={24} color="#33CC33" />
          <Text style={styles.textoMoedas}>{coins}</Text>
        </View>
      </View>

      {bonusLevels.map((level, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => regastarBonus(level.bonusAmount, index)}
          style={[styles.botao, { backgroundColor: level.isAvailable ? '#4CAF50' : '#CCCCCC' }]}
          disabled={!level.isAvailable || level.hasRedeemed}
        >
          <Icon name={level.icon} size={30} color={level.isAvailable ? '#FFFFFF' : '#AAAAAA'} />
          <Text style={[styles.textoBotao, { marginLeft: 10 }]}>
            {level.isAvailable
              ? `Resgatar Bônus de ${level.bonusAmount} moedas (Acima de ${level.pointsRequired} pontos)`
              : `Alcance ${level.pointsRequired} pontos para desbloquear`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE2B0',
    alignItems: 'center',
    paddingTop: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    paddingTop: 20,
  },
  containerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoPontos: {
    fontSize: 20,
    marginLeft: 5,
    marginHorizontal: 50,
  },
  textoMoedas: {
    fontSize: 20,
    marginLeft: 5,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    marginBottom: 10,
    width: '80%',
    borderRadius: 10,
  },
  textoBotao: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Bonus;

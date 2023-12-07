

import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from '../services/conexãoFirebase';
import * as ImagePicker from 'expo-image-picker';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Provedor de autenticação que envolve a aplicação
export const AuthProvider = ({ children }) => {
  // Estados para armazenar informações do usuário
  const [user, setUser] = useState(null);
  const [jogador, setJogador] = useState(null);
  const [points, setPoints] = useState(0);
  const [coins, setCoins] = useState(0);
  const [objetosAnalisados, setObjetosAnalisados] = useState([]);
  const [avatarSource, setAvatarSource] = useState(null);

  // Efeito para observar mudanças no estado de autenticação do usuário
  useEffect(() => {
    // Referência para o jogador no banco de dados
    const jogadorRef = firebase.database().ref('jogadores/' + user?.uid);

    // Observador de mudanças no estado de autenticação
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Observador de mudanças nos dados do jogador no banco de dados
        jogadorRef.on('value', (snapshot) => {
          const jogadorData = snapshot.val();

          if (jogadorData) {
            setJogador(jogadorData.nome);
            setPoints(jogadorData.pontos || 0);
            setCoins(jogadorData.moedas || 0);
            setObjetosAnalisados(jogadorData.objetosAnalisados || []);
            setAvatarSource(jogadorData.avatar || null);
          } else {
            setJogador(null);
            setPoints(0);
            setCoins(0);
            setObjetosAnalisados([]);
            setAvatarSource(null);
          }
        });
      } else {
        setUser(null);
        setJogador(null);
        setPoints(0);
        setCoins(0);
        setObjetosAnalisados([]);
        setAvatarSource(null);
      }
    });

    // Limpeza do observador ao desmontar o componente
    return () => {
      jogadorRef.off();
      unsubscribe();
    };
  }, [user]);

  // Função para adicionar pontos e moedas ao jogador
  const adicionarPontosEMoedas = (novosPontos, novasMoedas) => {
    if (user) {
      const userId = user.uid;
      const jogadorRef = firebase.database().ref('jogadores/' + userId);
      jogadorRef.update({
        pontos: points + novosPontos,
        moedas: coins + novasMoedas,
      });
    }

    setPoints(points + novosPontos);
    setCoins(coins + novasMoedas);
  };

  // Função para adicionar objeto analisado ao jogador
  const adicionarObjetoAnalisado = (objeto) => {
    setObjetosAnalisados([...objetosAnalisados, objeto]);
  };

  // Função para escolher uma imagem da galeria
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      return result;
    } catch (error) {
      console.error('Erro ao escolher a imagem:', error);
      throw error;
    }
  };

  // Função para salvar o avatar do jogador
  const saveAvatar = async (uri) => {
    try {
      if (user) {
        const userId = user.uid;
        const jogadorRef = firebase.database().ref('jogadores/' + userId);
        jogadorRef.update({
          avatar: uri,
        });
      }

      setAvatarSource(uri);
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      throw error;
    }
  };

  // Função para fazer login
  const signIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Função para cadastrar um novo usuário
  const signUp = async (email, password, jogador) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const userId = firebase.auth().currentUser.uid;
      const jogadorRef = firebase.database().ref(`jogadores/${userId}`);
      jogadorRef.set({
        nome: jogador,
      });
    } catch (error) {
      console.error('Erro ao se cadastrar:', error);
      throw error;
    }
  };

  // Contexto com as funções e dados relacionados à autenticação
  return (
    <AuthContext.Provider
      value={{
        user,
        jogador,
        points,
        coins,
        objetosAnalisados,
        avatarSource,
        adicionarPontosEMoedas,
        adicionarObjetoAnalisado,
        pickImage,
        saveAvatar,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

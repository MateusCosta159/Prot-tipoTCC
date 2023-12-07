// Importa a biblioteca Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/database';

// Configuração do Firebase com as credenciais do projeto
let firebaseConfig = {
   
};

// Inicializa o Firebase com as configurações fornecidas
firebase.initializeApp(firebaseConfig);

// Inicializa o módulo de autenticação do Firebase
const auth = firebase.auth();

// Obtém uma referência para o Realtime Database do Firebase
const database = firebase.database();


export default firebase;

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBF6BDefsC6zmhnuRmk04l_AHCPbp5fqn8",
  authDomain: "spatial-world.firebaseapp.com",
  projectId: "spatial-world",
  storageBucket: "spatial-world.appspot.com",
  messagingSenderId: "558541049241",
  appId: "1:558541049241:web:5be52ac880bf83644b9708"
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)

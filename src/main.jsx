import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Importando nossos estilos globais 🎨

// 1. Encontramos o palco <div id="root">
// 2. Comandamos o React a renderizar nosso componente principal <App /> lá dentro!
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
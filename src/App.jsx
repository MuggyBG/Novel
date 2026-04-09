import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
const Home = () => <div style={{ padding: '2rem' }}><h1>Home Page</h1></div>;
const Browse = () => <div style={{ padding: '2rem' }}><h1>Browse Novels</h1></div>;
const Library = () => <div style={{ padding: '2rem' }}><h1>Your Library</h1></div>;
  return ( 
    <>
    <Navbar/>
    <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    <main>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/browse" element={<Browse/>}/>
        <Route path="/library" element={<Library/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="*" element={<Home/>} />
    </Routes>
      
      </main>
      </>
  )
}

export default App

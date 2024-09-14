import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Home = () => <div>Home Page</div>
const About = () => <div>About Page</div>

function TestRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default TestRouter

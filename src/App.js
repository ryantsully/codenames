import NavBar from './NavBar.jsx'
import Home from './pages/Home'
import CodeNames from './pages/CodeNames'
import Wordle from './pages/Wordle'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

function App() {

  return (
    <Router>
      <div className="page-background">
        <NavBar className="nav" />
        <div>

          <Routes>
            <Route
              path="/"
              element={<Home />}>
            </Route>
            <Route
              path="/codenames"
              element={<CodeNames />}>
            </Route>

            <Route
              path="/wordle"
              element={<Wordle />}>
            </Route>

          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
import NavBar from './NavBar.jsx'
import Home from './pages/Home'
import Programming from './pages/Programming'
import CreateEntry from './pages/CreateEntry.jsx'
import BlogDetails from './pages/BlogDetails.jsx'
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
              path="/programming"
              element={<Programming />}>
            </Route>

            <Route
              path="/create"
              element={<CreateEntry />}>
            </Route>

            <Route
              path="/codenames"
              element={<CodeNames />}>
            </Route>

            <Route
              path="/wordle"
              element={<Wordle />}>
            </Route>

            <Route
              path="/blogs/:id"
              element={<BlogDetails />}>
            </Route>

          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
import './App.css';
import Navbar from './Navbar';
import Find from './Find';
import Upload from './Upload';
import News from './News';
import Stats from './Statistics';
import Feed from './Feed';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"


function App() {
  return (
    <Router>
    <div className="App">
    <Routes>
      <Route path='/' element={
       <div>
        <Navbar />
        <Find/>
        <Feed/>
       </div>
      }/>
      <Route path='/Upload' element={
       <div>
        <Navbar />
        <Upload/>
       </div>
      }/>
      <Route path='/Help' element={
       <div>
        <Navbar />
        <News/>
       </div>
      }/>

    </Routes>
      
    </div>
    </Router>
  );
}

export default App;

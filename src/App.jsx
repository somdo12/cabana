import { useState } from 'react';
import './App.css';


function App() {
const [number,setnumber]= useState(0);
const som =(number)=>{
  setnumber(number + 1);

}

  return (
    <div className="App">
      <p>{number}</p>
      <button onClick={som}>num</button>
  
    </div>
  );
}

export default App;

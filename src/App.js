import routes from '../src/routes'
import Nav from '../src/Components/Nav/Nav'
import React from 'react';
import './App.css';

function App() {
  return (
   
          <div className='App'>
            <Nav />
            {routes}
            </div>
  

  )
};

export default App;

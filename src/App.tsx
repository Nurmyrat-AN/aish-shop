import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
const Products = React.lazy(() => import('./Pages/Products'))
const Groups = React.lazy(() => import('./Pages/Groups'))
const Currencies = React.lazy(() => import('./Pages/Currencies'))
const Baners = React.lazy(() => import('./Pages/Baners'))

type Props = {}
const App: React.FC<Props> = (props) => {
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Header />
      <Switch>
        <Route path='/groups' component={Groups} />
        <Route path='/currencies' component={Currencies} />
        <Route path='/baners' component={Baners} />
        <Route path='/' component={Products} />
      </Switch>
    </React.Suspense>
  );
}



export default App;

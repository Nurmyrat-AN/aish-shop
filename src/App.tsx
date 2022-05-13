import Dialog from '@mui/material/Dialog';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import { Loading } from './Components/Loading';
import { useAppSelector } from './Project/store';
const Products = React.lazy(() => import('./Pages/Products'))
const Currencies = React.lazy(() => import('./Pages/Currencies'))
const HomePage = React.lazy(() => import('./Pages/HomePage'))
const Discounts = React.lazy(() => import('./Pages/Discounts'))

type Props = {}
const App: React.FC<Props> = () => {

  return (
    <React.Suspense fallback={<Loading />}>
      <Header />
      <Switch>
        <Route path='/currencies' component={Currencies} />
        <Route path='/discounts' component={Discounts} />
        <Route path='/homepage' component={HomePage} />
        <Route path='/' component={Products} />
      </Switch>
      <AppLoader />
    </React.Suspense>
  );
}

const AppLoader = () => {
  const loading: boolean = useAppSelector(state => state.global.loading)
  return <Dialog open={Boolean(loading)}><Loading /></Dialog>
}

export default App;

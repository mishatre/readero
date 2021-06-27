
import { Switch, Route, useLocation } from 'react-router-dom';
import Providers from 'Providers';

import Reader from './Pages/Reader';
import Library from './Pages/Library';
import Settings from 'Pages/Settings';
import Menu from 'Components/Menu';

import styles from './styles.module.scss';

function A() {
  const location = useLocation();
  console.log(location)
  return (
      <Switch>
        <Route path="/book/:id" exact component={Reader} />
        <Route path="/" >
            <Route path="/" exact component={Library} />
            <Route path="/settings" exact component={Settings} />
            <Menu />
        </Route>
      </Switch>
  )
}

function App() {

  

  return (
    <div className={styles.container}>
      <Providers>
        <A />
      </Providers>
    </div>
  );
}

export default App;

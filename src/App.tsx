
import { Switch, Route, useLocation } from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import Providers from 'providers';

import Reader from './pages/Reader';
import Library from './pages/Library';
import Settings from 'pages/Settings';

import styles from './styles.module.scss';

function A() {
  const location = useLocation();
  // console.log(location)
  return (
    <TransitionGroup className={styles.container} >
      {/*
            This is no different than other usage of
            <CSSTransition>, just make sure to pass
            `location` to `Switch` so it can match
            the old location as it animates out.
          */}
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={300}
      >
        <Switch location={location}>
          <Route path="/book/:id" exact component={Reader} />
          <Route path="/" >
            <Route path="/" exact component={Library} />
            <Route path="/settings" exact component={Settings} />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )
}

function App() {



  return (
    <Providers>
      <A />
    </Providers>
  );
}

export default App;

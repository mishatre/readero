
import { Switch, Route } from 'react-router-dom';
import Providers from 'Providers';

import Reader from './Pages/Reader';
import Library from './Pages/Library';

function App() {
  return (
    <Providers>
      <Switch>
        <Route path="/book/:id" component={Reader} />
        <Route path="/" component={Library} />
      </Switch>
    </Providers>
  );
}

export default App;

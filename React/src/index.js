import ReactDOM from 'react-dom';
import './index.css';
import { makeMainRoutes } from './routes';
import registerServiceWorker from './registerServiceWorker';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.js';

const mainRoutes = makeMainRoutes();

ReactDOM.render(
    mainRoutes,
    document.getElementById('root')
);

registerServiceWorker();

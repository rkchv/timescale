import Observer from './index.js';

// Decorator pattern
const connectToObserver = Component => class extends Component {
  static name = `connected to observer ${Component.name}`;

  constructor(...props) {
    props.push(Observer.instance);
    super(...props);
  }
};

export default connectToObserver;

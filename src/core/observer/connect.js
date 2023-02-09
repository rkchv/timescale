import Observer from './index.js';

// Decorator pattern
const connectToObserver = Component => class extends Component {
  constructor(...props) {
    props.push(Observer.instance);
    super(...props);
  }
};

export default connectToObserver;

import HotToday from './HotToday';
import Filter from './PriceChangeFilter';
import Chart from '../containers/Chart';

const App = () => (
  <div className="main-container container">
    <HotToday />
    <Filter />
    <Chart />
  </div>
);

export default App;

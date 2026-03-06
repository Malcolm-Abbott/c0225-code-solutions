import './App.css';
import { Header } from './Header';
import { Image } from './Image';
import { Caption } from './Caption';
import { Description } from './Description';
import { Button } from './Button';

function App() {
  const description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  return (
    <div className="app-container">
      <Header title="React Image Bank" />
      <Image imageUrl="https://picsum.photos/id/237/800/1200" />
      <Caption caption="A Beautiful Little Doggy!" />
      <Description description={description} />
      <Button label="Click for Next Image" />
    </div>
  );
}

export default App;

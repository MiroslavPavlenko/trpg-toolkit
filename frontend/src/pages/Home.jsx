import "../style/Home.css";
import ItemDropdown from "../components/SelectEdition";

function Home() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <h2>Home Page</h2>

        <ItemDropdown />
      </nav>
    </div>
  );
}

export default Home;
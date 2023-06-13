import { Sidebar, Chat } from "../components";

function Home() {
  return (
    <div className="home">
      <div className="homeContainer">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;

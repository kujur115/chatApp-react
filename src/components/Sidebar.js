import { Chats, Navbar, Search } from "./";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Top navigation bar */}
      <Navbar />

      {/* Search component for searching and adding new contacts */}
      <Search />

      {/* Chats component to display user's conversations */}
      <Chats />
    </div>
  );
};

export default Sidebar;

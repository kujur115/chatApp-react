import profile from "../images/art.jpg";
const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Messanger App</span>
      <div className="user">
        <img src={profile} alt="" />
        <span>Pratik</span>
        <button>logout</button>
      </div>
    </div>
  );
};
export default Navbar;

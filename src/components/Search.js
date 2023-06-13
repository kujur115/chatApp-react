import profile from "../images/art.jpg";

const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder="find a user" />
      </div>
      <div className="userChat">
        <img src={profile} alt="" />
        <div className="userChatInfo">
          <span>James</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};
export default Search;

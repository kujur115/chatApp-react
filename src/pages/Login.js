const Login = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <sapn className="Logo">Messenger App</sapn>
        <sapn className="title"> </sapn>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button>Sign In</button>
        </form>
        <p>Don't have an account? Register</p>
      </div>
    </div>
  );
};

export default Login;

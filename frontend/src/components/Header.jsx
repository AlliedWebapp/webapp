import { FaSignOutAlt, FaSignInAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img
            src="https://github.com/ShaivyaaSharma/GITHUB/blob/main/logo.png?raw=true"
            alt="Logo"
            className="logo-image"
          />
        </Link>
      </div>

      {user && <SearchBar />}

      <ul>
        {user ? (
<li
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',  // aligns left
    marginLeft: '0',           // no left margin
    gap: '12px',
    fontSize: '0.85rem',
    width: '100%',
    maxWidth: '370px',         // (set to your SearchBar width)
  }}
>
  <span
    style={{
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '0', // ensure no indent
    }}
  >
    <FaUser style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
    {user.email}
  </span>
  <button
    className="btn"
    onClick={onLogout}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.9rem',
      padding: '6px 12px',
      marginLeft: '0', // line up left
      marginBottom: '18px',
    }}
  >
    <FaSignOutAlt style={{ fontSize: '1rem' }} />
    Logout
  </button>
  {/* SearchBar remains as is below */}
</li>




        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;


import "./Nav.css"
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";

const Nav = () => {
  const { isLoggedIn, logout } = useUser();

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const isAdmin = user && user.is_admin;
  console.log(`admin? ${isAdmin}`)

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="contain">
          <div className="left">
            <Link className="navbar-brand" to='/' style={{ color: '#b3ea11', fontSize:'25px' }}>RadiumLady</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <ul className="center">
            <li className="nav-item">
              <Link className="nav-link custom-button" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-button" to='/products'>Shop</Link>
            </li>
            {isAdmin === true && (
              <li className="nav-item">
                <Link className="nav-link custom-button" to="/admin-page">Admin</Link>
              </li>
            )}
          </ul>

          <ul className="right">
            <li className="nav-item">
              <Link to="/cart">
                <AiOutlineShoppingCart />
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/account">Account</Link>
                </li>
                <li className="nav-item">
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Nav;
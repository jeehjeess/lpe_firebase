import { Link, useNavigate } from "react-router-dom";
import { logout, auth } from '../firebaseConfig';
import { useAuthState } from "react-firebase-hooks/auth";
const Menu = () => {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bglight">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Posts
                    PWA</Link>
                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" arialabel="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse"
                    id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" ariacurrent="page" to="/">Home</Link>
                        </li>
                        {user &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle"
                                    href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Manutenções
                                </a><ul className="dropdown-menu" arialabelledby="navbarDropdown">
                                    <li><Link className="dropdown-item"
                                        to="/posts">Posts</Link></li>
                                </ul>
                            </li>}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle"
                                href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                {!user ? "Autenticar" : <> Usuário
                                    {user?.displayName} - UID: {user?.uid} - {user?.email} </>}
                            </a>
                            <ul className="dropdown-menu" arialabelledby="navbarDropdown">
                                {!user &&
                                    <li><Link className="dropdown-item"
                                        to="/login">Login</Link></li>
                                } {
                                    user &&
                                    <li><a className="dropdown-item"
                                        href="/"
                                        onClick={() => {
                                            logout();
                                            navigate("/");
                                        }}>Logout</a></li>
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};
export default Menu;
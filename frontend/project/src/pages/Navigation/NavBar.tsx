import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../store/store";
import { setLogOut } from "../../store/reduxSlices/userSlice/UserSlice";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get logged-in user and token from Redux
  const { userStoraged, token } = useSelector(
    (state: RootState) => state.userSlice.userStore,
  );

  // Check if user is logged in
  const isLoggedIn = Boolean(token && userStoraged);

  // Get first letter of firstname and lastname
  const initials = userStoraged
    ? `${userStoraged.firstname.charAt(0)}${userStoraged.lastname.charAt(0)}`.toUpperCase()
    : "";

  function navigateUrl(route: string) {
    switch (route) {
      case "home":
        navigate("/");
        break;
      case "register":
        navigate("/register");
        break;
      case "login":
        navigate("/login");
        break;
      default:
        break;
    }
  }

  // Logout function
  function handleLogout() {
    dispatch(setLogOut());
    setDropdownOpen(false);
    navigate("/login");
  }

  return (
    <nav>
      <ul>
        <li onClick={() => navigateUrl("home")}>Home</li>

        {!isLoggedIn ? (
          <>
            <li onClick={() => navigateUrl("register")}>Register</li>

            <li onClick={() => navigateUrl("login")}>Login</li>
          </>
        ) : (
          <li className="user-menu">
            <button
              type="button"
              className="user-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {initials}
            </button>

            {dropdownOpen && userStoraged && (
              <div className="user-dropdown">
                <h3>
                  {userStoraged.firstname} {userStoraged.lastname}
                </h3>

                <p>@{userStoraged.username}</p>
                <p>{userStoraged.email}</p>
                <button
                  onClick={() => {
                    if (userStoraged) {
                      navigate(`/userinfo/${userStoraged.firebaseUid}`);
                      setDropdownOpen(false);
                    }
                  }}
                >
                  User Information
                </button>

                <hr />

                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
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
    return route;
  }
  return (
    <div>
      <ul>
        <li
          onClick={() => {
            navigateUrl("home");
          }}
        >
          Home
        </li>
        <li
          onClick={() => {
            navigateUrl("register");
          }}
        >
          Register
        </li>
        <li
          onClick={() => {
            navigateUrl("login");
          }}
        >
          Login
        </li>
      </ul>
    </div>
  );
}

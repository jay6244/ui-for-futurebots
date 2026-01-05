import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";
import Manuals from "./pages/Manuals.jsx";

const authed = () => Boolean(localStorage.getItem("fb_user"));

function Protected({ children }) {
  return authed() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/chat"
        element={
          <Protected>
            <Chat />
          </Protected>
        }
      />

      <Route
        path="/manuals"
        element={
          <Protected>
            <Manuals />
          </Protected>
        }
      />

      <Route
        path="*"
        element={<Navigate to={authed() ? "/chat" : "/login"} replace />}
      />
    </Routes>
  );
}

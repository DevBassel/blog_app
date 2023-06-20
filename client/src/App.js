import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashbord from "./pages/Dashbord";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./pages/Header";
import Profile from "./pages/Profile";
import AddPost from "./pages/AddPost";
import ViewProfile from "./pages/ViewProfile";
import Setting from "./pages/Setting";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashbord />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/profile" element={<Profile />}>
              <Route path="setting" element={<Setting />} />
            </Route>
            <Route path="/addPost" element={<AddPost />} />
            <Route path="/users/:id" element={<ViewProfile />} />

            <Route
              path="*"
              element={
                <>
                  <h1>Not Found</h1>
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

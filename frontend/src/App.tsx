import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddBusPage from "./pages/AddBusPage";
import UserProfilePage from "./pages/UserProfilePage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/addbus" element={<AddBusPage/>}/>
        <Route path="/user/profile" element={<UserProfilePage/>}/>
        <Route path="/search" element={<SearchPage/>}/>
      </Routes>
    </>
  );
}

export default App;

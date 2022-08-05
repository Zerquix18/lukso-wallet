import { Route, Routes } from "react-router-dom";
import { Layout } from "../../components";
import Controllers from "./Controllers";
import Profile from "./Profile";

function Authenticated() {
  return (
    <Layout>
      <Routes>
        <Route path="/controllers" element={<Controllers />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default Authenticated;

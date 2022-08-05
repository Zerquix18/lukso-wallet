import { Route, Routes } from "react-router-dom";
import { Layout } from "../../components";

import Controllers from "./Controllers";
import Profile from "./Profile";
import Send from "./Send";
import Assets from "./Assets";

function Authenticated() {
  return (
    <Layout>
      <Routes>
        <Route path="/controllers" element={<Controllers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/send" element={<Send />} />
        <Route path="/assets" element={<Assets />} />
      </Routes>
    </Layout>
  );
}

export default Authenticated;

import { Route, Routes } from "react-router-dom";
import { Layout } from "../../components";

import Controllers from "./Controllers";
import Profile from "./Profile";
import Send from "./Send";
import Assets from "./Assets";
import Sign from "./Sign";
import Vaults from "./Vaults";

function Authenticated() {
  return (
    <Layout>
      <Routes>
        <Route path="/controllers" element={<Controllers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/send" element={<Send />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/vaults" element={<Vaults />} />
      </Routes>
    </Layout>
  );
}

export default Authenticated;

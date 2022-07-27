import { Route, Routes } from "react-router-dom";
import { Layout } from "../../components";
import Controllers from "./Controllers";

function Authenticated() {
  return (
    <Layout>
      <Routes>
        <Route path="/controllers" element={<Controllers />} />
      </Routes>
    </Layout>
  );
}

export default Authenticated;

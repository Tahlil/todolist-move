import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Layout, Row, Col } from "antd";

function App() {
  return (
    <>
      {" "}
      <Layout>
        {" "}
        <Row align="middle">
          {" "}
          <Col span={10} offset={2}>
            {" "}
            <h1>Our todolist</h1>{" "}
          </Col>{" "}
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            {" "}
            <h1>Connect Wallet</h1>{" "}
          </Col>{" "}
        </Row>{" "}
      </Layout>{" "}
    </>
  );
}

export default App;

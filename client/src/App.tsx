import React, {useEffect, useState} from "react";

import logo from "./logo.svg";
import { Provider, Network } from "aptos";
import "./App.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button } from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
const provider = new Provider(Network.DEVNET);

function App() {
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const fetchList = async () => {
    if (!account) return [];
    // change this to be your module account address
    const moduleAddress = "0xaeb489f1b55ebb7b00926879ea2dceaf7bac94556649b83e1dd1a2bf41c017c8";
    try {
      const TodoListResource = await provider.getAccountResource(
        account.address,
        `${moduleAddress}::todolist::TodoList`
      );
      setAccountHasList(true);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };
  const { account } = useWallet();
  useEffect(() => {
    fetchList();
  }, [account?.address]);
  return (
    <>
    <Layout>
      <Row align="middle">
        <Col span={10} offset={2}>
          <h1>Our todolist</h1>
        </Col>
        <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
          <WalletSelector />
        </Col>
      </Row>
    </Layout>
    {!accountHasList && (
      <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
        <Col span={8} offset={8}>
          <Button block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
            Add new list
          </Button>
        </Col>
      </Row>
    )}
  </>
  );
}

export default App;



import React, { useEffect, useState } from "react";

import logo from "./logo.svg";
import { Provider, Network } from "aptos";
import "./App.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin } from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
const provider = new Provider(Network.DEVNET);
type Task = {
  address: string;
  completed: boolean;
  content: string;
  task_id: string;
};

function App() {
  const moduleAddress =
  "0xaeb489f1b55ebb7b00926879ea2dceaf7bac94556649b83e1dd1a2bf41c017c8";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  

  const fetchList = async () => {
    if (!account) return [];
  try {
    const TodoListResource = await provider.getAccountResource(
      account?.address,
      `${moduleAddress}::todolist::TodoList`
    );
    setAccountHasList(true);
        // tasks table handle
    const tableHandle = (TodoListResource as any).data.tasks.handle;
        // tasks table counter
    const taskCounter = (TodoListResource as any).data.task_counter;

    let tasks = [];
    let counter = 1;
    while (counter <= taskCounter) {
      const tableItem = {
        key_type: "u64",
        value_type: `${moduleAddress}::todolist::Task`,
        key: `${counter}`,
      };
      const task = await provider.getTableItem(tableHandle, tableItem);
      tasks.push(task);
      counter++;
    }
    
        // set tasks in local state
    setTasks(tasks);
  } catch (e: any) {
    setAccountHasList(false);
  }
  };

  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::todolist::create_list`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };
  

  
  const { account, signAndSubmitTransaction } = useWallet();
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
            <Button
              onClick={addNewList}
              block
              type="primary"
              style={{ height: "40px", backgroundColor: "#3f67ff" }}
            >
              Add new list
            </Button>
          </Col>
        </Row>
      )}
      <Spin spinning={transactionInProgress}>
      {!accountHasList && (
        <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
          <Col span={8} offset={8}>
            <Button onClick={addNewList} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
              Add new list
            </Button>
          </Col>
        </Row>
      )}
    </Spin>
    </>
  );
}

export default App;


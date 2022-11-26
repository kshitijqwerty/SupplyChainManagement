import { Button, Form, Input } from "antd";
import React from "react";
import "antd/dist/antd.css";
import { Footer, Header } from "antd/lib/layout/layout";

function Login(props) {
  const onFinish = (values) => {
    console.log("Success:", values);
    if (values.username === "admin") {
      console.log("Hi");
      props.setAdmin(true);
      props.setLogin(false);
    }
    else if(values.username==="MRF" || values.username==="CEAT" || values.username==="Vedanta"){
      console.log("Supplier.");
      props.setSupplier(true);
      props.setName(values.username);
      props.setLogin(false);

    } 
    else if(values.username==="Tata" || values.username==="Maruti"){
      console.log("Manufacturer.");
      props.setManufacturer(true);
      props.setName(values.username);
      props.setLogin(false);
    }
    else if(values.username==="Buyer1"|| values.username==="Buyer2"||values.username==="Buyer3"){
      console.log("Buyer.");
      props.setBuyer(true);
      props.setName(values.username);
      props.setLogin(false);
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      
      

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 12,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Footer></Footer>
    </div>
  );
}

export default Login;

import { Button, Form, Input, Result, Select } from "antd";
import React, { useState } from "react";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

function Buyer(props) {
  const [form] = Form.useForm();
  const [result, setResult] = useState("");

  const onFinish = (values) => {
    console.log(values);
    props.setBuyerOb({ ...values, buyFl: 1 });
  };

  const onReset = () => {
    form.setFieldsValue({
      buy_from: "",
    });
    setResult("");
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <br />
      <br />
      <Form.Item name="buy_from" label="Enter Supplier Name">
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type="link"
          onClick={() => {
            setResult("Validated");
          }}
        >
          Check Validity
        </Button>
        <a style={{ color: "green", fontSize: "150%" }}>
          {" "}
          &nbsp; &nbsp; {result}
        </a>
      </Form.Item>

      <br />

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Buy
        </Button>

        <Button type="link" htmlType="button" onClick={onReset}>
          Reset form
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Buyer;

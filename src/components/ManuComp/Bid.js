import { Button, Form, Input } from "antd";
import React from "react";

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

function Bid(props) {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("bid:",values);
    props.setManuOb({...values,manuFl1:1});
  };

  const onReset = () => {
    form.setFieldsValue({
      quantity: "",
      price: "",
      bid_sup: ""
    });
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        name="bid_sup"
        label="Set Supplier Name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="price"
        label="Set Price"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Quantity"
      >
        <Input/>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>

        <Button type="link" htmlType="button" onClick={onReset}>
          Reset form
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Bid;

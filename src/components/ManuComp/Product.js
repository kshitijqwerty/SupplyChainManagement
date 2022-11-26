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

function Product(props) {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("prod",values);
    props.setManuOb({...values,manuFl3:1});
  };

  const onReset = () => {
    form.setFieldsValue({
      'make_product': "",
    });
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        name="make_product"
        label="Quantity of Products"
      >
        <Input />
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

export default Product;

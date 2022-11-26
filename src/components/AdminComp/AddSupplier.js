import { Button, Form, Input, Select } from "antd";
import React from "react";
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

function AddSupplier(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    
    props.setSupOb({...values, "adminFl":1});
  };

  const onReset = () => {
    form.setFieldsValue({
      sname: "",
      type: "",
      saddr:""
    });
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        name="sname"
        label="Supplier Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="saddr"
        label="Supplier address"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type"
        label="Type of part"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select type  "
          allowClear
        >
          <Option value="1">car body</Option>
          <Option value="0">wheels (Set of 4)</Option>
        </Select>
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

export default AddSupplier;

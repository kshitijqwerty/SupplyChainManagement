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

function AddManufacturer(props) {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
   
    props.setManuOb({...values, "adminFl":1});
    
  };

  const onReset = () => {
    form.setFieldsValue({
      mname: "",
      maddr: ""
    });
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        name="mname"
        label="Manufaturer Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="maddr"
        label="Manufaturer Address"
        rules={[
          {
            required: true,
          },
        ]}
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

export default AddManufacturer;

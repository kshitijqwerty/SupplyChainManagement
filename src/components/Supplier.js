
 import { Button, Form, Input } from "antd";
  import { Footer, Header } from "antd/lib/layout/layout";
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
 
function Supplier(props){

    const [form] = Form.useForm();
    const onFinish = (values) => {
      props.setSupplierOb({...values, 'supplierFl':1});
      props.setCurLim(values.limit);
    };

    const onReset = () => {
    form.setFieldsValue({
        limit: "",
    });
    };

    return (
    <div>
        
        <br/>
        <br/>

            <Form {...layout} form={form} onFinish={onFinish}>

                <Form.Item
                label="Current limit"
                >
                <a>{props.curLim}</a>
                </Form.Item>

                <Form.Item
                name="limit"
                label="Set Supply Limit"
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

    </div>
    );

     
}
export default Supplier;
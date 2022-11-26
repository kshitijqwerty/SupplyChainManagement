import { Button, Form, Input, Menu, Select, Space } from "antd";
import { Footer, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import AddManufacturer from "./AdminComp/AddManufacturer";
import AddSupplier from "./AdminComp/AddSupplier";
const { Option } = Select;


export default function Admin(props) {
    const [addSup, setAddSup]= useState(true);
    const [addManu, setAddManu]= useState(false);
    const [supOb,setSupOb]=useState(0);
  
  return (
    <div>
        
        <Header  style={{backgroundColor: "teal"}}>
            <Space>
                <Button type="link" style={{color:"white", fontWeight:"bolder", fontSize:"120%"}} onClick={()=>{setAddSup(true); setAddManu(false);}}>Add Supplier</Button>
                <Button type="link" style={{color:"white", fontWeight:"bolder", fontSize:"120%"}} onClick={()=>{setAddManu(true); setAddSup(false);}}>Add Manufaturer</Button>
            </Space>
        </Header>

        <br/>
        <br/>

        {addSup==true? <AddSupplier setSupOb={props.setAdminObSup}/>:null}
        {addManu==true? <AddManufacturer setManuOb={props.setAdminObManu}/>:null}
       
   
    </div>
  );
}

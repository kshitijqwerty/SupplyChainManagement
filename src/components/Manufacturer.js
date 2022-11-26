
import { Button, Space } from "antd";
import { Footer, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import Bid from "./ManuComp/Bid";
import Price from "./ManuComp/Price";
import Product from "./ManuComp/Product";

 
function Manufacturer(props){

    const [bid,setBid] = useState(true);
    const [price,setPrice] = useState(false);
    const [product,makeProduct] = useState(false);

    return (
    <div>
        <Header  style={{backgroundColor: "teal"}}>
            {/* <h1>{props.name} Page </h1> */}
            <Space>
                <Button type="link" style={{color:"white", fontWeight:"bolder", fontSize:"120%"}} onClick={()=>{setBid(true); setPrice(false); makeProduct(false);}}>Bid</Button>
                <Button type="link" style={{color:"white", fontWeight:"bolder", fontSize:"120%"}} onClick={()=>{setBid(false); setPrice(true); makeProduct(false);}}>Product Price</Button>
                <Button type="link" style={{color:"white", fontWeight:"bolder", fontSize:"120%"}} onClick={()=>{setBid(false); setPrice(false); makeProduct(true);}}>Make Product</Button>
            </Space>
        </Header>

        <br/>
        <br/>

        {bid===true? <Bid setManuOb={props.setManuOb}/>:null}
        {product===true? <Product setManuOb={props.setManuOb}/>:null}
        {price===true? <Price setManuOb={props.setManuOb}/>:null}
        
        
        <br/>
        <br/>
       
    </div>
    );

     
}
export default Manufacturer;
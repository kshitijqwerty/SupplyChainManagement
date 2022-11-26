import React, { useState, useEffect } from "react";
import Admin from "./components/Admin";
import Supplier from "./components/Supplier";
import Manufaturer from "./components/Manufacturer";
import Buyer from "./components/Buyer";
import { Button, Table } from "antd";
import { Footer, Header } from "antd/lib/layout/layout";

export default function Main() {
  ///objects for each ROLE
  const [adminObSup, setAdminObSup] = useState({ adminFl: 0 });
  const [adminObManu, setAdminObManu] = useState({ adminFl: 0 });

  const [supplierOb, setSupplierOb] = useState({ limit: "0", supplierFl: 0 });

  const [manuOb, setManuOb] = useState({ manuFl1: 0, manuFl2: 0, manuFl3: 0 });
  const [buyerOb, setBuyerOb] = useState({ buyFl: 0 });

  ///supplier current limit => global
  const [curLim, setCurLim] = useState(0);

  ///bool variables to set page
  const [admin, setAdmin] = useState(false);
  const [supplier, setSupplier] = useState(false);
  const [manufacturer, setManufacturer] = useState(false);
  const [buyer, setBuyer] = useState(false);

  ///access network, address of account, balance
  const [network, setNetwork] = useState();
  const [balance, setBalance] = useState();

  ///contract + web3
  const Web3 = require("web3");
  const SupplyChainContract = require("./build/contracts/SupplyChain.json");
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); //Web3.givenProvider|| = metamask

  let account;

  ///data source
  const [id, genId] = useState(4);

  const [dataSource, setDataSource] = useState([
    { key: 1, supplier: "MRF", limit: 20 },
    { key: 2, supplier: "Vedanta", limit: 40 },
    { key: 3, supplier: "CEAT", limit: 12 },
  ]);
  let columns = [
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Limit",
      dataIndex: "limit",
      key: "limit",
    },
  ];

  /** Gets run on change of the dependencies specified below. The flag
   *  variables for each of the admin, supplier, buyer and change in manufacturer
   *  objects are detected. If the flag variables are set to 1 and the type of the
   *  user is true, the functions to smartcontract are called.
   */
  useEffect(() => {
    if (
      admin === true &&
      (adminObSup.adminFl === 1 || adminObManu.adminFl === 1)
    ) {
      console.log("admin use effect");
      fun0();
    } else if (supplier === true && supplierOb.supplierFl === 1) {
      console.log("supplier useeffect");
      fun1();
    } else if (
      manufacturer === true &&
      (manuOb.manuFl1 === 1 || manuOb.manuFl2 === 1 || manuOb.manuFl3 === 1)
    ) {
      console.log("manufacturer useeffect");
      fun2();
    } else if (buyer === true && buyerOb.buyFl === 1) {
      console.log("buyer useeffect");
      fun3();
    }
  }, [
    adminObSup.adminFl,
    adminObManu.adminFl,
    supplierOb.supplierFl,
    manuOb,
    buyerOb.buyFl,
  ]);

  /** Called on click of enter buttton. Sets connection
   *  to web3 and establishes smartcontract.
   */
  const init = async () => {
    let acc = await web3.eth.getAccounts();
    window.account = acc[0];
    console.log(window.account);
    console.log("account: " + account);
    const id = await web3.eth.net.getId();
    const deployedNetwork = SupplyChainContract.networks[id];
    window.contract = await new web3.eth.Contract(
      SupplyChainContract.abi,
      deployedNetwork.address,
      { gas: 999999999 }
    );

    loadBal();
    getAddress(window.account);
  };

  /// calling functions from contract
  ///adds manufacturer
  function addManufacturer(acc, name) {
    window.contract.methods
      .addManufacturer(acc, name)
      .send({ from: window.account });
  }

  /// adding supplier from admin
  function addSupplier(acc, name, type) {
    window.contract.methods
      .addSupplier(acc, name, type)
      .send({ from: window.account });
  }

  /// setting limit from supplier
  function setSupLimit(lim) {
    window.contract.methods.set_limit(lim).send({ from: window.account });
  }

  /// setting bids from manufacturer
  function setBids(name, price, quantity) {
    let num = price * quantity;
    window.contract.methods.set_bids(name, price, quantity).send({
      from: window.account,
      value: web3.utils.toWei(num.toString(), "ether"),
    });
  }

  ///setting price for productx from manufacturer
  function setPrice(price) {
    window.contract.methods.set_price(price).send({ from: window.account });
  }

  /// making product from manufacturer
  function makeProduct(quantity) {
    window.contract.methods
      .make_product(quantity)
      .send({ from: window.account });
  }

  /// buying product from buyer
  function buyProduct(name) {
    let price = window.contract.methods.get_price(name).call();
    price.then(function (result) {
      window.contract.methods.buy_product(name).send({
        from: window.account,
        value: web3.utils.toWei(result.toString(), "ether"),
      });
    });
   
  }

  /// getting limit from supplier
  function getLimitName(name) {
    return window.contract.methods.get_limit_name(name).call();
  }

  /// getting limit from supplier
  function getLimit(add) {
    return window.contract.methods.get_limit(add).call();
  }

  /// setting header info
  async function loadBal() {
    console.log("window.account", window.account);
    const network = await web3.eth.net.getNetworkType();
    const balance = await web3.eth.getBalance(window.account);

    setNetwork(network);
    setBalance(balance / 1e18);
  }

  ///getting address and using it to set page
  function getAddress() {
    console.log("After init: Address: ", window.account);
    ///pass address and get role
    let role;
    let promiseA = window.contract.methods
      .get_role()
      .call({ from: window.account });
    console.log("promiseA: ", promiseA);
    promiseA.then(function (result) {
      role = result;
      console.log("role: " + role);
      const x = document.getElementsByClassName("startPage")[0];
      switch (role) {
        case "0":
          ///admin
          x.style.display = "none";
          setAdmin(true);
          setSupplier(false);
          setManufacturer(false);
          setBuyer(false);
          break;
        case "1":
          ///Supplier
          /// setCurLim(supplierOb.limit);
          x.style.display = "none";
          let val = getLimit(window.account);
          val.then(function (result) {
            console.log("limit: " + result);
            setCurLim(result);
          });

          setSupplier(true);
          setAdmin(false);
          setManufacturer(false);
          setBuyer(false);
          break;
        case "2":
          ///Manufacturer
          x.style.display = "none";
          setManufacturer(true);
          setSupplier(false);
          setAdmin(false);
          setBuyer(false);
          break;
        case "3":
          ///Buyer
          x.style.display = "none";

          setBuyer(true);
          setManufacturer(false);
          setSupplier(false);
          setAdmin(false);
          break;
      }
    });
   
  }

  ///calls to admin functions from contract
  function fun0() {
    /*  adminOpSup = {sname, saddr, type}
        adminObManu = {mname, maddr}     */

    ///call to addSupplier, addManufacturer

    console.log("Admin sup and manu ob:", adminObSup, adminObManu);

    if (adminObSup.adminFl === 1) {
      addSupplier(adminObSup.saddr, adminObSup.sname, adminObSup.type);
    }
    if (adminObManu.adminFl === 1) {
      addManufacturer(adminObManu.maddr, adminObManu.mname);
    }
    setAdminObSup({ ...adminObSup, adminFl: 0 });
    setAdminObManu({ ...adminObManu, adminFl: 0 });
  }
  ///calls to suplier functions from contract
  function fun1() {
    ///setLimit
    console.log("Supplier ob:", supplierOb);
    setSupLimit(supplierOb.limit);

    setSupplierOb({ ...supplierOb, supplierFl: 0 });
  }

  ///calls to manufacturer functions from contract
  function fun2() {
    console.log("Manufacturer ob:", manuOb);
    ///{bid_sup,price,quantity}
    ///{price}
    ///{make-product}
    if (manuOb.manuFl1 === 1) {
      setBids(manuOb.bid_sup, manuOb.price, manuOb.quantity);
    } else if (manuOb.manuFl2 === 1) {
      setPrice(manuOb.price);
    } else if (manuOb.manuFl3 === 1) {
      makeProduct(manuOb.make_product);
    }
    setManuOb({ ...manuOb, manuFl1: 0, manuFl2: 0, manuFl3: 0 });
  }

  ///calls to buyer functions from contract
  function fun3() {
    buyProduct(buyerOb.buy_from);
    setBuyerOb({ ...buyerOb, buyFl: 0 });
  }

  return (
    <div>
      <a> &nbsp;&nbsp;&nbsp;&nbsp; Your account: {account}</a>
      <a> &nbsp;&nbsp;&nbsp;&nbsp; Your network: {network}</a>
      <a> &nbsp;&nbsp;&nbsp;&nbsp; Your balance: {balance} ETH</a>

      <br />
      <br />
      <Header style={{ backgroundColor: "teal" }}>
        <a
          style={{
            color: "Azure",
            fontSize: "250%",
            fontWeight: "bold",
            fontFamily: "Helvetica",
          }}
        >
          {" "}
          Double Doge{" "}
        </a>
        <a
          type="link"
          style={{ marginLeft: "50%", color: "Cornsilk", fontSize: "150%" }}
          onClick={() => {
            document.getElementsByClassName("showLimit")[0].style.display =
              "block";
          }}
        >
          Supply limit
        </a>

        <a
          type="link"
          style={{ marginLeft: "3%", color: "Cornsilk", fontSize: "100%" }}
          onClick={() => {
            document.getElementsByClassName("showLimit")[0].style.display =
              "none";
          }}
        >
          Hide limit
        </a>
      </Header>

      <div
        className="startPage"
        style={{
          display: "block",
          textAlign: "center",
          justifyContent: "center",
          fontSize: "bold",
          fontSize: "250%",
          fontFamily: "Helvetica",
        }}
      >
        <br />
        <br />
        <p>Welcome to our Supply Chain Management site!</p>
        <p>Click the button to proceed.</p>
        <Button
          onClick={init}
          type="primary"
          style={{
            width: "25%",
            height: "17%",
            fontSize: "90%",
            backgroundColor: "teal",
            color: "Azure",
          }}
        >
          Enter
        </Button>
      </div>

      {admin == true ? (
        <Admin
          setAdmin={setAdmin}
          setAdminObSup={setAdminObSup}
          setAdminObManu={setAdminObManu}
        />
      ) : null}
      {supplier === true ? (
        <Supplier
          setSupplierOb={setSupplierOb}
          curLim={curLim}
          setCurLim={setCurLim}
        />
      ) : null}
      {manufacturer === true ? (
        <Manufaturer setManufacturer={setManufacturer} setManuOb={setManuOb} />
      ) : null}
      {buyer === true ? <Buyer setBuyerOb={setBuyerOb} /> : null}

      <br />
      <br />
      <div
        className="showLimit"
        style={{
          display: "none",
          width: "100%",
          paddingLeft: "25%",
          paddingRight: "25%",
        }}
      >
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
      <br />
      <Footer>
        <Button
          type="link"
          onClick={() => {
            setSupplier(false);
            setAdmin(false);
            setManufacturer(false);
            setBuyer(false);
            document.getElementsByClassName("startPage")[0].style.display =
              "block";
          }}
        >
          Back to login page
        </Button>
      </Footer>
    </div>
  );
}

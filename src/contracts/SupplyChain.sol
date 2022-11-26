// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
contract SupplyChain {
    //declarations of data type and structs
    enum Role {
        DEF,
        SUP,
        MANF,
        CUST
    }
    enum Type {
        TYRE,
        BODY
    }

    uint256 private productID;
    uint256 private materialID;
    uint256 private bidID;
    address private isOwner;

    struct supplier {
        address uid;
        string name;
        uint256 limit;
        Role role;
        Type typ;
    }

    struct manufacturer {
        address uid;
        string name;
        Role role;
        uint256 price;
        uint256 numTyres;
        uint256 numBody;
        uint256 numProduct;
    }

    struct customer {
        address uid;
        string name;
        Role role;
    }

    struct material {
        uint256 uid;
        address owner;
        string brand;
        Type typ;
    }

    struct product {
        uint256 uid;
        uint256 tyreID;
        uint256 bodyID;
        address owner;
        string brand;
    }

    struct bid {
        uint256 uid;
        address bidder;
        uint256 quantity;
        uint256 price;
    }

    //mappings required
    mapping(address => supplier) private suppliers;
    mapping(address => manufacturer) private manufacturers;
    mapping(address => customer) private customers;
    mapping(uint256 => product) private products;
    mapping(uint256 => material) private materials;
    mapping(string => bid[]) private bid_map;
    mapping(address => mapping(Type => uint256[])) private material_map;
    mapping(address => uint256[]) private product_map;
    mapping(string => address) public name2Add;


    constructor() {
        isOwner = msg.sender;
    }

function toString(bytes memory data) public pure returns(string memory) {
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < data.length; i++) {
        str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
    }
    return string(str);
}


    function addManufacturer(address uid, string memory name) public {
        /*
        *    Adds a new manufacturer to the supply chain
        *    Input: uid, name
        */
        require(msg.sender == isOwner, "Method not Allowed");
        manufacturer memory m = manufacturer(uid, name, Role.MANF, 0, 0, 0, 0);
        manufacturers[uid] = m;
        name2Add[name] = uid;
    }

    function getUID(string memory name) view public returns (string memory){
        return toString(abi.encodePacked(name2Add[name]));
    }

    function addSupplier(address uid, string memory name, Type part) public {
        /*
        *    Adds a new supplier to the supplychain
        *    Input: uid, name, part-carbody or tyre
        */
        require(msg.sender == isOwner, "Method not Allowed");
        supplier memory s = supplier(uid, name, 0, Role.SUP, part);
        suppliers[uid] = s;
        name2Add[name] = uid;
    }


    function addCustomer(string memory name) public {
        /*
        *    Add new Customer
        *    Input: Name of the customer
        */
        customer memory c = customer(msg.sender,name,Role.CUST);
        customers[msg.sender] = c;
    }

    
    function set_limit(uint256 val) public {
        /*
        *    Set limit on the amount of suppliers and creates materials
        *    Input: value to set in limit
        */
        supplier memory temp = suppliers[msg.sender];
        require(temp.role == Role.SUP, "Method Not Allowed");
        uint256 prev_limit = suppliers[msg.sender].limit;
        uint256 final_limit = val - prev_limit;
        suppliers[msg.sender].limit = val;
        for (uint256 i = 0; i < final_limit; i++) {
            material memory m = material(
                ++materialID,
                temp.uid,
                temp.name,
                temp.typ
            );
            materials[materialID] = m;
            material_map[msg.sender][temp.typ].push(materialID);
        }
    }

    
    function set_bids( string memory sup_name,uint256 price,uint256 quantity) public payable {
        /*
        *    Manufacturer can set bids, it is stored in a bid_map and gets a unique bidID
        *    Input: supplier name, price, quantity
        */
        manufacturer memory temp = manufacturers[msg.sender];
        require(temp.role == Role.MANF, "Method Not Allowed");
        if(get_limit_name(sup_name) == 0){
            sendmoney(msg.value, msg.sender);
            require(false,"Supplyer limit exhasted");
        }
        require(msg.value >= quantity*price*(1 ether),"Insufficient balance");
        if(msg.value > quantity*price*(1 ether))
            sendmoney(msg.value - quantity*price*(1 ether), msg.sender);
        for (uint256 i = 0; i < bid_map[sup_name].length; i++) {
            require(bid_map[sup_name][i].bidder != msg.sender,"Bidder Already Placed");
        }
        bid memory b = bid(++bidID, temp.uid, quantity, price);
        bid_map[sup_name].push(b);
        resource_allocator(sup_name);
        
    }

    
    function resource_allocator(string memory sup_name) internal {
        /*
        *    Resource Allocator Algorithm - used by Smart Contract
        *    Input: supplier name
        */

        //check the hashed values to compare strings for Tyres Suppliers
        if (
            keccak256(bytes(sup_name)) == keccak256(bytes("MRF")) ||
            keccak256(bytes(sup_name)) == keccak256(bytes("CEAT"))
        ) {
            bid[] memory bids = bid_map[sup_name];
            //no competitor for resources
            if (bids.length == 1) {
                bid_map[sup_name].pop();

                uint256 quant_bid = bids[0].quantity;
                address bidder = bids[0].bidder;
                uint256 sup_limit = suppliers[name2Add[sup_name]].limit;
                uint256 price = bids[0].price;
                uint256 final_quant = quant_bid > sup_limit
                    ? sup_limit
                    : quant_bid;
                if(quant_bid > final_quant )
                    sendmoney((quant_bid - final_quant)*(price)*(1 ether), msg.sender);
                sendmoney(price*final_quant*(1 ether), name2Add[sup_name]);
                manufacturers[bids[0].bidder].numTyres += final_quant;
                uint256[] memory mids = material_map[name2Add[sup_name]][
                    Type.TYRE
                ];
                for (uint256 i = 0; i < final_quant; i++) {
                    materials[mids[sup_limit - i - 1]].owner = bidder;
                    material_map[bidder][Type.TYRE].push(
                        mids[sup_limit - i - 1]
                    );
                    material_map[name2Add[sup_name]][Type.TYRE].pop();
                }
                sup_limit -= final_quant;
                suppliers[name2Add[sup_name]].limit = sup_limit;
                
            }
        } else if (keccak256(bytes(sup_name)) == keccak256(bytes("Vedanta"))) {
            bid[] memory bids = bid_map[sup_name];

            //there are 2 manufacturers for same supplier
            if (bids.length == 2) {
                uint256 quant_bid1 = bids[0].quantity;
                uint256 quant_bid2 = bids[1].quantity;
                uint256 numtyre1 = manufacturers[bids[0].bidder].numTyres;
                uint256 numtyre2 = manufacturers[bids[1].bidder].numTyres;
                bid_map[sup_name].pop();
                bid_map[sup_name].pop();
                require(
                    numtyre1 > 0 && numtyre2 > 0,
                    "Bid cannot proceed fairly, Both parties should have necessary materials"
                );
                uint256 sup_limit = suppliers[name2Add[sup_name]].limit;
                uint256 final_bid1 = numtyre1 > quant_bid1
                    ? quant_bid1
                    : numtyre1;
                uint256 final_bid2 = numtyre2 > quant_bid2
                    ? quant_bid2
                    : numtyre2;
                uint256[] memory pids = material_map[name2Add[sup_name]][
                    Type.BODY
                ];

                if (bids[0].price > bids[1].price) {
                    //look at price
                    final_bid1 = final_bid1 > sup_limit
                        ? sup_limit
                        : final_bid1;
                    final_bid2 = final_bid2 > (sup_limit - final_bid1)
                        ? sup_limit - final_bid1
                        : final_bid2;

                } else {
                    final_bid2 = final_bid2 > sup_limit
                        ? sup_limit
                        : final_bid2;

                    final_bid1 = final_bid1 > (sup_limit - final_bid2)
                        ? sup_limit - final_bid2
                        : final_bid1;
                }
                for (uint256 i = 0; i < final_bid1; i++) {
                    materials[pids[sup_limit - i - 1]].owner = bids[0].bidder;
                    material_map[bids[0].bidder][Type.BODY].push(
                        pids[sup_limit - i - 1]
                    );
                    material_map[name2Add[sup_name]][Type.BODY].pop();
                }
                sup_limit -= final_bid1;
                for (uint256 i = 0; i < final_bid2; i++) {
                    materials[pids[sup_limit - i - 1]].owner = bids[1].bidder;
                    material_map[bids[1].bidder][Type.BODY].push(
                        pids[sup_limit - i - 1]
                    );
                    material_map[name2Add[sup_name]][Type.BODY].pop();
                }
                sup_limit -= final_bid2;
                manufacturers[bids[0].bidder].numBody += final_bid1;
                manufacturers[bids[1].bidder].numBody += final_bid2;
                suppliers[name2Add[sup_name]].limit = sup_limit;
                sendmoney(final_bid1*bids[0].price*(1 ether) + final_bid2*bids[1].price*(1 ether), name2Add[sup_name]);
                //return excess ether
                if(quant_bid1 > final_bid1)
                    sendmoney((quant_bid1 - final_bid1)*(bids[0].price)*(1 ether), bids[0].bidder);
                if(quant_bid2 > final_bid2)
                    sendmoney((quant_bid2 - final_bid2)*(bids[1].price)*(1 ether), bids[1].bidder);
            }
        }
    }
    
    function set_price(uint256 val) public {
        /*
        *    Manufacturer sets price to the product
        *    Input: Retail price
        */
        require(
            manufacturers[msg.sender].role == Role.MANF,
            "Method Not Allowed"
        );
        manufacturers[msg.sender].price = val;
    }

    
    function make_product(uint256 quantity) public {
        /*
        *    Creates the product - used by manufacturer. Assigns unique UID, sets tyre ID and body ID to the product
        *    Input: quantity
        */
        manufacturer memory temp = manufacturers[msg.sender];
        require(temp.role == Role.MANF, "Method Not Allowed");
        require(
            quantity > 0 &&
                temp.numBody >= quantity &&
                temp.numTyres >= quantity,
            "Not Enough inventory"
        );

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tyr_id = material_map[temp.uid][Type.TYRE][
                temp.numTyres - i - 1
            ];
            material_map[temp.uid][Type.TYRE].pop();
            uint256 body_id = material_map[temp.uid][Type.BODY][
                temp.numBody - i - 1
            ];
            material_map[temp.uid][Type.BODY].pop();
            product memory p = product({
                uid: ++productID,
                owner: msg.sender,
                brand: temp.name,
                tyreID: tyr_id,
                bodyID: body_id
            });
            products[productID] = p;
            product_map[msg.sender].push(productID);
        }
        manufacturers[msg.sender].numBody -= quantity;
        manufacturers[msg.sender].numTyres -= quantity;
        manufacturers[msg.sender].numProduct += quantity;
    }

    function buy_product(string memory sname) public payable {
        /*
        *    Lets buyer buy the product. Buyer sends money required to buy product to manufacturer
        *    Input: manufacturer source name
        */
        manufacturer memory m = manufacturers[name2Add[sname]];
        require(m.numProduct > 0, "No Cars Available");
        require(msg.value >= m.price * (1 ether), "Need More Ether");
        if(msg.value > m.price*(1 ether)){
            sendmoney(msg.value - m.price*(1 ether), msg.sender);
        }
        uint256 pid = product_map[m.uid][m.numProduct - 1];
        product_map[m.uid].pop();

        //buyer has purchased, now ownership transfer
        manufacturers[name2Add[sname]].numProduct--;
        product_map[msg.sender].push(pid);
        products[pid].owner = msg.sender;
        product memory p = products[pid];

        materials[p.tyreID].owner = msg.sender;
        materials[p.bodyID].owner = msg.sender;

    }

    //checks validity of the product, and the items supplied by the supplier
    function verify(uint id) public view returns (string[6] memory){
        string[6] memory  response;
        if(products[id].owner==msg.sender){
            response[0]="Car ownership verified successfully";
        }
        else{
            response[0]="Car ownership not verified";
        }
        string memory a=products[id].brand;
        string memory b="Car brand is";
        response[1]=string(abi.encodePacked(b,' ',a));
        uint tyreid=products[id].tyreID;
        uint bodyid=products[id].bodyID;
        if(materials[tyreid].owner==msg.sender){
            response[2]="Tyre Ownership verified successfully";
        }
        else{
            response[2]="Tyre Ownership not verified";
        }
        a=materials[tyreid].brand;
        b="Tyre brand is";
        response[3]=string(abi.encodePacked(b,' ',a));

        if(materials[bodyid].owner==msg.sender){
            response[4]="Car Body Ownership verified successfully";
        }
        else{
            response[4]="Car body ownership not verified";
        }
        a=materials[bodyid].brand;
        b="Car body brand is";
        response[5]=string(abi.encodePacked(b,' ',a));
        return response;
    }


    function get_limit_name(string memory sup_name) public view returns (uint256) {
        supplier memory temp = suppliers[name2Add[sup_name]];
        return temp.limit;
    }

    function get_limit(address sup_add) public view returns (uint256) {
        supplier memory temp = suppliers[sup_add];
        return temp.limit;
    }

    function get_pid() public view returns (uint256){
        return product_map[msg.sender][0];
    }

    function get_price(string memory name) public view returns (uint256){
        return manufacturers[name2Add[name]].price;
    }

    function get_role() public view returns (uint256){
        if(isOwner == msg.sender){
            return 0;
        }else if(suppliers[msg.sender].role == Role.SUP){
            return 1;
        }else if(manufacturers[msg.sender].role == Role.MANF){
            return 2;
        }
        return 3;
    }

    function sendmoney(uint amount,address payaddr) internal {
        /*
        *    Internal function to send ether to accounts from contract;
        */
        address payable manuf = payable(payaddr);
        uint money;
        money = money + amount ;
        (bool sent,) = manuf.call{value:money}("");
        require(sent, "Cannot Send Amount");
        
    }
}

/*
Truffle console:

var bcs;
SupplyChain.deployed().then(function(instance) { bcs = instance; });

bcs.addManufacturer(accounts[1],"Maruti")
bcs.addManufacturer(accounts[2],"TATA")
bcs.addSupplier(accounts[3],"Vedanta",1)
bcs.addSupplier(accounts[4],"MRF",0)
bcs.addSupplier(accounts[5],"CEAT",0)
bcs.set_limit(14,{ from: accounts[3]})
bcs.set_limit(12,{ from: accounts[4]})
bcs.set_limit(10,{ from: accounts[5]})

bcs.set_bids("MRF",1,8,{ from: accounts[2],value:9000000000000000000})
bcs.get_num("TATA",1)

bcs.make_product(8,{ from: accounts[1]})
bcs.set_bids("CEAT",1,8,{ from: accounts[1],value:9000000000000000000})

bcs.set_bids("Vedanta",2,10,{ from: accounts[1], value :20000000000000000000})
bcs.set_bids("Vedanta",1,3,{ from: accounts[2],value : 3000000000000000000})

bcs.get_limit(accounts[5])
bcs.get_limit(accounts[4])
bcs.get_limit(accounts[3])
bcs.make_product(3,{from : accounts[1]})
bcs.set_price(2,{from : accounts[1]})
bcs.addCustomer("Kshitij",{from : accounts[9]})
bcs.buy_product("TATA",{from : accounts[9] , value : })
bcs.make_product(3,{from : accounts[1]})
bcs.get_pid({from : accounts[9]})
bcs.verify({from : accounts[9]})

*/
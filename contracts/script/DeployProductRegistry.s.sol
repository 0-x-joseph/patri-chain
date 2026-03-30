// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ProductRegistry} from "../src/ProductRegistry.sol";

contract DeployProductRegistry is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ProductRegistry registry = new ProductRegistry();

        vm.stopBroadcast();
        console.log("ProductRegistry deployed at:", address(registry));
    }
}
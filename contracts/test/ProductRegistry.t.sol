// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ProductRegistry} from "../src/ProductRegistry.sol";

contract ProductRegistryTest is Test {
    ProductRegistry public registry;

    function setUp() public {
        registry = new ProductRegistry();
    }

    function testRegisterProduct() public {
        registry.registerProduct("PROD-123", "HASH-ABC", address(1));
        
        (string memory hash, address artisan, uint256 timestamp, bool exists) = registry.getProduct("PROD-123");
        
        assertTrue(exists);
        assertEq(hash, "HASH-ABC");
        assertEq(artisan, address(1));
        assertGt(timestamp, 0);
    }

    function testCannotRegisterTwice() public {
        registry.registerProduct("PROD-123", "HASH-ABC", address(1));
        vm.expectRevert("Product already registered");
        registry.registerProduct("PROD-123", "HASH-DEF", address(2));
    }
}
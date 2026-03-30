// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        string productHash;
        address artisan;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Product) public products;

    event ProductRegistered(string indexed productId, string productHash, address indexed artisan, uint256 timestamp);

    function registerProduct(string memory productId, string memory productHash, address artisan) external {
        require(!products[productId].exists, "Product already registered");
        
        products[productId] = Product({
            productHash: productHash,
            artisan: artisan,
            timestamp: block.timestamp,
            exists: true
        });

        emit ProductRegistered(productId, productHash, artisan, block.timestamp);
    }

    function getProduct(string memory productId) external view returns (string memory productHash, address artisan, uint256 timestamp, bool exists) {
        Product memory p = products[productId];
        return (p.productHash, p.artisan, p.timestamp, p.exists);
    }
}
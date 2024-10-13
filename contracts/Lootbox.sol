// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lootbox {
    
    mapping(address => string[]) private userPrizes;

    // Events
    event LootboxBought(address indexed buyer, string lootboxType, string prize);

    // Modifier to check the correct Ether amount for each lootbox
    modifier correctPayment(uint256 price) {
        require(msg.value == price, "Incorrect ETH amount sent.");
        _;
    }

    // buy a wood box (1 ETH)
    function buyWoodBox() external payable correctPayment(1 ether) {
        string memory prize = getRandomPrize("Wood");
        userPrizes[msg.sender].push(prize);
        emit LootboxBought(msg.sender, "Wood", prize);
    }

    // buy a silver box (2 ETH)
    function buySilverBox() external payable correctPayment(2 ether) {
        string memory prize = getRandomPrize("Silver");
        userPrizes[msg.sender].push(prize);
        emit LootboxBought(msg.sender, "Silver", prize);
    }

    //  get the list of prizes for the caller
    function getMyPrizes() external view returns (string[] memory) {
        return userPrizes[msg.sender];
    }

    // Internal function to get a random prize based on lootbox type
    function getRandomPrize(string memory lootboxType) internal pure returns (string memory) {
        // For simplicity, we'll return a fixed prize here based on lootbox type
        if (keccak256(abi.encodePacked(lootboxType)) == keccak256(abi.encodePacked("Wood"))) {
            return "Wooden Sword";
        } else if (keccak256(abi.encodePacked(lootboxType)) == keccak256(abi.encodePacked("Silver"))) {
            return "Silver Shield";
        } else {
            return "Unknown Prize";
        }
    }
}

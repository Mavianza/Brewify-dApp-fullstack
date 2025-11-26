// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserProfile {
    enum Role { None, Buyer, Farmer, Logistics }

    struct Profile {
        Role role;
        string username;
        bool isRegistered;
    }

    mapping(address => Profile) public profiles;

    event UserRegistered(address indexed user, Role role, string username);

    // MAIN FUNCTION (SET + REGISTER)
    function setUserProfile(Role _role, string calldata _username) external {
        require(_role != Role.None, "Invalid role");
        require(bytes(_username).length > 0, "Username required");

        profiles[msg.sender] = Profile({
            role: _role,
            username: _username,
            isRegistered: true
        });

        emit UserRegistered(msg.sender, _role, _username);
    }

    // READ FUNCTIONS
    function getUser(address user) external view returns (uint8, string memory, bool) {
        Profile memory p = profiles[user];
        return (uint8(p.role), p.username, p.isRegistered);
    }


    function getRole(address user) external view returns (Role) {
        return profiles[user].role;
    }

    function getUsername(address user) external view returns (string memory) {
        return profiles[user].username;
    }
}

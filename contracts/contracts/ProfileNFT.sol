// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ERC6551AccountLib.sol";

contract ProfileNFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    event NFTMinted(address indexed creator, uint256 tokenId);
    
    constructor() ERC721("AIducationProfile", "AIP") {}

    struct Profile {
        uint256 tokenId;
        address creator;
        address tbaAddress;
    }

    mapping(uint256 => Profile) public profiles;
    mapping(uint256 => uint256) public tokenIdToUserTokenId;
    mapping(address => uint256) public creatorAddressToTokenId;

    function createProfile(uint256 userTokenId) public {
         require(userTokenId >= 0 && userTokenId <=3, "Token ID must be greater than 0 and less than 4");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        // _setTokenURI(tokenId, _uri);
        emit NFTMinted(msg.sender, tokenId);

        tokenIdToUserTokenId[tokenId] = userTokenId;
        creatorAddressToTokenId[msg.sender] = tokenId;
        address _tbaAddress = _computeTbaAddress(tokenId);

        Profile storage newMemory = profiles[tokenId];

        newMemory.creator = msg.sender;
        newMemory.tokenId = tokenId;
        newMemory.tbaAddress = _tbaAddress;
    }

    function donateToProfile(uint256 _tokenId) payable public {
        Profile storage _profile = profiles[_tokenId];

        require(msg.value <= msg.sender.balance, "insufficient funds");

        (bool success, ) = _profile.tbaAddress.call{value: msg.value, gas: 2300}("");
        require(success, "Transfer to creator failed");
    }

    function _computeTbaAddress(uint256 tokenId) internal view returns (address) {
        address registry = 0x02101dfB77FDE026414827Fdc604ddAF224F0921;
        address implementation = 0x2D25602551487C3f3354dD80D76D54383A243358;
        uint256 chainId = 80001; // Mumbai
        address tokenContract = address(this);
        bytes32 salt = 0;    

        address _tbaAddress = ERC6551AccountLib.computeAddress(
            registry, 
            implementation, 
            chainId, 
            tokenContract, 
            tokenId, 
            salt
        );

        return _tbaAddress;
    }

    // view functions (for frontend)

    function getTokenIdByAddress(address _address) public view returns (uint256) {
        return creatorAddressToTokenId[_address];
    }

    function getProfiles() public view returns (Profile[] memory) {
        Profile[] memory allProfiles = new Profile[](_tokenIdCounter.current());

        for (uint256 i = 0; i < _tokenIdCounter.current(); ++i) {
            Profile storage item = profiles[i];
            allProfiles[i] = item;
        }
        
        return allProfiles;
    }

    function getIndividualProfile(uint256 _tokenId) public view returns (uint256, address, address) {
        return (
           profiles[_tokenId].tokenId,
           profiles[_tokenId].creator,
           profiles[_tokenId].tbaAddress
        );
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://aiducation.s3.ap-southeast-1.amazonaws.com/profile/";
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory base = _baseURI();
        string memory jsonExtension = ".json";
        if (bytes(base).length > 0) {
            return
                string(
                    abi.encodePacked(
                        base,
                        Strings.toString(tokenIdToUserTokenId[tokenId]),
                        jsonExtension
                    )
                );
        }
        return Strings.toString(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
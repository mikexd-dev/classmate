// SPDX-License-Identifier: MIT
// Sepolia : 0x0E45Ce20ECce7Fd93A1399430aE72D80D387fCa9
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ProfileNFT.sol";

contract CourseNFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    ProfileNFT public profileNFTContract;
    event NFTMinted(address indexed account, uint256 id);
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CourseNFT", "CT") {
        profileNFTContract = ProfileNFT(0x22C9D6Fa7e72f751F8Af7F81a333F068c9D9A0EF);
    }

    mapping(address => uint256) public addressToTokenId;
    mapping(uint256 => uint256) public tokenIdToUserTokenId;

    function mintCourse(address account, uint256 userTokenId) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(account, tokenId);

        emit NFTMinted(account, tokenId);
        tokenIdToUserTokenId[tokenId] = userTokenId;
        // _setTokenURI(tokenId, _uri);

        addressToTokenId[account] = tokenId;
    }

    function getTokenIdByAddress(address _address) public view returns (uint256) {
        return addressToTokenId[_address];
    }

    function getIndividualProfile(uint256 _tokenId) public view returns (uint256, address, address) {
        return profileNFTContract.getIndividualProfile(_tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _baseURI() internal pure override returns (string memory) {
        return "https://aiducation.s3.ap-southeast-1.amazonaws.com/course/";
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

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
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
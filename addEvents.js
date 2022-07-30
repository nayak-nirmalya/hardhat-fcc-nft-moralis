const Moralis = require('moralis/node')
require('dotenv').config()
const contractAddresses = require('./constants/networkMapping.json')
let chainId = process.env.chainId || 31337
let moralisChainId = chainId == '31337' ? '1337' : chainId
const contractAddressArray = contractAddresses[chainId]['NftMarketplace']
const contractAddress = contractAddressArray[contractAddressArray.length - 1]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

// console.log(Moralis.CoreManager.get('VERSION'))
// console.log(
//   typeof serverUrl,
//   typeof appId,
//   typeof masterKey,
//   typeof contractAddress,
//   typeof moralisChainId,
// )

async function main() {
  console.log('Before Starting!')
  await Moralis.start({ serverUrl, appId, masterKey })
  console.log(`Working with contract address: ${contractAddress}`)

  let itemListedOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemListed(address,address,uint256,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemListed',
      type: 'event',
    },
    tableName: 'ItemListed',
  }

  let itemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemBought(address,address,uint256,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'buyer',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemBought',
      type: 'event',
    },
    tableName: 'ItemBought',
  }

  let itemCancelledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemCancelled(address,address,uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ItemCancelled',
      type: 'event',
    },
    tableName: 'ItemCancelled',
  }

  const listedResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemListedOptions,
    { useMasterKey: true },
  )
  const boughtResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemBoughtOptions,
    { useMasterKey: true },
  )
  const canceledResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemCancelledOptions,
    { useMasterKey: true },
  )

  if (
    listedResponse.success &&
    canceledResponse.success &&
    boughtResponse.success
  ) {
    console.log('Success!')
  } else {
    console.log('Something Went Wrong!')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

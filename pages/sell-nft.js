import { Form, useNotification } from '@web3uikit/core'
import { ethers } from 'ethers'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import nftMarketplaceAbi from '../constants/NftMarketplace.json'
import nftAbi from '../constants/BasicNft.json'
import styles from '../styles/Home.module.css'
import networkMapping from '../constants/networkMapping.json'

export default function Home() {
  const dispatch = useNotification()
  const { chainId } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : '31337'
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

  const { runContractFunction } = useWeb3Contract()

  async function approveAndList(data) {
    console.log('Approving...')
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, 'ether')
      .toString()

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: 'approve',
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    }

    await runContractFunction({
      params: approveOptions,
      onSuccess: handleApproveSuccess(nftAddress, tokenId, price),
      onError: (err) => console.error(err),
    })
  }

  async function handleApproveSuccess(nftAddress, tokenId, price) {
    console.log('OK! Time to List.')
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: 'listItem',
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    }

    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (err) => console.error(err),
    })
  }

  async function handleListSuccess() {
    dispatch({
      type: 'success',
      message: 'NFT Listing',
      title: 'NFT Listed',
      position: 'topR',
    })
  }

  return (
    <div className={styles.container}>
      <div className="p-2">
        <Form
          onSubmit={approveAndList}
          data={[
            {
              name: 'NFT Address',
              type: 'text',
              inputWidth: '50%',
              value: '',
              key: 'nftAddress',
            },
            {
              name: 'Token ID',
              type: 'number',
              value: '',
              key: 'tokenId',
            },
            {
              name: 'Price (ETH)',
              type: 'number',
              value: '',
              key: 'price',
            },
          ]}
          title="Sell Your NFT!"
          id="Main Form"
        />
      </div>
    </div>
  )
}

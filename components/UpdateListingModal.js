import { Modal, Input, useNotification } from '@web3uikit/core'
import { useState } from 'react'
import { useWeb3Contract } from 'react-moralis'
import nftMarketplaceAbi from '../constants/NftMarketplace.json'
import { ethers } from 'ethers'

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  onClose,
}) {
  const dispatch = useNotification()

  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1)
    dispatch({
      type: 'success',
      message: 'Listing Updated.',
      title: 'Listing Updated - Please Refresh (and Move Blocks).',
      position: 'topR',
    })
    onClose && onClose()
    setPriceToUpdateListingWith('0')
  }

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: 'updateListing',
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || '0'),
    },
  })

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: (error) => console.error(error),
          onSuccess: handleUpdateListingSuccess,
        })
      }}
    >
      <Input
        label="Update Listing Price in L1 Currency (ETH)"
        name="New Listing Price"
        type="number"
        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value)
        }}
      />
    </Modal>
  )
}

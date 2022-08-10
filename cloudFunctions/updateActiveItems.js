Moralis.Cloud.afterSave('ItemListed', async (request) => {
  const confirmed = request.object.get('confirmed')
  const logger = Moralis.Cloud.getLogger()
  logger.info('Looking for Confirmed TX.')

  if (confirmed) {
    logger.info('Found Item!')
    const ActiveItem = Moralis.Object.extend('ActiveItem')

    const activeItem = new ActiveItem()
    activeItem.set('marketplaceAddress', request.object.get('address'))
    activeItem.set('nftAddress', request.object.get('nftAddress'))
    activeItem.set('tokenId', request.object.get('tokenId'))
    activeItem.set('price', request.object.get('price'))
    activeItem.set('seller', request.object.get('seller'))

    logger.info(
      `Adding Address: ${request.object.get(
        'address',
      )}. Token ID: ${request.object.get('tokenId')}`,
    )

    logger.info('Saving...')

    await activeItem.save()
  }
})

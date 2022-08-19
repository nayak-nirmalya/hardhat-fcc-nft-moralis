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

Moralis.Cloud.afterSave('ItemCancelled', async (request) => {
  const confirmed = request.object.get('confirmed')
  const logger = Moralis.Cloud.getLogger()
  logger.info(`Marketplace | Object: ${request.object}`)

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend('ActiveItem')
    const query = new Moralis.Query(ActiveItem)
    query.equalTo('marketplaceAddress', request.object.get('address'))
    query.equalTo('nftAddress', request.object.get('nftAddress'))
    query.equalTo('tokenId', request.object.get('tokenId'))
    logger.info(`Marketplace | Query: ${query}`)
    const canceledItem = await query.first()
    logger.info(`Marketplace | CancelledItem: ${canceledItem}`)

    if (canceledItem) {
      logger.info(
        `Deleting ${request.object.get(
          'tokenId',
        )} at address ${request.object.get('address')} since it was cancelled`,
      )

      await canceledItem.destroy()
    } else {
      logger.info(
        `No Item found with address ${request.object.get(
          'address',
        )} and tokenId ${request.object.get('tokenId')}`,
      )
    }
  }
})

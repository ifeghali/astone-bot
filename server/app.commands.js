import CommandHelper from './commands/command-helper';


import AuctionListCommand from './commands/interactive/auction-list.cmd';
import StartCommand from './commands/interactive/start.cmd';
import NewAuctionCommand from './commands/interactive/new-auction.cmd';
import HelpCommand from './commands/interactive/help.cmd';
import SetAuctionPropertyCommand from './commands/interactive/set-auction-property.cmd';

import BidCommand from './commands/callbackquery/bid.cmd';
import StartAuctionCommand from './commands/callbackquery/start-auction.cmd';
import ActionProperty from './commands/callbackquery/auction-property';

import AuctionNameCommand from './commands/state/auction-name.cmd';
import AuctionDescriptionCommand from './commands/state/auction-description.cmd';
import AuctionPriceCommand from './commands/state/auction-price.cmd';
import AuctionPictureCommand from './commands/state/auction-picture.cmd';
import AuctionMinSubscribersCommand from './commands/state/auction-min-sub.cmd';

import StorageS3 from './services/storage/aws/s3';

import * as constants from './commands/consts';

export default (chatManager, telegram, managerFactory) => {

  const commandHelper = CommandHelper(telegram);

  // Interactive commands (ie /start, /help, ...)
  const bidCmd = new BidCommand(telegram, managerFactory, commandHelper);
  const listCmd = new AuctionListCommand(telegram, managerFactory, commandHelper);
  const startCmd = new StartCommand(telegram, managerFactory, commandHelper);
  const helpCommand = new HelpCommand(telegram, managerFactory, commandHelper);
  const newAuctionCmd = new NewAuctionCommand(telegram, commandHelper);
  const setTitleCmd = new SetAuctionPropertyCommand(telegram, managerFactory, commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_TITLE,
      answerText: `Choose an auction to change the title`
    });
  const setDescritionCmd = new SetAuctionPropertyCommand(telegram, managerFactory, commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_DESCR,
      answerText: 'Choose an auction to change the description'
    });

  chatManager.addCommand(constants.COMMAND_BID, bidCmd);
  chatManager.addCommand(constants.COMMAND_LIST, listCmd);
  chatManager.addCommand(constants.COMMAND_START, startCmd);
  chatManager.addCommand(constants.COMMAND_HELP, helpCommand);
  chatManager.addCommand(constants.COMMAND_NEW_AUCTION, newAuctionCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_TITLE, setTitleCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_DESCR, setDescritionCmd);

// QueryResponse command (ie 'out-of-band' commands on callback button action)
  const startAuctionCmd = new StartAuctionCommand(telegram, managerFactory, commandHelper);
  const titleCmd = new ActionProperty(telegram, managerFactory, commandHelper,  {
    answerText: 'Ok, write the new name for the Auction',
    stateCommand: constants.STATE_WAIT_FOR_NAME
  });
  const decrCmd = new ActionProperty(telegram, managerFactory, commandHelper, {
    answerText: 'Ok, write the new description for the Auction',
    stateCommand: constants.STATE_WAIT_FOR_DESC
  });
  chatManager.addCommand(constants.QCOMMAND_START_AUCTION, startAuctionCmd, 'QueryResponse');
  chatManager.addCommand(constants.QCOMMAND_BID, bidCmd, 'QueryResponse');
  chatManager.addCommand(constants.QCOMMAND_SET_TITLE, titleCmd, 'QueryResponse');
  chatManager.addCommand(constants.QCOMMAND_SET_DESCR, decrCmd, 'QueryResponse');

// State command (ie. executed on state specific values)
  const nameCommand = new AuctionNameCommand(telegram, managerFactory, commandHelper);
  const descCommand = new AuctionDescriptionCommand(telegram, managerFactory, commandHelper);
  const priceCommand = new AuctionPriceCommand(telegram, managerFactory, commandHelper);
  const pictureCommand = new AuctionPictureCommand(telegram, managerFactory, commandHelper, StorageS3());
  const minSubCommand = new AuctionMinSubscribersCommand(telegram, managerFactory, commandHelper);
  chatManager.addCommand(constants.STATE_WAIT_FOR_NAME, nameCommand, 'State');
  chatManager.addCommand(constants.STATE_WAIT_FOR_DESC, descCommand, 'State');
  chatManager.addCommand(constants.STATE_WAIT_FOR_PRICE, priceCommand, 'State');
  chatManager.addCommand(constants.STATE_WAIT_FOR_PICTURE, pictureCommand, 'State');
  chatManager.addCommand(constants.STATE_WAIT_FOR_MIN_SUB, minSubCommand, 'State');
}
;

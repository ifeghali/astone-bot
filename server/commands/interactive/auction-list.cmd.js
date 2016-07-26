'use strict';

import * as constants from '../consts';

export default class AuctionListCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {
    this._telegram
      .sendChatAction(state.chat.id, 'typing');

    const now = new Date();
    return this._auctionManager
      .getActiveAuctions(now)
      .then((res) => {
        if (res && res.length > 0) {

          res.forEach((item) => {
            let buttons = [];

            buttons.push([{
              text: `Start bidding on ${item.title}`, callback_data: this._helper
                .encodeQueryCommand(constants.QCOMMAND_START_AUCTION, item._id.toString())
            }]);

            this._telegram
              .sendMessage({
                chat_id: state.chat.id,
                text: `*${item.title} (price € ${item.price})*\n${item.description}`,
                parse_mode: 'Markdown'
              })
              .then(res => {
                this._telegram.sendPhoto({
                  chat_id: state.chat.id,
                  photo: item.file_id,
                  reply_markup: {
                    inline_keyboard: buttons
                  }

                });
              });
          });
          Promise.resolve(null);
        }
        else {
          return this._helper.simpleResponse(state.chat.id, 'Sorry, no Auctions active now');
        }
      })
      .catch((err) => {
        return this._helper.simpleResponse(state.chat.id, '*Ops!* We updating our BOT now, retry later. Sorry for the inconvenient :-(');
      });
  }
}

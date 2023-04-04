import { MessageType, Scraper, ScraperConfiguration } from "./scrapers";
import { colorError, colorQuery, colorWarning } from "./utils";

export * as xml from "./xml"
export * as utils from "./utils"

export function consoleMessagehandler(message: string, type: MessageType) {
  if(type == "error") {
    console.error(colorError(message));
  } else if(type == "warning") {
    console.warn(colorWarning(message));
  } else {
    console.info(message);
  }
}

export const defaultConfiguration: ScraperConfiguration = {
  messageHandler: consoleMessagehandler,
  itemHandler: (item) => {
    item.scraper.info(colorQuery(`created new item $${item.index}`));
  },
  entryHandler: (entry) => {
    entry.scraper.info(colorQuery(`$${entry.item.index}/${entry.path} = "${entry.value}"`));
  },
  runHandler: (handler, input) => handler(input),
  urlValidator: null,
};

export let scraper = new Scraper(defaultConfiguration);
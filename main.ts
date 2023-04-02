import { Scraper, ScraperItem, ScraperEntry } from "./scraper"
import { colorError, colorQuery, colorWarning } from "./utils";

export * as xml from "./xml"

export * as utils from "./utils"

export type MessageType = "info" | "warning" | "error";

export interface Configuration {
  messageHandler: (message: string, type: MessageType) => void,
  itemHandler: (item: ScraperItem) => void,
  entryHandler: (entry: ScraperEntry) => void,
  urlValidator?: (url: string) => string,
}

export function consoleMessagehandler(message: string, type: MessageType) {
  if(type == "error") {
    console.error(colorError(message));
  } else if(type == "warning") {
    console.warn(colorWarning(message));
  } else {
    console.info(message);
  }
}

export const defaultOptions: Configuration = {
  messageHandler: consoleMessagehandler,
  itemHandler: (item) => {
    item.scraper.info(colorQuery(`created new item with index ${item.index}`));
  },
  entryHandler: (entry) => {
    entry.scraper.info(colorQuery(`${entry.item.index}/${entry.path} = "${entry.value}"`));
  },
  urlValidator: null,
};

let lastConfiguration: Configuration = null;

export function configure(configuration: Configuration) {
  if (lastConfiguration != null) {
    throw new Error("the query-sdk was already configured");
  }
  lastConfiguration = configuration;
}

export function createScraper() {
  // use default options when not configured
  if(lastConfiguration == null) {
    configure(defaultOptions);
  }
  return new Scraper(lastConfiguration);
}
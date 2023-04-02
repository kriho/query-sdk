import { Fetcher } from "./fetcher";
import { Configuration } from "./main";

export type ScraperHandler = (input: string) => Promise<void>;

export class Scraper {
  private _domain: string;
  private _handler: ScraperHandler;
  private _items: ScraperItem[]= [];
  private _fetcher: Fetcher;

  public get domain() {
    return this._domain;
  }

  public get fetcher() {
    return this._fetcher;
  }

  constructor(private configuration: Configuration) {
    this._fetcher = new Fetcher(this, configuration);
  }

  public info(message: string) {
    this.configuration.messageHandler(message, "info");
  }
  
  public warn(message: string) {
    this.configuration.messageHandler(message, "warning");
  }
  
  public error(message: string) {
    this.configuration.messageHandler(message, "error");
  }

  public setNetworkDomain(networkDomain: string) {
    this._domain = networkDomain;
  }

  public getSecret() {
    return "";
  }

  public setHandler(handler: ScraperHandler) {
    this._handler = handler;
  }

  public item() {
    const item = new ScraperItem(this, this._items.length, this.configuration);
    this._items.push(item);
    return item;
  }

  public async run(input: string) {
    await this._handler(input);
  }
}

export class ScraperItem {
  constructor(public readonly scraper: Scraper, public readonly index: number, private configuration: Configuration) {
    this.configuration.itemHandler(this);
  }

  public info(message: string) {
    this.scraper.info(`${this.index}: ${message}`);
  }
  
  public warn(message: string) {
    this.scraper.warn(`${this.index}: ${message}`);
  }
  
  public error(message: string) {
    this.scraper.error(`${this.index}: ${message}`);
  }

  public entry(path: string, value: string | number | string[] | number[]) {
    if(value instanceof Array) {
      for(const item of value) {
        this.entry(path, item);
      }
    } else {
      if(typeof value === "number") {
        value = value.toString();
      }
      this.configuration.entryHandler(new ScraperEntry(this, path, value));
    }
    return this;
  }
}

export class ScraperEntry {
  public get scraper() {
    return this.item.scraper;
  }

  constructor(public readonly item: ScraperItem, public readonly path: string, public readonly value: string) {
  }
}
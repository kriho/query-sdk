import axios from "axios";
import { DOMParser } from "xmldom";
import { ScraperConfiguration } from "./scrapers";
import { Scraper } from "./scrapers";

export class Fetcher {
    private urlValidator: (url: string) => string;
  
    constructor(private scraper: Scraper, configuration: ScraperConfiguration) {
      this.urlValidator = configuration.urlValidator;
    }
  
    public async xml(url: string) {
      if(this.urlValidator) {
        const result =  this.urlValidator(url)
        if(result != null) {
          this.scraper.error(`the url "${url}" failed validation: ${result}`);
          return null;
        }
      }
      this.scraper.info(`fetching "${url}"...`);
      const result = await axios.get(url);
      if(result.status != 200) {
        this.scraper.error(`received HTTP status ${result.status}: ${result.statusText}`);
        return null;
      }
      if(!result.headers["content-type"].includes("text/xml")) {
        this.scraper.error(`response content type is ${result.headers["content-type"]}, but text/xml was expected`);
        return null;
      }
      this.scraper.info(`response received (${result.data.length} characters)`);
      try {
        const document = new DOMParser({
          errorHandler: (level, msg) => { },
        }).parseFromString(result.data);
        return document;
      } catch {
        this.scraper.error(`failed to parsed response as XML document`);
        return null;
      }
    }
  }
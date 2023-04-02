This is the official SDK for creating and testing scrapers for query.hornung.dev.

## How to write a scraper
- Get all necessary imports

  `import { createScraper, xml, utils } from "query-sdk"`
- Create your scraper

  `const scraper = createScraper();`
- Set the network domain that will be accessed
 
  `scraper.setNetworkDomain("...");`
- Set the handler, this is the function that performs the actual work

  ```
  scraper.setHandler(async query => {
    ...
  }); 
  ```
- For local debugging, run the scraper (this function does nothing when used by the query.hornung.dev system)

  `scraper.run("...");`

## Example
An full example for scraping boardgame metadata can be found here:
 https://github.com/kriho/query-sdk-example.git
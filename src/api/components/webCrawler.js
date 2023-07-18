// fetch html
import Spider from "node-spider";
// perse html
import cheerio from "cheerio";
// convert html to markdown
import TurndownService from "turndown";

const turndownService = new TurndownService();

export default function createCrawler(
  urls, // urls to crawl
  limit = 1000, // max number of pages to crawl
  textLengthMinium = 200 // minium text length to be considered a page
) {
  let pages = []; // store the pages
  let count = 0; // count the number of pages crawled
  let spider = {}; // store the spider instance

  // handle the url object from the spider
  const handleRequest = (doc) => {
    // query the html element with Cheerio
    // doc.res is a response object from the request IncomingMessage object,
    // doc.res.body contains the responsed html
    const $ = cheerio.load(doc.res.body);
    // remove all the script tags
    $("script").remove();
    // remove all the style tags
    $("style").remove();
    // remove nav bar
    $("nav").remove();

    // fetch the title text
    const title = $("title").text() || "";
    // fetch the body text
    const html = $("body").html();
    // convert html to markdown
    const text = turndownService.turndown(html);

    // combine the title and body text
    const page = {
      url: doc.url, // url of the current page
      text,
      title,
    };

    // check if the text length is greater than the minium text length
    if (text.length > textLengthMinium) {
      pages.push(page);
    }

    // check the link tag in the html
    // doc.$ is a Cheerio object of the current page to query the HTML elements
    doc.$("a").each((i, elem) => {
      // get the href attribute of the link tag, get the first part of the url before the #
      const href = doc.$(elem).attr("href")?.split("#")[0];
      // if href exists, parse it into the absolute url
      // doc.resolve is a function to resolve the relative url to the absolute url
      const absoluteUrl = href && doc.resolve(href);
      // if the url is not undefined and url from the urls array is included in the absolute url
      // and the count is less than the limit
      if (
        // includes()
        absoluteUrl &&
        urls.some((url) => absoluteUrl.includes(url)) &&
        count < limit
      ) {
        // add the url to the queue
        spider.queue(absoluteUrl, handleRequest);
        count++;
      }
    });
  };
  //
  const startCrawl = () => {
    // clear the pages array
    pages = [];
    // start the spider
    return new Promise((resolve, reject) => {
      spider = new Spider({
        concurrent: 5,
        delay: 0,
        allowDuplicates: false,
        catchErrors: true,
        addReferrer: false,
        xhr: false,
        keepAlive: false,
        error: (err, url) => {
          console.log(err, url);
          reject(err);
        },
        done: () => {
          resolve(pages);
        },
        headers: { "user-agent": "node-spider" },
        encoding: "utf8",
      });
      // add the urls to the queue
      urls.forEach((url) => {
        spider.queue(url, handleRequest);
      });
    });
  };
  // run the crawler
  return {
    startCrawl,
  };
}

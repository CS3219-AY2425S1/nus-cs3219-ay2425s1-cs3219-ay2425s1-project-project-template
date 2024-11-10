import { Browser, Builder, By, Key, until } from "selenium-webdriver"

import { path } from "chromedriver"
import { getBinaryPaths } from "selenium-webdriver/common/driverFinder"
import Chrome from "selenium-webdriver/chrome"
describe("base selenium test", () => {
    it.skip("works", async () => {
        // referenced: https://www.npmjs.com/package/selenium-webdriver
        console.log(path)
        
        let options = new Chrome.Options();
        options.setBrowserVersion("stable")

        let paths = getBinaryPaths(options)
        let driverPath = paths.driverPath;
        let browserPath = paths.browserPath;
        console.log(paths);
        
        options.setChromeBinaryPath(browserPath)
        
        let service = new Chrome.ServiceBuilder().setPath(driverPath);

        let driver = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .setChromeService(service)
            .build();
        
        console.log("got here");
        
        try {
            await driver.get('https://www.google.com/ncr')
            console.log("got here");
            await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
            console.log("got here");
            await driver.wait(until.titleIs('webdriver - Google Search'), 1000)
            console.log("got here");
        } finally {
            await driver.quit()
        }
    }, 60000)
})




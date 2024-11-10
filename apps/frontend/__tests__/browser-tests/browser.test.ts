import { Browser, Builder, By, Key, until } from "selenium-webdriver"

import Chrome from "selenium-webdriver/chrome"

describe("chrome webdriver installed correctly", () => {
    it("does google search", async function test() {
        const options = new Chrome.Options().addArguments("--headless=new") as Chrome.Options;
        const builder = new Builder().forBrowser(Browser.CHROME).setChromeOptions(options);
        
        const driver = await builder.build();
        
        try {
            await driver.get('http://www.google.com');
            await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
            await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        } finally {
            await driver.quit();
        }
    });
});




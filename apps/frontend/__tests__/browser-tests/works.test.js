require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
(async function test() {
    const builder = new Builder().forBrowser('chrome');

    console.log(builder.getChromeOptions());
    
    let driver = await builder.build();
    
    try {
        await driver.get('http://www.google.com');
        await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    } finally {
        await driver.quit();
    }
})();
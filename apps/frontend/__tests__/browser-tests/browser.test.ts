import { Actions, Browser, Builder, By, Key, until, WebDriver } from "selenium-webdriver"

import Chrome from "selenium-webdriver/chrome"
const URL = 'http://localhost:3000/';
const ETERNAL_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTk5fQ.Z4_FVGQ5lIcouP3m4YLMr6pGMF17IJFfo2yOTiN58DY"

describe("chrome browser", () => {
    const options = new Chrome.Options()
    .addArguments("--headless=new") as Chrome.Options;
    const builder = new Builder().forBrowser(Browser.CHROME).setChromeOptions(options);
    let driver: WebDriver;

    beforeEach(async () => {
        driver = await builder.build();
    })

    afterEach(async () => {
        await driver.quit();
    })

    describe.skip("chrome webdriver installed correctly", () => {
        it("does google search", async () => {
            await driver.get('http://www.google.com');
            await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
            await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        });
        it("does another google search", async () => {
            await driver.get('http://www.google.com');
            await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
            await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        });
    });
    
    describe("browser-test", () => {
        it.skip("accesses and login to peerprep", async () => {
            await driver.get(URL);
            await driver.wait(until.urlIs(`${URL}login`));
            
            const [email, password] = await driver.findElements(By.css("input"))
            const submit = await driver.findElement(By.css("button[type=\"submit\"]"))

            await email.sendKeys("admin@gmail.com");
            await password.sendKeys("admin");

            await submit.click();
            await driver.wait(until.urlIs(`${URL}`));
        });
    })
})





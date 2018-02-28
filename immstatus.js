const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromium = require('chromium');
const {By, until, promise, Key} = webdriver;
const fs = require('fs');
require('chromedriver');
 
async function getImmStatus(appId, surname, birthDate, birthCountry) {
 
    [birthYear, birthMonth, birthDay] = birthDate.split('-');
    let options = new chrome.Options();
    options.setChromeBinaryPath(chromium.path);
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1280,960');

    let status;
    let driver;
 
    try{
        driver = await new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
            
        await driver.get('https://services3.cic.gc.ca/ecas/security.do?lang=en&_ga=2.36017702.783948421.1515458672-1945924788.1512770655');
        const termCheckbox = await driver.wait(
            until.elementLocated(By.xpath("//input[@id='agree']")), 20000);
        await termCheckbox.click();

        const continueButton = await driver.wait(
            until.elementLocated(By.xpath("//input[@value='Continue']")), 20000);
        continueButton.click();

        //come into the page of application form
        //1. fill the identification type, only application number is supproted.
        const identificationType = await driver.wait(
            until.elementLocated(By.id("idTypeLabel")), 20000);
        await identificationType.click();
        await identificationType.sendKeys('a', Key.RETURN); //"Application Number / Case Number"
        
        //2. fill the identification number
        const appIdBox = await driver.wait(
            until.elementLocated(By.id("idNumberLabel")), 20000);
        await appIdBox.click();
        await appIdBox.sendKeys(appId);

        //3. fill the surname
        const surnameBox = await driver.wait(
            until.elementLocated(By.id("surnameLabel")), 20000);
        await surnameBox.click();
        await surnameBox.sendKeys(surname);
        
        //4. fill the birthday
        const birthdayBox = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='dateOfBirth']")), 20000);
        await birthdayBox.click();
        await birthdayBox.sendKeys(Key.ARROW_LEFT, Key.ARROW_LEFT, birthMonth, birthDay, birthYear);

        //5. fill the birth country
        const birthCountryBox = await driver.wait(
            until.elementLocated(By.id("cobLabel")), 20000);
        await birthCountryBox.click();
        await birthCountryBox.sendKeys(birthCountry, Key.RETURN);

        //await takeScreenshot(driver, 'immigration-start-page');

        //6. click "Continue" button
        await driver.wait(
            until.elementLocated(By.xpath("//input[@value='Continue']")), 20000).click();

        //7. get the status text
        const statusForm = await driver.wait(
            until.elementLocated(By.className("align-center")), 20000);
        let statusOverview = await statusForm.getText();
        //console.log("status is "+statusOverview);

        //await takeScreenshot(driver, 'immigration-status-page');

        //8. goto the status details
        await statusForm.findElement(By.className("ui-link")).click();

        //9. get the status details
        const statusHistories = await driver.wait(
            until.elementsLocated(By.xpath("//li[@class='margin-bottom-medium']")), 20000);
        let statusDetails="";
        for(var element of statusHistories){
            statusDetails += "* "+await element.getText()+"\n";
        }
        //console.log(statusDetails);

        //await takeScreenshot(driver, 'immigration-details-page');
        status = {brief:statusOverview, details:statusDetails };
    }catch(err){
        console.log("error happened:",err);
        //await driver.quit();
    }
    //console.log(statusOverview, statusDetails);
    await driver.quit();

    return status;
}
 
async function takeScreenshot(driver, name) {
    await driver.takeScreenshot().then((data) => {
        fs.writeFileSync(name + '.png', data, 'base64');
        console.log('Screenshot is saved');
    });
}

module.exports = getImmStatus;

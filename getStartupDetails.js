
// Selenium Webdriver
const chrome = require('selenium-webdriver/chrome')
const { Builder, By, Key, until, } = require('selenium-webdriver')
// const sqlite3 = require('sqlite3').verbose();
const Database = require('sqlite-async')

// const db = new sqlite3.Database(__dirname + '/angellist.db')

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const getStartupDetails = async (driver, db) => {
    const rows = await db.all(`SELECT * FROM startups WHERE id >= 103564`)
    for (row of rows) {
        // Go to URL
        // await driver.get(row.profileURL + '/people')
        // await sleep(5000)
        await driver.get(row.profileURL)

        // Wait for page to load
        //await driver.wait(until.titleContains(row.name), 15000)
        await driver.wait(until.titleContains('AngelList'), 15000)

        let location, market, website, employees, description, totalRaised, latestRound, linkedIn, twitter, facebook, founder1Name, founder1Title, founder1AngelURL, founder2Name, founder2Title, founder2AngelURL

        try {
            // Get location
            location = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div/div/dl/dt[2]/ul/li')).getText()
        }
        catch (e) {
            //console.log(e)
        }

        try {
            let html = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div')).getAttribute('innerHTML')
            html = html.split('Markets')
            market = html[1].match(/<a [^>]+>([^<]+)<\/a>/)[1]
        }
        catch (e) {
            // console.log(e)
        }

        try {
            // Get Website
            website = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div/div/dl/dt[1]/div/ul/li/a')).getAttribute('href')
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Employees
            employees = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div/div/dl/dt[3]')).getText()
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Description
            description = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/section/div/div[2]/h2')).getText()

        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get TotalRaised
            totalRaised = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[4]/div[2]/div[1]/h4')).getText()

        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get LatestRound
            latestRound = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[4]/div[2]/div[3]/h4')).getText()
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get LinkedIn
            linkedIn = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div/div[1]/dl/dt[1]/div/ul/li[2]/ul/li[3]/a')).getAttribute('href')
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Twitter
            twitter = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div/div[1]/dl/dt[1]/div/ul/li[2]/ul/li[1]/a')).getAttribute('href')
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Facebook
            facebook = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/aside/div/div[1]/dl/dt[1]/div/ul/li[2]/ul/li[2]/a')).getAttribute('href')
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Founder1 Name
            founder1Name = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[2]/div[2]/div[1]/div/div[1]/div[1]/div/h4/a')).getText()
        }
        catch (e) {
            // console.log(e)
        }

        try {
            // Get Founder1 Title
            founder1Title = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[2]/div[2]/div[1]/div/div[1]/div[2]')).getText()
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Founder1 AngelURL
            founder1AngelURL = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[2]/div[2]/div[1]/div/div[1]/div[1]/div/h4/a')).getAttribute('href')
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Founder2 Name
            founder2Name = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[2]/div[2]/div[2]/div/div[1]/div[1]/div/h4/a')).getText()
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Founder2 Title
            founder2Title = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[2]/div[2]/div[2]/div/div[1]/div[2]')).getText()
        }
        catch (e) {
            //console.log(e)
        }

        try {
            // Get Founder2 AngelURL
            founder2AngelURL = await driver.findElement(By.xpath('//*[@id="main"]/div[1]/div[4]/div/div/div[1]/div/section/div[2]/div[2]/div[2]/div/div[1]/div[1]/div/h4/a')).getAttribute('href')
        }
        catch (e) {
            //console.log(e)
        }

        // const startupProfile = {
        //     location,
        //     market,
        //     website,
        //     employees,
        //     description,
        //     totalRaised,
        //     latestRound,
        //     linkedIn,
        //     twitter,
        //     facebook,
        //     founder1Name,
        //     founder1Title,
        //     founder1AngelURL,
        //     founder2Name,
        //     founder2Title,
        //     founder2AngelURL
        // }

        // Update details
        await db.run(`UPDATE startups SET location=?, market=?, website=?, employees=?, description=?, totalRaised=?, 
        latestRound=?, linkedIn=?,founder1Name=?,founder1Title=?,founder1AngelURL=?,founder2Name=?,founder2Title=?,founder2AngelURL=?,facebook=?,twitter=? WHERE name=?  `, 
        [location, market, website, employees, description, totalRaised, latestRound, linkedIn, founder1Name, founder1Title,founder1AngelURL,founder2Name,founder2Title,founder2AngelURL,facebook,twitter,row.name ])
        
        console.log(`ID:${row.id} - Startup ${row.name} details updated`)          
    }
}

const start = async () => {

    const db = await Database.open('angellist.db')

    const options = new chrome.Options()
    options.addArguments("--incognito")
    options.addArguments("--start-maximized")
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()
    await getStartupDetails(driver, db)

}

start()
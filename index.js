// Selenium Webdriver
const chrome = require('selenium-webdriver/chrome')
const { Builder, By, Key, until, } = require('selenium-webdriver')
const getHrefs = require('get-hrefs')
const fs = require('fs')

const url = 'https://angel.co/companies'


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function randomInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

const getData = async (driver) => {
    let companies = []
    let i = 0
    try {

        // Get profile url
        let profiles = await driver.findElements(By.className("startup-link"))
        for (let profile of profiles) {
            let name = await profile.getText()
            let profile_url = await profile.getAttribute('href')
            companies.push({ index: i, name: name, profile_url: profile_url })
            i++
        }
        
        console.log(companies)
    }
    catch (e) {
        console.log(e)
    }
}

function getProfileURL(html) {
    let data = getHrefs(html)
    data = data.filter(l => l.includes('company'))
    return data[0]
}

start = async () => {
    const options = new chrome.Options()
    options.addArguments("--incognito")
    options.addArguments("--start-maximized")
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()
    
    // Go to URL
    await driver.get(url)
    
    // Wait for page to load
    await driver.wait(until.titleContains('AngelList'), 15000)
    
    // scroll down
    driver.executeScript("window.scrollTo(0,10000);")

    // First `load more` click
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div[4]/div[2]/div/div[2]/div[2]/div[2]/div[22]')), 15000) 
    await driver.findElement(By.xpath('//*[@id="root"]/div[4]/div[2]/div/div[2]/div[2]/div[2]/div[22]')).click()
    console.log('first btn clicked')
    
    // scroll down
    driver.executeScript("window.scrollTo(0,10000);")
    await sleep(2888)

    // loop clicks
    for (let i = 0; i < 5002; i++) {
        await driver.wait(until.elementLocated(By.className("more")), 15000)
        await driver.findElement(By.className("more")).click()

        // scroll down
        driver.executeScript("window.scrollTo(0,10000);")       
        
        console.log('click no. ' + i)
        // wait random interval
        // await sleep(randomInterval(2000, 5000)) 
        await sleep(1200)
    }
    let startupURLs = []
    const startups = await driver.findElements(By.className('base startup'))
    let file = fs.createWriteStream('startups.txt')
    file.on('error', function(err) { console.log (err )})
    for(startup of startups) {
        let startupHtml = await startup.getAttribute('innerHTML')
        let profileURL = getProfileURL(startupHtml)
        //startupURLs.push(profileURL)
        
        file.write(profileURL + ', ')
    }
    file.end()
    
    console.log('DONE!')
    
    await sleep(8888)
}

start()
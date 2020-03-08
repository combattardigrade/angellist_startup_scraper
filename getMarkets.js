
// Selenium Webdriver
const chrome = require('selenium-webdriver/chrome')
const { Builder, By, Key, until, } = require('selenium-webdriver')
// const sqlite3 = require('sqlite3').verbose();
const Database = require('sqlite-async')
const randomWords = require('random-words')
// const db = new sqlite3.Database(__dirname + '/angellist.db')

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const getMarkets = async (driver, db) => {
	// Go to URL
	await driver.get('https://angel.co/markets')
	// Wait for page to load
	await driver.wait(until.titleContains('Markets'), 15000)
	// scroll down
	driver.executeScript("window.scrollTo(0,10000);")

	// loop clicks
	for (let i = 0; i < 100; i++) {
		try {
			// Click load more btn	
			await driver.wait(until.elementLocated(By.xpath('//*[@id="tags_full"]/a')), 15000)
			await driver.findElement(By.xpath('//*[@id="tags_full"]/a')).click()
			// scroll down
			driver.executeScript("window.scrollTo(0,10000);")
			console.log('click no. ' + i)
			await sleep(1200)
		}
		catch (e) {
			break;
		}
	}

	const markets = await driver.findElements(By.css('#tags_list > div.items > div.item-tag > a'))
	let i = 1
	for (market of markets) {
		const title = await market.getText()
		const marketURL = await market.getAttribute("href")

		let row = await db.get(`SELECT id FROM markets WHERE title=?`, [title])
		if (!row) {
			await db.run(`INSERT INTO markets (title, url) VALUES (?,?)`, [title, marketURL])
			console.log(`${i} - ${title}: ${marketURL}`)
		}

		i++
	}

}

const getCompaniesByMarket = async (driver, db) => {
	const rows = await db.all(`SELECT * FROM markets WHERE id > ?`, ['498'])
	for (row of rows) {
		// Go to URL
		await driver.get(row.url)
		await sleep(2000)
		// Wait for page to load
		await driver.wait(until.titleContains(row.title), 15000)
		// scroll down
		await driver.executeScript("window.scrollTo(0,10000);")

		// loop load more clicks
		for (let i = 0; i < 25; i++) {
			try {
				await driver.wait(until.elementLocated(By.className("more hidden")), 15000)
				await driver.findElement(By.className("more hidden")).click()
				// scroll down
				driver.executeScript("window.scrollTo(0,10000);")
				console.log('Market: ' + row.title + ' - Click no. ' + i)
				await sleep(1200)
			}
			catch (e) {
				console.log('Max `load more` clicks limit reached...')
				break
			}
		}

		// Get companies
		let i = 1
		const companiesHTML = await driver.findElements(By.className('startup-link'))
		for (companyHTML of companiesHTML) {
			const name = await companyHTML.getText()
			const profileURL = await companyHTML.getAttribute('href')

			// Check if already in DB
			let startupRow = await db.get(`SELECT id FROM startups WHERE name=?`, [name])
			if (!startupRow) {
				// Insert into db
				await db.run(`INSERT INTO startups (name, profileURL, market) VALUES (?,?,?)`, [name, profileURL, row.title])
				console.log(`Startup inserted: ${i} - ${name}: ${profileURL}`)
			}
			i++
		}

	}
}

const getCompaniesByKeyword = async (driver, db) => {
	const keywords = randomWords(1000)

	for (keyword of keywords) {
		// Go to URL
		await driver.get('https://angel.co/companies')
		await sleep(5000)
		// Wait for page to load
		await driver.wait(until.titleContains('AngelList'), 15000)
		// insert keyword
		console.log('Inserting keyword...')
		await driver.findElement(By.xpath('//*[@id="root"]/div[5]/div[2]/div/div[2]/div[1]/div[1]/div')).click()
		await driver.findElement(By.xpath('//*[@id="root"]/div[5]/div[2]/div/div[2]/div[1]/div[1]/div/div[3]/input')).sendKeys(keyword + '\n')
		await sleep(3000)
		// scroll down
		await driver.executeScript("window.scrollTo(0,10000);")
		// loop load more clicks
		for (let i = 0; i < 25; i++) {
			sleep(2000)
			try {
				await driver.wait(until.elementLocated(By.className("more")), 15000)
				await driver.findElement(By.className("more")).click()
				// scroll down
				driver.executeScript("window.scrollTo(0,10000);")
				console.log('Keyword: ' + keyword + ' - Click no. ' + i)
				await sleep(1200)
			}
			catch (e) {
				console.log('Max `load more` clicks limit reached...')
				break
			}
		}
		// Get companies
		let i = 1
		const companiesHTML = await driver.findElements(By.className('startup-link'))
		for (companyHTML of companiesHTML) {
			const name = await companyHTML.getText()
			const profileURL = await companyHTML.getAttribute('href')

			// Check if already in DB
			let startupRow = await db.get(`SELECT id FROM startups WHERE name=?`, [name])
			if (!startupRow) {
				// Insert into db
				await db.run(`INSERT INTO startups (name, profileURL) VALUES (?,?)`, [name, profileURL])
				console.log(`Startup inserted: ${i} - ${name}: ${profileURL}`)
				i++
			}			
		}
	}
}

const start = async () => {

	const db = await Database.open('angellist.db')
	await db.run(`CREATE TABLE IF NOT EXISTS markets (
		id INT(11) PRIMARY KEY ,
		title VARCHAR(255),
		url VARCHAR(255)
	  )`)
	await db.run(`CREATE TABLE IF NOT EXISTS startups (
		id INT(11) PRIMARY KEY ,
		name VARCHAR(255) NULL UNIQUE,
		profileURL VARCHAR(255) NULL,
		joined VARCHAR(255) NULL,
		location VARCHAR(255) NULL,
		market VARCHAR(255) NULL,
		website VARCHAR(255) NULL,
		employees VARCHAR(255) NULL,
		stage VARCHAR(255) NULL,
		totalRaised VARCHAR(255) NULL,
		description VARCHAR(255) NULL,
		markets VARCHAR(255) NULL,
		latestRound VARCHAR(255) NULL,
		linkedIn VARCHAR(255) NULL,
		founder1Name VARCHAR(255) NULL,
		founder1Title VARCHAR(255) NULL,
		founder1AngelURL VARCHAR(255) NULL,
		founder1LinkedIn VARCHAR(255) NULL,
		founder1Facebook VARCHAR(255) NULL,
		founder1Markets VARCHAR(255) NULL,
		founder2Name VARCHAR(255) NULL,
		founder2Title VARCHAR(255) NULL,
		founder2AngelURL VARCHAR(255) NULL,
		founder2LinkedIn VARCHAR(255) NULL,
		founder2Facebook VARCHAR(255) NULL,
		founder2Markets VARCHAR(255) NULL,
		facebook VARCHAR(255) NULL,
		twitter VARCHAR(255) NULL
	  )`)


	const options = new chrome.Options()
	options.addArguments("--incognito")
	options.addArguments("--start-maximized")
	options.addArguments('--disable-infobars')
	options.addArguments('--disable-extensions')
	// options.addArguments("--user-data-dir=C:/Users/tardigrade/AppData/Local/Google/Chrome/User Data/");
	options.addArguments("--profile-directory=Default")
	const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()
	//await getMarkets(driver, db)
	//await getCompaniesByMarket(driver, db)
	await getCompaniesByKeyword(driver, db)

}

start()
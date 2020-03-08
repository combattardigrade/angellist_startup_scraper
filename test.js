const Database = require('sqlite-async')
const ObjectsToCsv = require('objects-to-csv');

const totalStartups = async () => {
    const db = await Database.open('angellist.db')
    const rows = await db.all(`SELECT * FROM startups`)
    return rows.length
}

const getStartup = async () => {
    const db = await Database.open('angellist.db')
    const row = await db.all(`SELECT * FROM startups WHERE name='DuckDuckGo' `)
    console.log(row)
}

const completedStartups = async () => {
    const db = await Database.open('angellist.db')
    const rows = await db.all(`SELECT id FROM startups WHERE website IS NOT NULL`)
    return rows.length
}

const updateMakertIndex = async () => {
    const db = await Database.open('angellist.db')
    const rows = await db.all(`SELECT * FROM markets`)
    let i = 1
    for (market of rows) {
        console.log('Market index updated...')
        await db.run(`UPDATE markets SET id=? WHERE title=?`, [i, market.title])
        i++
    }
}

const updateStartupIndex = async () => {
    const db = await Database.open('angellist.db')
    const rows = await db.all(`SELECT * FROM startups`)
    let i = 1
    for (startup of rows) {
        console.log('Startup index updated...')
        await db.run(`UPDATE startups SET id=? WHERE name=?`, [i, startup.name])
        i++
    }
}

const exportStartupsToCSV = async() => {
    const db = await Database.open('angellist.db')
    const rows = await db.all(`SELECT * FROM startups`)
    const csv = new ObjectsToCsv(rows);
    // Save to file:
    await csv.toDisk('./startups.csv');
}

const exportMarketsToCSV = async() => {
    const db = await Database.open('angellist.db')
    const rows = await db.all(`SELECT * FROM markets`)
    const csv = new ObjectsToCsv(rows);
    // Save to file:
    await csv.toDisk('./markets.csv');
}

const importDB = async() => {
    const db = await Database.open('angellist2.db')
    const rows = await db.all(`SELECT * FROM startups WHERE id > 91000 AND id < 95000`)
    console.log(rows.length)
    for(row of rows) {
        const db_original = await Database.open('angellist.db')
        await db_original.run(`UPDATE startups SET location=?, market=?, website=?, employees=?, description=?, totalRaised=?, 
        latestRound=?, linkedIn=?,founder1Name=?,founder1Title=?,founder1AngelURL=?,founder2Name=?,founder2Title=?,founder2AngelURL=?,facebook=?,twitter=? WHERE name=?  `, 
        [row.location, row.market, row.website, row.employees, row.description, row.totalRaised, row.latestRound, row.linkedIn, row.founder1Name, row.founder1Title, row.founder1AngelURL,row.founder2Name,row.founder2Title,row.founder2AngelURL,row.facebook,row.twitter,row.name ])
        console.log(`ID:${row.id} - Startup ${row.name} details updated`)    
    }
}

(async () => {
    const total = await totalStartups()
    const completed =  await completedStartups()
    console.log(`Saved: ${total} = ${total / 100000 * 100}% | Completed: ${completed} = ${completed / 100000 * 100}% `)
    await exportStartupsToCSV()
    await exportMarketsToCSV()
    console.log('Database exported...')
    
})()


// importDB()
// getStartup()
// updateMakertIndex()



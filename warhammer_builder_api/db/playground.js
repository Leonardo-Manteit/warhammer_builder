const FactionInfo = require('../models/factions.js')
require('dotenv').config()
const db = require('./index.js')

async function storeFactionData() {
    let res = await FactionInfo.getFactionData()
    for (let faction_id in res) {
        sql = `INSERT INTO warhammer_factions 
        (faction_id, faction_info) 
        VALUES ($1, $2) ;`
        db.query(sql, [faction_id, JSON.stringify(res[faction_id])], (res, err) => {
            if (err) console.log(err)
        })
    }
    return
}

async function storeUnitData(faction_id) {
    let res = await FactionInfo.getThisFactionsUnits(faction_id)
    console.log(faction_id)
    for (let unit_id in res) {
        sql = `INSERT INTO warhammer_units 
        (faction_id, unit_id, unit_data) 
        VALUES ($1, $2, $3);`
        db.query(sql, [faction_id, unit_id, JSON.stringify(res[unit_id])])
    }
    return
}

// storeFactionData()

// storeUnitData('NEC')
// storeUnitData('TS')
// storeUnitData('ORK')
// storeUnitData('TAU')

// storeUnitData('LoV')
// storeUnitData('QT')
// storeUnitData('WE')
// storeUnitData('QI')

// storeUnitData('UN')
// storeUnitData('AdM')
// storeUnitData('GK')
// storeUnitData('AoI')

// storeUnitData('TL')
// storeUnitData('GC')
// storeUnitData('AM')
// storeUnitData('AE')

// storeUnitData('AC')
// storeUnitData('CSM')
// storeUnitData('TYR')
// storeUnitData('DRU')

// storeUnitData('AS')
// storeUnitData('CD')
// storeUnitData('DG')
// storeUnitData('EC')

// storeUnitData('SM')

// no unaligned forces data 

// change whether first or second half is being accumulated in faction.js
import ArmyChoices from './ArmyChoices/ArmyChoices'
import ChapterChoice from './ChapterChoice/ChapterChoice'
import FactionRules from './FactionRules/FactionRules'
import styles from './PopUp.module.css'
import SubFactionChoice from './SubFactionChoices/SubFactionChoices'
import { useState } from "react"
import { useEffect } from "react"

export default function PopUp({trigger, setTrigger, setCreate, 
    selectedArmy, setSelectedArmy, setselectedSubFaction, setRemainingPoints,
    setArmyName, setPointLimit, setColour, armyName, selectedSubFaction, colour, setSelectedChapter, selectedChapter }) {
    const [factions, setFactions] = useState() 
    const [subFactionSelectedIndex, setSubFactionSelectedIndex] = useState('')
    useEffect(() => {
        fetch('/api/factions/psql')
            .then(res=> res.json())
            .then(res => setFactions(res))
    },[])
    function handleClose () {
        setTrigger(false)
        setSelectedArmy()
        setselectedSubFaction()
        setArmyName('')
        setPointLimit(2000)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setTrigger(false)
        setCreate(true)
    }
    function changeArmy(e) {
        if (subFactionSelectedIndex) {
            subFactionSelectedIndex.selectedIndex=0 // resets the form-> subfaction select
        }
        let target = e.target.value
        if (target !== 'dontSelectThis') {
            setselectedSubFaction()
            setSelectedArmy(factions[target])
            setColour(factions[target].faction_info[1])
            return
        } else {
            setselectedSubFaction()
            setSelectedArmy()
            return
        }
    }
    function changeSubFaction(e) {
        setSubFactionSelectedIndex(e.target)  
        if (selectedArmy) {
            if (e.target.value !== 'None') {
                setselectedSubFaction({[e.target.value]:selectedArmy.faction_info[3][e.target.value]})
            } else {
                setselectedSubFaction()  
            }
        }
    }
    
    let barWidth = ((armyName.length)/20) *100
    if (barWidth > 100) {
        barWidth = 100
    }

    function handlesetArmyName(e) {
        var maxLength = 21;
        if (e.target.value.length >= maxLength) {
            return false;
        }
        setArmyName(e.target.value)
        return true;
    }
    
    function handleChapter(e) {
        setSelectedChapter(e.target.value)
    }
    return (trigger ? ( <>
    <div className={styles.popupLeft}>
        <div className={styles.popupLeftInner}>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="">Select Faction</label>
                <select name="factions" id="" onChange={changeArmy} className={styles.dropdown}>
                    <option value='dontSelectThis'>All Factions</option>
                    <ArmyChoices factions={factions} />
                </select>
                {selectedArmy?.faction_id === 'SM' ? 
                <>
                <label htmlFor="">Select Chapter</label>
                <select name="subFactions" id="" onChange={handleChapter} className={styles.dropdown}>
                    <option key="none" value='None'>Select a Chapter</option>
                    <ChapterChoice selectedArmy={selectedArmy} />
                </select>
                </>
                : null}
                
                <label htmlFor="">Select Detachment</label>
                <select name="subFactions" id="" onChange={changeSubFaction} className={styles.dropdown}>
                    <option key="none" value='None'>Select a Detachment</option>
                    <SubFactionChoice selectedArmy={selectedArmy} colour={colour} selectedChapter={selectedChapter}/>
                </select>
                <label htmlFor="">Army Name <span className={styles.Span}>- 20 char limit</span></label>
                <div className={styles.bar} style={{ width: barWidth+"%"}}></div>
                <textarea onChange={handlesetArmyName} className={styles.Textarea} maxLength={20}></textarea>
                <label htmlFor="">Create points limit</label>
                <input
                type="number"
                min="1"
                defaultValue="2000"
                onChange={(e) => {
                    setPointLimit(e.target.value);
                    setRemainingPoints(e.target.value);
                }}
                className={styles.dropdown}
                />
                {(selectedArmy && selectedArmy?.faction_id !=='SM' && selectedSubFaction) || (selectedArmy?.faction_id === 'SM' && selectedChapter !== 'None' && selectedSubFaction) 
                ? <button className={styles.createBtn} style={{backgroundColor: colour, fontWeight: '700'}}>Muster Army</button>
                : <div>Missing Selection</div>}
            </form>
        </div>
        <button className={styles.closeBtn} onClick={handleClose}>X</button>
        <div className={styles.popupRight}>
            <div className={styles.popupRightInner}>
                <FactionRules selectedArmy={selectedArmy} selectedSubFaction={selectedSubFaction} colour={colour}/>
            </div>
        </div>
    </div>
    </>
    ) : "")
}
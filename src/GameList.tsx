import React, { useEffect, useState } from 'react';
import { db } from './Firebase';
import { doc, addDoc, setDoc, onSnapshot, collection, query } from "firebase/firestore";

import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';

async function CreateGame(name: string, clear: React.Dispatch<React.SetStateAction<string>>) {
    if(name){
        clear("")
        const ref = await addDoc(collection(db, "gamelist"), {
            name: name
        })

        console.log(ref.id)

        let a = Array(64)
        a.fill(0)
        a[3 * 8 + 3] = -1
        a[4 * 8 + 4] = -1
        a[3 * 8 + 4] = 1
        a[4 * 8 + 3] = 1

        await setDoc(doc(db, "gameboards", ref.id), {
            turn: 1,
            board: a,
        })
    }
}

type listchild = {key: string, name: string}

const ListView: React.FC<{setGameKey: React.Dispatch<React.SetStateAction<any>>, setGameData: React.Dispatch<React.SetStateAction<any>>}> = (props) => {
    const [gameNameIn, setGameNameIn] = useState<string>("")
    const [gameList, setGameList] = useState<Array<listchild>>([])
    const [selectedKey, setSelectedKey] = useState<string>("")
    const [unsub, update] = useState<any>(undefined);

    useEffect(() => {onSnapshot(query(collection(db, "gamelist")), (querySnapshot) => {
        const data:Array<listchild> = []
        querySnapshot.forEach((doc) => {
            data.push({key: doc.id, name: doc.data().name})
        })
        setGameList(data)
    })}, [])

    const handleListItemClick = (key: string) => {
        setSelectedKey(key)
        props.setGameKey(key)
        if(unsub) unsub()
        update(() => {
                return onSnapshot(doc(db, "gameboards", key), (doc) => {
                    props.setGameData(doc.data())
                    console.log(doc.data())
                })
            }
        )
    }

    return (
        <div>
            <div style={{display: "flex", margin: "15px"}}>
                <TextField label="Game Name" value={gameNameIn} onChange={(e) => setGameNameIn(e.target.value)}/>
                <Button variant="outlined" onClick={() => CreateGame(gameNameIn, setGameNameIn)}>New Game</Button>
            </div>
            <div style={{margin: "0 0 0 10%"}}>
                <p>-------------Game List-------------</p>
                <Box sx={{ width: 300, maxWidth: 300, bgcolor: 'background.paper' }}>
                    <List>
                        {gameList.map((v, i) =>
                            <ListItemButton
                                key={i}
                                selected={selectedKey === v.key}
                                onClick={() => handleListItemClick(v.key)}
                            >
                            <ListItemText primary={v.name} />
                            </ListItemButton>
                        )}
                    </List>
                </Box>
            </div>
        </div>
    )
}

export default ListView;
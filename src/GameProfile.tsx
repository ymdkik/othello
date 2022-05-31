import { db } from './Firebase';
import { doc, deleteDoc } from "firebase/firestore";
import { turnT, dataT } from './App';

import Button from '@mui/material/Button';

async function DeleteUser(gamekey: string, clear: React.Dispatch<React.SetStateAction<string | undefined>>) {
    if(gamekey) {
        await deleteDoc(doc(db, "gameboards", gamekey))
        await deleteDoc(doc(db, "gamelist", gamekey))
        clear(undefined)
    }
}

const ProfileView: React.FC<{gamekey: string, setGamekey: React.Dispatch<React.SetStateAction<string | undefined>>, data: dataT}> = (props) => {
    const turnStr = {"1": "黒", "-1": "白"}

    const cnt = (t: turnT) => {
        let cnt = 0
        props.data.board.forEach(b => {
            if(b === t) cnt++
        })
        return cnt
    }
    
    return (
        <div>
            <p>{turnStr[props.data.turn]}のターン</p>
            <p>白: {cnt(-1)}</p>
            <p>黒: {cnt(1)}</p>
            <Button variant="outlined" color="error" onClick={() => DeleteUser(props.gamekey, props.setGamekey)}>End Game</Button>
        </div>
    )
}

export default ProfileView;
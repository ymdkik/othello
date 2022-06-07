import { db } from './Firebase';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { turnT, dataT, koma } from './App';

import Button from '@mui/material/Button';

async function DeleteUser(gamekey: string, clear: React.Dispatch<React.SetStateAction<string | undefined>>) {
    if(gamekey) {
        await deleteDoc(doc(db, "gameboards", gamekey))
        await deleteDoc(doc(db, "gamelist", gamekey))
        clear(undefined)
    }
}

async function ReturnGame(data: dataT, key: string) {
    if(data.cnt === 0){
        return
    }
    const board: {[key: number]: Array<koma>} = {}
    const turn: {[key: number]: turnT} = {}
    for(let i = 0; i < data.cnt; i++){
        board[i] = data.board[i]
        turn[i] = data.turn[i]
    }
    await setDoc(doc(db, "gameboards", key), {
        turn: turn,
        cnt: data.cnt - 1,
        board: board,
    })
}

const ProfileView: React.FC<{gamekey: string, setGamekey: React.Dispatch<React.SetStateAction<string | undefined>>, data: dataT}> = (props) => {
    const turnStr = {"1": "黒", "-1": "白"}

    const cnt = (t: turnT) => {
        let cnt = 0
        props.data.board[props.data.cnt].forEach(b => {
            if(b === t) cnt++
        })
        return cnt
    }
    
    return (
        <div>
            <p>{turnStr[props.data.turn[props.data.cnt]]}のターン</p>
            <p>白: {cnt(-1)}</p>
            <p>黒: {cnt(1)}</p>
            <p>ターン数: {props.data.cnt + 1}</p>
            <Button variant="outlined" onClick={() => ReturnGame(props.data, props.gamekey)}>ひとつ前に戻す</Button>
            <p></p>
            <Button variant="outlined" color="error" onClick={() => DeleteUser(props.gamekey, props.setGamekey)}>End Game</Button>
        </div>
    )
}

export default ProfileView;
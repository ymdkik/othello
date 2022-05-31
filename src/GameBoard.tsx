import React from 'react';
import { koma, turnT, dataT } from './App';
import { db } from './Firebase';
import { doc, setDoc } from "firebase/firestore";

async function UpdateBoard(key: string, nextTurn: turnT, newBoard: Array<koma>) {
    await setDoc(doc(db, "gameboards", key), {
        turn: nextTurn,
        board: newBoard,
    })
}

const BoardView: React.FC<{gamekey: string, data: dataT}> = (props) => {
    const d: dataT = props.data

    const ind: Array<Number> = [0, 1, 2, 3, 4, 5, 6, 7]
    const ba = {"-1": "〇", "0": "", "1": "●"}

    const square = {background: "#fff", border: "1px solid #999", width: "60px", height: "60px"}

    const direction:Array<Array<Number>> = [[-1, -1], [ 0, -1], [ 1, -1],
                                            [-1,  0],           [ 1,  0],
                                            [-1,  1], [ 0,  1], [ 1,  1],]

    const func = (x: Number, y: Number) => {
        if(d.board[Number(y) * 8 + Number(x)] !== 0) return
        let cnt: number = 0
        let tmp = d.board.slice()
        
        for(let i: number = 0; i < 8; i++) {
            let dx: number = Number(x), dy:number = Number(y)
            if(0 <= (dx += Number(direction[i][0])) && dx < 8 &&
               0 <= (dy += Number(direction[i][1])) && dy < 8 &&
               d.board[dy*8 + dx] === d.turn * -1){
                const change: Array<number> = []
                change.push(dy*8 + dx)
                while(0 <= (dx += Number(direction[i][0])) && dx < 8 &&
                      0 <= (dy += Number(direction[i][1])) && dy < 8){
                    if(d.board[dy*8 + dx] === 0) {
                        break
                    } else if(d.board[dy*8 + dx] === d.turn * -1) {
                        change.push(dy*8 + dx)
                    } else {
                        change.forEach(yx => {
                            tmp[yx] = d.turn
                        })
                        cnt += 1
                        break
                    }
                }
            }
        }

        if(cnt !== 0) {
            tmp[Number(y) * 8 + Number(x)] = d.turn
            let nextcnt: number = 0

            for(let y:number = 0; y < 8; y++){
                for(let x:number = 0; x < 8; x++){
                    if(tmp[y * 8 + x] !== 0) continue
                    for(let i: number = 0; i < 8; i++) {
                        let dx: number = Number(x), dy:number = Number(y)
                        if(0 <= (dx += Number(direction[i][0])) && dx < 8 &&
                           0 <= (dy += Number(direction[i][1])) && dy < 8 &&
                           tmp[dy*8 + dx] === d.turn){
                            while(0 <= (dx += Number(direction[i][0])) && dx < 8 &&
                                  0 <= (dy += Number(direction[i][1])) && dy < 8){
                                if(tmp[dy*8 + dx] === 0) {
                                    break
                                } else if(tmp[dy*8 + dx] === d.turn) {
                                    continue
                                } else {
                                    nextcnt += 1
                                    break
                                }
                            }
                        }
                    }
                }
            }
            
            const nextTurn: turnT = nextcnt === 0 ? d.turn : (d.turn === 1 ? -1 : 1)
            UpdateBoard(props.gamekey, nextTurn, tmp)
        }
    }

    return (
        <div style={{width: "50%", margin: "50px auto"}}>
            {ind.map((y) => <div key={Number(y)} style={{display: "flex"}}>{
                ind.map((x) => <button key={Number(x)} style={square} onClick={() => {func(Number(x), Number(y))}}>{
                    ba[d.board[Number(y) * 8 + Number(x)]]
                }</button>)
            }</div>)}
        </div>
    )
}

export default BoardView;
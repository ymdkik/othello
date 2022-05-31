import React, { useEffect, useState } from 'react';
import './App.css';

type koma = -1 | 0 | 1

const ViewBoard: React.FC<{board: Array<koma>, setBoard: React.Dispatch<React.SetStateAction<koma[]>>,
                            turn: -1 | 1, setTurn: React.Dispatch<React.SetStateAction<1 | -1>>}> = (props) => {

    const ind: Array<Number> = [0, 1, 2, 3, 4, 5, 6, 7]
    const ba = {"-1": "〇", "0": "", "1": "●"}

    const square = {background: "#fff", border: "1px solid #999", width: "60px", height: "60px"}

    const direction:Array<Array<Number>> = [[-1, -1], [ 0, -1], [ 1, -1],
                                            [-1,  0],           [ 1,  0],
                                            [-1,  1], [ 0,  1], [ 1,  1],]

    const func = (x: Number, y: Number) => {
        if(props.board[Number(y) * 8 + Number(x)] !== 0) return
        let cnt: number = 0
        let tmp = props.board.slice()
        
        direction.forEach(d => {
            let dx: number = Number(x), dy:number = Number(y)
            if(0 <= (dx += Number(d[0])) && dx < 8 &&
               0 <= (dy += Number(d[1])) && dy < 8 &&
               props.board[dy*8 + dx] === props.turn * -1){
                const change: Array<number> = []
                change.push(dy*8 + dx)
                while(0 <= (dx += Number(d[0])) && dx < 8 &&
                      0 <= (dy += Number(d[1])) && dy < 8){
                    if(props.board[dy*8 + dx] === 0) {
                        break
                    } else if(props.board[dy*8 + dx] === props.turn * -1) {
                        change.push(dy*8 + dx)
                    } else {
                        change.forEach(yx => {
                            tmp[yx] = props.turn
                            cnt += 1
                        })
                        break
                    }
                }
            }
        })

        if(cnt !== 0) {
            tmp[Number(y) * 8 + Number(x)] = props.turn
            props.setTurn(p => p === 1 ? -1: 1)
            props.setBoard(tmp)
        }
    }

    return (
        <div style={{width: "50%", margin: "50px auto"}}>
            {ind.map((y) => <div style={{display: "flex"}}>{
                ind.map((x) => <button style={square} onClick={() => {func(Number(x), Number(y))}}>{
                    ba[props.board[Number(y) * 8 + Number(x)]]
                }</button>)
            }</div>)}
        </div>
    )
}

const App: React.FC = () => {
    const [board, setBoard] = useState<Array<koma>>([])
    const [turn, setTurn] = useState<-1 | 1>(1)

    const turnStr = {"1": "黒", "-1": "白"}

    useEffect(() => {
        let a = Array(64)
        a.fill(0)
        a[3 * 8 + 3] = -1
        a[4 * 8 + 4] = -1
        a[3 * 8 + 4] = 1
        a[4 * 8 + 3] = 1
        setBoard(a)
    }, [])

    return (
        <>
            <p>現在のターン {turnStr[turn]}</p>
            <ViewBoard board={board} setBoard={setBoard} turn={turn} setTurn={setTurn} />
        </>
    )
}

export default App;

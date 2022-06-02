import React, { useState } from 'react';
import './App.css';
import ProfileView from "./GameProfile"
import BoardView from "./GameBoard"
import ListView from "./GameList"

export type koma = -1 | 0 | 1
export type turnT = -1 | 1
export type dataT = {board: {[key: number]: Array<koma>}, turn: {[key: number]: turnT}, cnt: number}

const App: React.FC = () => {
    const [key, setKey] = useState<string>()
    const [data, setData] = useState<dataT>()

    return (
        <div style={{display:"flex"}}>
            {key && data && <ProfileView gamekey={key} setGamekey={setKey} data={data} />}
            {key && data && <BoardView gamekey={key} data={data} />}
            <ListView setGameKey={setKey} setGameData={setData} />
        </div>
    )
}

export default App;

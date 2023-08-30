//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { useEffect, useState } from 'react'
//import { getChild} from './api';
import { getHLPPositions } from './api/index';

import './App.css'

interface Position {
  coin: string;
  price: number;
  dollarValue: number;
  dollarValuePerc: number;
  szi: number;
}

interface Positions {
  shortPos: Position[];
  longPos: Position[];
  accountVal: number;
  netPosValue: number;
  netPosValuePerc: number;
}

function App() {
  //const [count, setCount] = useState(0)
  const [positions, setPositions] = useState<Positions | null>(null);
  useEffect(() => {
    console.log('here');
    getHLPPositions()
    .then((data) => {
      setPositions(data);
      console.log('done', positions);
    });
  }, []);
  return (
  <div>
    <h1>hlp summary</h1>
    {!positions && <h2>Loading...</h2>}
    {positions && (
      <>
         <div>HLP value: {new Intl.NumberFormat().format(positions.accountVal)}</div>
      <div>net hlp position value: {new Intl.NumberFormat().format(positions.netPosValue)}</div>
      <div>net hlp position as percentage of hlp value: {new Intl.NumberFormat().format(positions.netPosValuePerc)}</div>
        <h2>Short Positions</h2>
        <table>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Size</th>
              <th>Price</th>
              <th>Dollar Value</th>
              <th>Percentage of Vault Val</th>
            </tr>
          </thead>
          <tbody>
            {positions.shortPos.map((position) => (
              <tr key={position.coin}>
                <td>{position.coin}</td>
                <td>{new Intl.NumberFormat().format(position.szi)}</td>
                <td>{new Intl.NumberFormat().format(position.price)}</td>
                <td>{new Intl.NumberFormat().format(position.dollarValue)}</td>
                <td>{new Intl.NumberFormat().format(position.dollarValuePerc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Long Positions</h2>
        <table>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Size</th>
              <th>Price</th>
              <th>Dollar Value</th>
              <th>Percentage of Vault Val</th>
            </tr>
          </thead>
          <tbody>
            {positions.longPos.map((position) => (
              <tr key={position.coin}>
                <td>{position.coin}</td>
                <td>{new Intl.NumberFormat().format(position.szi)}</td>
                <td>{new Intl.NumberFormat().format(position.price)}</td>
                <td>{new Intl.NumberFormat().format(position.dollarValue)}</td>
                <td>{new Intl.NumberFormat().format(position.dollarValuePerc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div> 
  )
}

export default App


async function getChildVaultPosition(addr) {
    const data = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'clearinghouseState',
            user: addr
        })
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
    return data;

}

async function getMids() {
    const data = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'allMids',
        })
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
    return data;

}

function getVaultVal(vault) {
    //return parseInt(vault.withdrawable);
    return parseInt(vault.marginSummary.accountValue);
}
export async function getHLPPositions() {
    const vault1 = await getChildVaultPosition('0x010461c14e146ac35fe42271bdc1134ee31c703a');
    const vault2 = await getChildVaultPosition('0x2e3d94f0562703b25c83308a05046ddaf9a8dd14');
    const vault3 = await getChildVaultPosition('0x31ca8395cf837de08b24da3f660e77761dfb974b');
    const leader = await getChildVaultPosition('0x677d831aef5328190852e24f13c46cac05f984e7');
    const parent = await getChildVaultPosition('0xdfc24b077bc1425ad1dea75bcb6f8158e10df303');
    const mids = await getMids();
    //console.log(vault1.assetPositions[0], vault2.assetPositions[0], vault3.assetPositions[0], leader.assetPositions[0]);
    const accountVal = getVaultVal(vault1) + getVaultVal(vault2) + getVaultVal(vault3) + getVaultVal(leader) + getVaultVal(parent);
    console.log("parent", parent);
    console.log("vault1", vault1);
    console.log("vault2", vault2);
    console.log("vault3", vault3);
    console.log("accountVal", accountVal);
    const vaults = [vault1, vault2, vault3, leader];
    const assetPositions = vaults.reduce((acc, vault) => {
        vault.assetPositions.forEach(position => {
            const existingPosition = acc.find(p => p.coin === position.position.coin);
            if (existingPosition) {
                existingPosition.szi += parseFloat(position.position.szi);
            } else {
                acc.push({
                    coin: position.position.coin,
                    szi: parseFloat(position.position.szi)
                });
            }
        });
        return acc;
    }, []);
    console.log("Combined Asset Positions: ", assetPositions);
    assetPositions.forEach(position => {
        const mid = mids[position.coin];
        if (mid) {
            position.price = mid;
            position.dollarValue = parseFloat(mid) * position.szi;
            position.dollarValuePerc = (position.dollarValue / accountVal) * 100;

        }
    });
    console.log("Updated Asset Positions: ", assetPositions);
    let sumNegativeDollarValue = 0;
    let sumPositiveDollarValue = 0;
    const shortPos = [];
    const longPos = [];
    assetPositions.forEach(position => {
        if (position.dollarValue < 0) {
            sumNegativeDollarValue += position.dollarValue;
            shortPos.push(position)
        } else {
            sumPositiveDollarValue += position.dollarValue;
            longPos.push(position)
        }
    });
    const netPosValue = sumNegativeDollarValue + sumPositiveDollarValue;
    console.log("Sum of Negative Dollar Value: ", sumNegativeDollarValue);
    console.log("Sum of Positive Dollar Value: ", sumPositiveDollarValue);
    console.log("netPosValue", netPosValue);
    return {
        shortPos,
        longPos,
        accountVal,
        sumNegativeDollarValue,
        sumPositiveDollarValue,
        netPosValue,
        netPosValuePerc: (netPosValue / accountVal) * 100
    }



}

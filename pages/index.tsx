import React, { useMemo, useState } from 'react';
import type { NextPage } from 'next'
import CallsModule from '../components/CallsModule';
import { ethers } from 'ethers';
import Sunrises from '../components/Sunrises';

const BEAN            = "0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab";
const BEANCRV3        = "0xc9C32cd16Bf7eFB85Ff14e0c8603cc90F6F2eE49";
const UNRIPE_BEAN     = "0x1BEA0050E63e05FBb5D8BA2f10cf5800B6224449";
const UNRIPE_BEANCRV3 = "0x1BEA3CcD22F4EBd3d37d731BA31Eeca95713716D";


export const localeNumber = (decimals: number, maxFractionDigits?: number) => 
  (v: ethers.BigNumber) => parseFloat(ethers.utils.formatUnits(v, decimals)).toLocaleString('en-us', { maximumFractionDigits: maxFractionDigits || 3 });
export const percentNumber = (decimals: number) =>
  (v: ethers.BigNumber) => `${(parseFloat(ethers.utils.formatUnits(v, decimals))*100).toFixed(4)}%`

const Home: NextPage = () => {
  const [raw, setRaw] = useState(false);

  return (
    <div className="bg-gray-900 h-screen text-white flex flex-col">
      <div className="px-2 py-2 border-b border-gray-800 w-full flex flex-row items-center justify-between">
        <div>Beanstalk</div>
        <div className="flex flex-row items-center space-x-1 cursor">
          <label htmlFor="raw">Show raw values</label>
          <input id="raw" type="checkbox" checked={raw} onChange={() => setRaw(!raw)} />
        </div>
      </div>
      <div className="h-full overflow-scroll flex flex-col space-y-2 p-4">
        <CallsModule
          title="Sun"
          slots={[
            ['Paused', 'paused'],
            ['Season', 'season'],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Fertilizer"
          slots={[
            // Whether the Fertilizer system is being used
            ['Is Fertilizing?', 'isFertilizing', undefined, undefined, 'True if Beanstalk still owes beans to Fertilizer.'],
            // BPF indices
            ['Current BPF', 'beansPerFertilizer', localeNumber(6), undefined, 'The current number of Beans paid per Fertilizer.'],
            ['End BPF', 'getEndBpf', localeNumber(6), undefined, 'The BPF at which Fertilizer bought during this Season will stop receiving new Bean mints.'],
            // Amounts of Fertilizer, Beans, etc.
            ['Fertilized Beans', 'totalFertilizedBeans', localeNumber(6), undefined, 'Beans paid to Fertilizer.'],
            ['Unfertilized Beans', 'totalUnfertilizedBeans', localeNumber(6), undefined, 'Beans owed to Fertilizer.'],
            ['Fertilized + Unfertilized Beans', 'totalFertilizerBeans', localeNumber(6), undefined, 'Fertilized Beans + Unfertilized Beans'],
            ['Active Fertilizer', 'getActiveFertilizer', localeNumber(0), undefined, 'The number of Fertilizer currently receiving Bean mints.'],
            // Recapitalization Progress
            ['Remaining Recap', 'remainingRecapitalization', localeNumber(6), undefined, 'The number of USDC remaining to be raised. 1 USDC can purchase 1 FERT.'], // measured in USDC
            ['Recap Paid Percent', 'getRecapPaidPercent', percentNumber(6)],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Unripe"
          slots={[
            ['Is Unripe? (BEAN)', 'isUnripe', undefined, [UNRIPE_BEAN]],
            ['Is Unripe? (BEAN:3CRV)', 'isUnripe', undefined, [UNRIPE_BEANCRV3]],
            ['% Penalty (BEAN)', 'getPercentPenalty', undefined, [UNRIPE_BEAN]],
            ['% Penalty (BEAN:3CRV)', 'getPercentPenalty', undefined, [UNRIPE_BEANCRV3]],
            ['Underlying per Unripe (BEAN)', 'getUnderlyingPerUnripeToken', localeNumber(6), [UNRIPE_BEAN]],
            ['Underlying per Unripe (BEAN:3CRV)', 'getUnderlyingPerUnripeToken', localeNumber(18), [UNRIPE_BEANCRV3]],
            ['Total Underlying (BEAN)', 'getTotalUnderlying', localeNumber(6), [UNRIPE_BEAN]],
            ['Total Underlying (BEAN:3CRV)', 'getTotalUnderlying', localeNumber(18), [UNRIPE_BEANCRV3]],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Silo"
          slots={[
            ["Withdraw Freeze", "withdrawFreeze"],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Field"
          slots={[
            ["Pods", "totalPods", localeNumber(6)],
            ["Soil", "totalSoil", localeNumber(6)],
            ["Temperature", "yield", percentNumber(2)],
            ["Harvested Pods", "totalHarvested", localeNumber(6)],
            ["Harvestable Index", "harvestableIndex", localeNumber(6)]
          ]}
          raw={raw}
        />
        <CallsModule
          title="BDV"
          slots={[
            ["Beans", "bdv", localeNumber(6, 6), [BEAN, ethers.utils.parseUnits('1', 6)]],
            ["Bean:3CRV", "bdv", localeNumber(6, 6), [BEANCRV3, ethers.utils.parseUnits('1', 18)]],
            ["Unripe Beans", "bdv", localeNumber(6, 6), [UNRIPE_BEAN, ethers.utils.parseUnits('1', 6)]],
            ["Unripe Bean:3CRV", "bdv", localeNumber(6, 6), [UNRIPE_BEANCRV3, ethers.utils.parseUnits('1', 6)]],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Convert"
          slots={[
            ["1 BEAN -> BEAN:3CRV",     "getAmountOut", localeNumber(18, 6), [BEAN, BEANCRV3, ethers.utils.parseUnits('1', 6)]],
            ["1 urBEAN -> urBEAN:3CRV", "getAmountOut", localeNumber(6, 6),  [UNRIPE_BEAN, UNRIPE_BEANCRV3, ethers.utils.parseUnits('1', 6)]],
            ["1 BEAN:3CRV -> BEAN",     "getAmountOut", localeNumber(6, 6),  [BEANCRV3, BEAN, ethers.utils.parseUnits('1', 18)]],
            ["1 urBEAN:3CRV -> urBEAN", "getAmountOut", localeNumber(6, 6),  [UNRIPE_BEANCRV3, UNRIPE_BEAN, ethers.utils.parseUnits('1', 6)]],
            ["Max: BEAN -> BEAN:3CRV",  "getMaxAmountIn",  localeNumber(6, 6),  [BEAN, BEANCRV3]],
            ["Max: urBEAN -> urBEAN:3CRV",  "getMaxAmountIn",  localeNumber(6, 6),  [UNRIPE_BEAN, UNRIPE_BEANCRV3]],
            ["Max: BEAN:3CRV -> BEAN",     "getMaxAmountIn", localeNumber(18, 6),  [BEANCRV3, BEAN]],
            ["Max: urBEAN:3CRV -> urBEAN", "getMaxAmountIn", localeNumber(6, 6),  [UNRIPE_BEANCRV3, UNRIPE_BEAN]],
          ]}
          raw={raw}
          multicall={false}
        />
        <Sunrises />
      </div>
      <div className="px-2 py-2 border-t text-sm text-gray-600 border-gray-800 w-full">
        Connected to {process.env.NEXT_PUBLIC_RPC_URL || 'unknown'} ({process.env.NEXT_PUBLIC_CHAIN_ID || '?'})
      </div>
    </div>
  )
}

export default Home

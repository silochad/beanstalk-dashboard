import React, { useMemo, useState } from 'react';
import type { NextPage } from 'next'
import Module from '../components/Module';
import { ethers } from 'ethers';

const UNRIPE_BEAN     = "0x1BEA0050E63e05FBb5D8BA2f10cf5800B6224449";
const UNRIPE_BEANCRV3 = "0x1BEA3CcD22F4EBd3d37d731BA31Eeca95713716D";

const Home: NextPage = () => {
  const [raw, setRaw] = useState(false);
  const { localeNumber, percentNumber } = useMemo(() => ({
    localeNumber: (decimals: number) => 
      (v: ethers.BigNumber) => parseFloat(ethers.utils.formatUnits(v, decimals)).toLocaleString('en-us'),
    percentNumber: (decimals: number) =>
      (v: ethers.BigNumber) => `${(parseFloat(ethers.utils.formatUnits(v, decimals))*100).toFixed(4)}%`
  }), [])

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
        <Module
          title="Sun"
          slots={[
            ['Season', 'season'],
          ]}
          raw={raw}
        />
        <Module
          title="Fertilizer"
          slots={[
            ['Is Fertilizing?', 'isFertilizing'],
            ['Beans per Fertilizer', 'beansPerFertilizer'],
            ['End BPF', 'getEndBpf', localeNumber(6)],
            ['Total Fertilized', 'totalFertilizedBeans', localeNumber(6)],
            ['Total Fertilizer', 'totalFertilizerBeans', localeNumber(6)],
            ['Penalty (BEAN)', 'getPercentPenalty', undefined, [UNRIPE_BEAN]],
            ['Penalty (BEAN:3CRV)', 'getPercentPenalty', undefined, [UNRIPE_BEANCRV3]],
            ['Is Unripe? (BEAN)', 'isUnripe', undefined, [UNRIPE_BEAN]],
            ['Is Unripe? (BEAN:3CRV)', 'isUnripe', undefined, [UNRIPE_BEANCRV3]],
            ['Remaining Recap', 'remainingRecapitalization', localeNumber(6)],
            ['Recap Paid Percent', 'getRecapPaidPercent', percentNumber(6)],
            ['Recap Funded Percent (BEAN)', 'getRecapFundedPercent', percentNumber(6), [UNRIPE_BEAN]],
            ['Recap Funded Percent (BEAN:3CRV)', 'getRecapFundedPercent', percentNumber(6), [UNRIPE_BEANCRV3]],
            ['Underlying per Unripe (BEAN)', 'getUnderlyingPerUnripeToken', localeNumber(6), [UNRIPE_BEAN]],
            ['Underlying per Unripe (BEAN:3CRV)', 'getUnderlyingPerUnripeToken', localeNumber(18), [UNRIPE_BEANCRV3]],
            ['Total Underlying (BEAN)', 'getTotalUnderlying', localeNumber(6), [UNRIPE_BEAN]],
            ['Total Underlying (BEAN:3CRV)', 'getTotalUnderlying', localeNumber(18), [UNRIPE_BEANCRV3]],
          ]}
          raw={raw}
        />
        <Module
          title="Silo"
          slots={[
            ["Withdraw Freeze", "withdrawFreeze"],
          ]}
          raw={raw}
        />
        <Module
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
        <Module
          title="BDV"
          slots={[
            ["Beans", "bdv", localeNumber(6), ['0xBEA0003eA948Db32082Fc6F4EC0729D258a0444c', ethers.utils.parseUnits('1', 6)]],
            ["Bean:3CRV", "bdv", localeNumber(6), ['0xc9C32cd16Bf7eFB85Ff14e0c8603cc90F6F2eE49', ethers.utils.parseUnits('1', 6)]],
            ["Unripe Beans", "bdv", localeNumber(6), ['0x1BEA0050E63e05FBb5D8BA2f10cf5800B6224449', ethers.utils.parseUnits('1', 6)]],
            ["Unripe Bean:3CRV", "bdv", localeNumber(6), ['0x1BEA3CcD22F4EBd3d37d731BA31Eeca95713716D', ethers.utils.parseUnits('1', 6)]],
          ]}
          raw={raw}
        />
      </div>
      <div className="px-2 py-2 border-t text-sm text-gray-600 border-gray-800 w-full">
        Connected to {process.env.NEXT_PUBLIC_RPC_URL || 'unknown'} ({process.env.NEXT_PUBLIC_CHAIN_ID || '?'})
      </div>
    </div>
  )
}

export default Home

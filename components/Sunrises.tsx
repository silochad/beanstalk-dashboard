import { useEffect, useState } from "react"
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import { RewardEvent, SunriseEvent } from "../generated/Beanstalk";
import contracts from "../lib/contracts"
import { provider } from "../lib/provider";
import { ethers } from "ethers";

const SECONDS_PER_HOUR  = 60*60;
const AVG_SECONDS_PER_BLOCK = 10;
const AVG_BLOCKS_PER_HOUR = SECONDS_PER_HOUR/AVG_SECONDS_PER_BLOCK;
const NUM_SEASONS = 5;

type Blocks = { [blockNumber: string] : { [event: string] : any } };

export default function Sunrises() {
  const [eventsByBlock, setEventsByBlock] = useState<null | Blocks>(null);
  useEffect(() => {
    (async () => {
      const bn = await provider.getBlockNumber();
      const blocksBack =  bn - (NUM_SEASONS + 1) * AVG_BLOCKS_PER_HOUR;
      const groupedEvents = await Promise.all([
        contracts.beanstalk.queryFilter(
          contracts.beanstalk.filters.Reward(),
          blocksBack, // try to query ~NUM_SEASONS season events
        ),
        contracts.beanstalk.queryFilter(
          contracts.beanstalk.filters.Sunrise(),
          blocksBack, // try to query ~NUM_SEASONS season events
        )
      ]);

      const blocks : Blocks = {}
      flatten<RewardEvent | SunriseEvent>(groupedEvents).forEach(
        event => {
          if (!blocks[event.blockNumber]) blocks[event.blockNumber] = {};
          blocks[event.blockNumber][event.event || 'unknown'] = event.args;
        }
      )
      setEventsByBlock(blocks);
    })();
  }, [])
  return (
    <div>
      <div className="border border-gray-400 max-w-sm">
        <h2 className="border-b border-gray-400 bg-gray-700 px-2 py-1 font-bold">
          Sunrises
        </h2>
        {eventsByBlock ? Object.keys(eventsByBlock).sort((a, b) => parseInt(b) - parseInt(a)).map(blockNumber => {
          const events = eventsByBlock[blockNumber];
          return (
            <div key={blockNumber} className="border-gray-400 border-b p-1">
              Sunrise @ Block #{blockNumber.toString()}
              <div className="ml-2">
                New Season: {events['Sunrise']?.toString() || 'Unknown'}<br/>
                To Field: {ethers.utils.formatUnits(events['Reward']?.toField || '0', 6)}<br/>
                To Silo: {ethers.utils.formatUnits(events['Reward']?.toSilo || '0', 6)}<br/>
                To Fertilizer: {ethers.utils.formatUnits(events['Reward']?.toFertilizer || '0', 6)}<br/>
                <pre>{JSON.stringify(events, null, 2)}</pre>
              </div>
            </div>
          )
        }) : null}
      </div>
    </div>
  )
}
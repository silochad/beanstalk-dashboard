import React, { useEffect, useState } from 'react';

import contracts from '../lib/contracts';
import { Beanstalk } from '../generated';
import { ethcallProvider } from '../lib/provider';
import { Contract } from 'ethers-multicall';
import { ethers } from 'ethers';

type ModuleSlot = [
  name: string,
  method: (keyof Beanstalk['functions']),
  parseResult?: (value: any) => string | JSX.Element,
  args?: any[],
  desc?: string,
];

const Slot = ({
  slot,
  data,
  index,
  raw
}: {
  slot: ModuleSlot,
  data: any[] | null,
  index: number,
  raw?: boolean,
}) => {
  /** expanded? */
  const [exp, setExp] = useState(false);
  const [name, method, parseResult, args, desc] = slot;
  return (
    <>
      <div className="flex flex-row justify-between items-center px-2 py-1 gap-2 cursor-pointer hover:bg-gray-800" onClick={() => setExp(!exp)}>
        <span>{name}</span>
        {data ? (
          <span>
            {raw ? (
              <pre>{JSON.stringify(data[index].toString(), null, 2)}</pre>
            ) : (
              data[index] ?
                parseResult
                  ? parseResult(data[index])
                  : data[index].toString()
                : '?'
            )}
          </span>
        ) : null}
      </div>
      {exp && (
        <div className="px-2 text-gray-400 text-sm break-words pb-2">
          {method}({args?.join(', ')})
          {desc && <><br/>{desc}</>}
        </div>
      )}
    </>
  );
}

const CallsModule : React.FC<{
  title: string;
  slots: ModuleSlot[];
  raw?: boolean;
  multicall?: boolean;
}> = ({
  title,
  slots,
  raw = false,
  multicall = true,
}) => {
  const [data, setData] = useState<null | any[]>(null);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  useEffect(() => {
    (async () => {
      try {
        if (multicall) {
          await ethcallProvider.init();
          const results = await ethcallProvider.all(
            slots.map(slot => {
              const args = (slot[3] || []);
              return (contracts.multi.beanstalk as unknown as Contract)[slot[1]](...args);
            })
          );
          setData(results);
          setStatus('ready');
        } else {
          const results = await Promise.all(
            slots
              .map(slot => {
                const args = (slot[3] || []);
                console.log(contracts.beanstalk[slot[1]](...args))
                return (contracts.beanstalk[slot[1]](...args) as Promise<any>).catch((err) => {
                  console.error(err);
                  return null;
                });
              }),
          );
          setData(results);
          setStatus('ready');
        }
      } catch (err) {
        console.error(err);
      }
    })()
  }, [multicall, slots])
  return (
    <div>
      <div className="border border-gray-400 max-w-sm">
        <h2 className="border-b border-gray-400 bg-gray-700 px-2 py-1 font-bold">{title}</h2>
        {slots.map((slot, index) => (
          <Slot
            key={index}
            index={index}
            slot={slot}
            data={data}
            raw={raw}
          />
        ))}
      </div>
    </div>
  )
}

export default CallsModule;
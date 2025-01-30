'use client'

import { useState, useEffect } from 'react'
import useStored from '@/lib/store/zusstore'
import lengthstore from '@/lib/store/sessioninfo'

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const { items, addItems, removeItem, clearItems} = useStored();
  const { length, add, clearlength} = lengthstore();
  


  
useEffect(() => {
    const fetchit = async () => { 
    try {
      if((await (items.length)) === 0) {
      const res = await fetch('api/gettasks');
      const data = await res.json();

      await addItems(data);
      await useStored.persist.rehydrate();
      console.log('data fetched in newhome');
      }
      else {
        console.log('no need to fetch');
      }
    } catch(err) {
      console.log(err);
    }
    await console.log(items);
    await add(items.length);
    console.log(length, "from store"); console.log(items);
  }; fetchit();
  }, []);

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!(items.length)) {
      const res = await fetch('api/gettasks');
      const data = await res.json();s
      addItems(data);
      console.log('data fetched');
      }
    } catch(err) {
      console.log(err);
    }
    await console.log(items);
    add(items.length);
    console.log(length, "from store"); console.log(items);console.log(items);console.log(items);console.log(items);
  }*/


  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Persistent Array Storage</h1>
        <button onClick={clearlength}>clearlength</button>
        
        
        <form  className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter item or JSON array"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={clearItems}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Stored Items:</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">No items stored</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded"
                >
                  <span>{JSON.stringify(item)}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

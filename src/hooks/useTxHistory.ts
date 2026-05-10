import { useState } from 'react'
import type { TxRecord } from '../types'

export function useTxHistory() {
  const [txs, setTxs] = useState<TxRecord[]>([])

  function addTx(tx: Omit<TxRecord, 'id' | 'timestamp'>) {
    setTxs(prev => [{ ...tx, id: Date.now().toString(), timestamp: new Date() }, ...prev])
  }

  function clearTxs() { setTxs([]) }

  return { txs, addTx, clearTxs }
}
export type Theme = 'dark' | 'light'
export type Mode  = 'swap' | 'bridge'

export interface Token {
  symbol: string
  name:   string
  color:  string
  letter: string
  price:  number
}

export interface Chain {
  id:    string
  label: string
  color: string
  icon:  string
}

export interface TxRecord {
  id:        string
  type:      Mode
  fromToken: string
  toToken:   string
  amount:    number
  amountOut: number
  hash:      string
  timestamp: Date
  status:    'confirmed' | 'pending' | 'failed'
  fromChain?: string
  toChain?:   string
}
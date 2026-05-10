export interface Token {
  symbol: string
  name:   string
  color:  string
  letter: string
  price:  number
}

export const TOKENS: Record<string, Token> = {
  USDC:   { symbol:'USDC',   name:'USD Coin',   color:'#2775ca', letter:'U', price:1.00    },
  USDT:   { symbol:'USDT',   name:'Tether',     color:'#26a17b', letter:'T', price:1.00    },
  EURC:   { symbol:'EURC',   name:'Euro Coin',  color:'#0052ff', letter:'E', price:1.08    },
  NATIVE: { symbol:'NATIVE', name:'Native',     color:'#627eea', letter:'N', price:2841.50 },
}

export const TOKEN_LIST = Object.values(TOKENS)
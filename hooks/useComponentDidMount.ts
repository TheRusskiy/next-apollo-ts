import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useComponentDidMount(func: () => any) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(func, [])
}

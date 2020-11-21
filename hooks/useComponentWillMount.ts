import { useRef } from 'react'

import useComponentDidMount from './useComponentDidMount'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useComponentWillMount(func: () => any) {
  const willMount = useRef(true)

  if (willMount.current) {
    func()
  }

  useComponentDidMount(() => {
    willMount.current = false
  })
}

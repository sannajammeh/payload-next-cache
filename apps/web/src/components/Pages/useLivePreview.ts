import { subscribe, unsubscribe, ready } from '@payloadcms/live-preview'
import { useCallback, useEffect, useState, useRef } from 'react'

export const useLivePreview = <T extends any>(props: {
  depth?: number
  initialData: T
  serverURL: string
}): {
  data: T
  isLoading: boolean
} => {
  const { depth = 0, initialData, serverURL } = props
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const hasSentReadyMessage = useRef<boolean>(false)

  const onChange = useCallback((mergedData: any) => {
    console.log('CALLED')
    // When a change is made, the `onChange` callback will be called with the merged data
    // Set this merged data into state so that React will re-render the UI
    setData(mergedData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Listen for `window.postMessage` events from the Admin panel
    // When a change is made, the `onChange` callback will be called with the merged data
    const subscription = subscribe({
      callback: onChange,
      depth,
      initialData,
      serverURL,
    })

    window.addEventListener('message', (e) => console.log(e))

    // Once subscribed, send a `ready` message back up to the Admin panel
    // This will indicate that the front-end is ready to receive messages
    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })
    }

    // When the component unmounts, unsubscribe from the `window.postMessage` events
    return () => {
      unsubscribe(subscription)
    }
  }, [serverURL, onChange, depth, initialData])

  return {
    data,
    isLoading,
  }
}

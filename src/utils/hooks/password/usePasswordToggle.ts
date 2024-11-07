import {useState} from 'react'

export const usePasswordToggle = () => {
  const [secure, setSecure] = useState(true)
  const toggleSecure = () => setSecure(!secure)
  return {secure, toggleSecure}
}

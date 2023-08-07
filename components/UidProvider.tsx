import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import uuid from 'react-native-uuid'
import LocalStorage from '../services/LocalStorage'

const UidStorageKeyType = 'uid'

export const UidContext = createContext<string | null>(null)

async function getOrCreateUid() {
  const localStorage = LocalStorage.forKey({ type: UidStorageKeyType })
  let uid = await localStorage.loadData('')
  if (!uid) {
    uid = uuid.v4() as string
    await localStorage.saveData(uid)
  }
  return uid
}

export default function UidProvider(props: PropsWithChildren): JSX.Element {
  const [uid, setUid] = useState<string>()

  useEffect(() => {
    (async () => setUid(await getOrCreateUid()))()
  }, [])

  return (
    <UidContext.Provider value={uid}>
      {props.children}
    </UidContext.Provider>
  )
}
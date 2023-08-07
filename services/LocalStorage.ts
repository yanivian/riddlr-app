import AsyncStorage from '@react-native-async-storage/async-storage'

interface DataKey {
  type: string
  subtype?: string
}

export default class LocalStorage {

  static forKey(key: DataKey): LocalStorage {
    return new LocalStorage(key)
  }

  async loadData<T>(defaultValue: T): Promise<T | undefined> {
    return AsyncStorage.getItem(this.keyStr_)
      .then((payload) => {
        if (!payload) {
          return defaultValue
        }
        return JSON.parse(payload)
      })
  }

  async saveData<T>(data: T): Promise<void> {
    return AsyncStorage.setItem(this.keyStr_, JSON.stringify(data))
  }

  async clearData(): Promise<void> {
    return AsyncStorage.removeItem(this.keyStr_)
  }

  private constructor(key: DataKey) {
    this.keyStr_ = keyToString(key)
  }

  private keyStr_: string
}

function keyToString(key: DataKey) {
  if (!key.subtype) {
    return `${key.type}`
  }
  return `${key.type}_${key.subtype}`
}
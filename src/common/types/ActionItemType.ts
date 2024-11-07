import React from 'react'

export type ActionItemType = {
  id: number | '#cancel'
  icon?: React.ReactNode | undefined
  label: string
  onPress: () => void
}

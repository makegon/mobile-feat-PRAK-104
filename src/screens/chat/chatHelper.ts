import {MessageType} from '../../common/types/MessageType.ts'
import {ChatRoles} from '../../common/enums.ts'
import {ActionItemType} from '../../common/types/ActionItemType.ts'

export const prepareMessageListData = (messages: MessageType[], isGptTyping: boolean, tempMessage: MessageType | null): MessageType[] => {
  const tempMessageData: MessageType | null =
    isGptTyping && tempMessage
      ? {
          id: 'tempMessage',
          role: ChatRoles.SYSTEM,
          message: tempMessage.message,
          created_at: new Date(),
          updated_at: new Date(),
        }
      : null

  const data = [...(tempMessageData ? [tempMessageData] : []), ...(messages.slice() || [])]

  return data.filter((item): item is MessageType => item !== null)
}

export const getChatPhotoActionItems = (cameraCallback: () => void, galleryCallback: () => void): ActionItemType[] => {
  return [
    {
      id: 1,
      label: 'Сфотографировать',
      onPress: cameraCallback,
    },
    {
      id: 2,
      label: 'Выбрать из галереи',
      onPress: galleryCallback,
    },
  ]
}

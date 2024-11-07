import {TRootStore} from './RootStore.ts'
import {makeAutoObservable, runInAction} from 'mobx'
import {io, Socket} from 'socket.io-client'
import {GptResponseType, MessageType} from '../common/types/MessageType.ts'
import {getRefreshToken, getToken, setRefreshToken, setToken} from '../utils/secureStorage.ts'
import {ChatType, CurrentChatType} from '../common/types/ChatType.ts'
import {network} from '../RootNavigation.tsx'
import {ChatRoles, ResponseMessageTypes} from '../common/enums.ts'
import {TokensType} from '../common/types/UserType.ts'
import {Asset} from 'react-native-image-picker'

export class ChatStore {
  constructor(private rootStore: TRootStore) {
    makeAutoObservable(this)
  }

  chats: ChatType[] | undefined = undefined
  currentChat: ChatType | null = null
  messages: MessageType[] = []
  socket: Socket | undefined = undefined
  isConnected: boolean = false
  tempMessage: MessageType | null = null
  defaultPage: number = 1
  newMessage: string = ''
  newModalMessage: string = ''
  isLoadingMore: boolean = false
  isAllMessagesLoaded: boolean = false
  isCreateChatInProcess: boolean = false
  isGetAllChatsInProcess: boolean = false
  isGetChatInProcess: boolean = false
  isSendMessageInProcess: boolean = false
  isChatLoading: boolean = false
  isGptTyping: boolean = false

  connect = async () => {
    if (this.isConnected) {
      return
    }
    try {
      const token = await getToken()
      this.socket = io('http://80.209.243.22:3000', {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: true,
      })

      this.socket.on('connect', this.handleConnect)
      this.socket.on('connect_error', async err => this.handleConnectionError(err))
      this.socket.on('auth_error', async err => this.handleAuthError(err))
      this.socket.on('disconnect', async (reason, description) => this.handleDisconnect(reason, description))
      this.socket.on('message', this.handleMessage)
      this.socket.on('gptResponse', this.handleGptResponse)
      this.socket.on('gptResponseEnd', this.handleGptResponseEnd)

      this.socket.onAny((event, ...args) => {
        console.log('Received event:', event, args)
      })
    } catch (e) {
      console.log(`connection to socket server error => ${JSON.stringify(e)}`)
    }
  }

  handleConnect = () => {
    this.setIsConnected(true)
    console.log(`handleConnect to socket server success`)
  }

  handleConnectionError = async err => {
    runInAction(() => {
      this.setIsConnected(false)
      this.socket?.disconnect()
    })
    console.log('Connection error:', err)
    await this.reconnectSocket(err)
  }

  handleAuthError = async err => {
    runInAction(() => {
      this.setIsConnected(false)
      this.socket?.disconnect()
    })
    console.log(`auth error ${err}`)
    await this.reconnectSocket(err)
  }

  handleDisconnect = async (reason, description) => {
    console.log(`handleDisconnect from socket server reason => ${reason}, description => ${description}`)
    this.setIsConnected(false)
    try {
      if (reason !== 'io client disconnect') {
        await this.reconnectSocket({message: 'Unauthorized'})
        this.setIsConnected(true)
      }
    } catch (e) {
      this.socket?.close()
    }
  }

  handleMessage = (message: MessageType) => {
    console.log(`handleMessage ${JSON.stringify(message)}`)
    this.messages = [message, ...this.messages]
    this.setIsSendMessageInProcess(false)
  }

  handleGptResponse = (message: GptResponseType) => {
    console.log(`handleGptResponse ${JSON.stringify(message)}`)
    this.setIsGptTyping(true)
    if (this.tempMessage) {
      this.tempMessage.message += message.content
    } else {
      this.tempMessage = {
        id: 0,
        role: ChatRoles.SYSTEM,
        created_at: new Date(),
        updated_at: new Date(),
        message: message.content,
      }
    }
  }

  handleGptResponseEnd = (message: MessageType) => {
    console.log(`handleGptResponseEnd ${JSON.stringify(message)}`)
    this.messages = [message, ...this.messages]
    this.setIsGptTyping(false)
    this.clearTempMessage()
  }

  sendMessage = (chatId: string, message: string, photo?: Asset) => {
    if (photo?.base64) {
      try {
        console.log('send socket message', {chatId, message})
        this.socket?.emit('sendMessage', {chatId, message, photo})
      } catch (e) {
        console.log(`error image upload ${e}`)
      }
    } else {
      console.log(`send socket message ${chatId} ${message}`)
      try {
        this.socket?.emit('sendMessage', {chatId, message})
      } catch (e) {
        console.log(`error ${e}`)
      }
    }

    setTimeout(() => {
      runInAction(() => {
        if (this.isSendMessageInProcess) {
          this.setIsSendMessageInProcess(false)
        }
      })
    }, 5000)
  }

  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect()
      this.socket.close()
      this.clearMessage()
      runInAction(() => {
        this.currentChat = null
        this.isConnected = false
      })
    }
  }

  initChat = async (chatId?: string, promptId?: string) => {
    this.setIsChatLoading(true)
    await this.connect()
    if (!chatId) {
      await this.rootStore.gptStore.getGptModels()
      await this.createChat(promptId)
    } else {
      await this.getChat(chatId)
    }
  }
  createChat = async (promptId?: string) => {
    if (this.isCreateChatInProcess) {
      return
    }
    try {
      this.setIsCreateChatInProcess(true)
      const {data} = await network.post<ChatType>('/chat/create', {
        ...(promptId ? {prompt_id: +promptId} : {}),
      })
      this.setCurrentChat(data)
    } catch (e) {
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.setIsCreateChatInProcess(false)
      setTimeout(() => {
        this.setIsChatLoading(false)
      }, 1000)
    }
  }

  getAllChats = async () => {
    if (this.isGetAllChatsInProcess) {
      return
    }
    try {
      //this.setIsGetAllChatsInProcess(true)
      const {data} = await network.get('/chat/all')
      this.setAllChats(data)
    } catch (e) {
      console.log(`get all chats error ${JSON.stringify(e)}`)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      //this.setIsGetAllChatsInProcess(false)
      setTimeout(() => {
        this.rootStore?.setIsShowLoader(false)
      }, 200)
    }
  }

  getChat = async (chatId: string, page: number = this.defaultPage) => {
    if (this.isGetChatInProcess) {
      return
    }
    try {
      this.setIsGetChatInProcess(true)
      const {data} = await network.get<CurrentChatType>(`/chat/${chatId}/${page}`)
      console.log('get chat', data)
      runInAction(() => {
        console.log('get chat', data)
        this.messages = [...this.messages, ...data.messages]
      })
    } catch (e) {
      console.log(`get chat error ${JSON.stringify(e)}`)
      this.rootStore.toastStore.setToast({
        message: `${e.response.data.message}`,
        type: 'error',
      })
    } finally {
      this.setIsGetChatInProcess(false)
      setTimeout(() => {
        this.setIsChatLoading(false)
      }, 1000)
    }
  }

  loadMoreMessages = async () => {
    if (this.isLoadingMore || this.isAllMessagesLoaded || !this.currentChat) {
      return
    }
    this.setIsLoadingMore(true)
    const prevMessageCount = this.messages.length
    await this.getChat(`${this.currentChat.id}`, this.messages.length / 10 + 1)
    console.log('load more messages', this.messages.length)
    if (this.messages.length === prevMessageCount || this.messages.length % 10 !== 0) {
      this.setIsAllMessagesLoaded(true)
    }

    this.setIsLoadingMore(false)
  }

  changeMessageText = (text: string, type: ResponseMessageTypes) => {
    switch (type) {
      case ResponseMessageTypes.TEXT: {
        this.setNewMessage(text)
        break
      }
      case ResponseMessageTypes.IMAGE: {
        this.setNewModalMessage(text)
        break
      }
    }
  }
  createNewMessage = (type: ResponseMessageTypes, id: number | string | undefined, disableModalCallback?: () => void) => {
    runInAction(() => {
      this.setIsSendMessageInProcess(true)
    })
    switch (type) {
      case ResponseMessageTypes.TEXT: {
        this.sendMessage(`${id}`, this.newMessage ?? '')
        this.setNewMessage('')
        break
      }
      case ResponseMessageTypes.IMAGE: {
        this.sendMessage(`${id}`, this.newModalMessage ?? '', this.rootStore.photoStore.selectedPhoto)
        this.setNewModalMessage('')
        if (disableModalCallback) {
          disableModalCallback()
        }
        this.rootStore.photoStore.clear()
        break
      }
    }
  }

  clearChatData = async () => {
    this.disconnect()
    this.setNewMessage('')
    this.setNewModalMessage('')
    this.setIsAllMessagesLoaded(false)
    this.setCurrentChat(null)
    this.setIsChatLoading(false)
    await this.getAllChats()
    await this.rootStore.promptStore.getPrompt()
  }

  setAllChats = (chats: ChatType[] | undefined) => {
    this.chats = chats
  }

  setCurrentChat = (chat: ChatType | null) => {
    this.currentChat = chat
  }

  setNewMessage = (text: string) => {
    this.newMessage = text
  }

  setNewModalMessage = (text: string) => {
    this.newModalMessage = text
  }

  setIsCreateChatInProcess = (value: boolean) => {
    this.isCreateChatInProcess = value
  }

  setIsGetAllChatsInProcess = (value: boolean) => {
    this.isGetAllChatsInProcess = value
  }

  setIsGetChatInProcess = (value: boolean) => {
    this.isGetChatInProcess = value
  }

  setIsSendMessageInProcess = (value: boolean) => {
    this.isSendMessageInProcess = value
  }

  setIsChatLoading = (value: boolean) => {
    this.isChatLoading = value
  }

  setIsGptTyping = (value: boolean) => {
    this.isGptTyping = value
  }

  setIsLoadingMore = (value: boolean) => {
    this.isLoadingMore = value
  }

  setIsAllMessagesLoaded = (value: boolean) => {
    console.log('setIsAllMessagesLoaded', value)
    this.isAllMessagesLoaded = value
  }

  reconnectSocket = async err => {
    if (err.message === 'Unauthorized') {
      setTimeout(async () => {
        if (this.rootStore.authStore.isRefreshTokenInProcess) {
          return
        }
        try {
          this.rootStore.authStore.setIsRefreshTokenInProcess(true)
          const refreshToken = await getRefreshToken()
          const {data} = await network.post<TokensType>('/auth/refresh-tokens', undefined, {
            headers: {
              'Refresh-token': `Bearer ${refreshToken}`,
            },
          })
          await setToken(data.access_token)
          await setRefreshToken(data.refresh_token)
        } catch {
          console.log('Connection error:', err)
        } finally {
          this.rootStore.authStore.setIsRefreshTokenInProcess(false)
        }
        if (this.socket) {
          this.socket['auth'] = {
            token: await getToken(),
          }
          this.socket.connect()
        }
      }, 3000)
    }
  }

  private setIsConnected = (value: boolean) => {
    this.isConnected = value
  }

  private clearMessage = () => {
    this.messages = []
  }

  private clearTempMessage = () => {
    this.tempMessage = null
  }
}

export type TChatStore = ChatStore

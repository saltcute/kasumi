import { ImageAttachment } from '@ksm/connection/websocket-botroot/types/attachment/image'
import { UserInGuildNonStandard } from '@ksm/connection/websocket-botroot/types/common'
import { MessageType } from '@ksm/connection/websocket-botroot/types/MessageType'
import { MessageBase } from './base'

export interface ImageMessage extends MessageBase {
  type: MessageType.image
  code: string
  content: string
  author: UserInGuildNonStandard
  attachment: ImageAttachment
}

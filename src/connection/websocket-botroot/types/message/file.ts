import { FileAttachment } from '@ksm/connection/websocket-botroot/types/attachment/file'
import { UserInGuildNonStandard } from '@ksm/connection/websocket-botroot/types/common'
import { MessageType } from '@ksm/connection/websocket-botroot/types/MessageType'
import { MessageBase } from './base'

export interface FileMessage extends MessageBase {
  type: MessageType.file
  attachment: FileAttachment
  author: UserInGuildNonStandard
}

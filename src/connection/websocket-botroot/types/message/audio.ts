import { AudioAttachment } from '@ksm/connection/websocket-botroot/types/attachment/audio'
import { UserInGuildNonStandard } from '@ksm/connection/websocket-botroot/types/common'
import { MessageType } from '@ksm/connection/websocket-botroot/types/MessageType'
import { MessageBase } from './base'

export interface AudioMessage extends MessageBase {
  type: MessageType.voice
  attachment: AudioAttachment
  author: UserInGuildNonStandard
}

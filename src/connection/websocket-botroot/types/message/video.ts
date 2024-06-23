import { VideoAttachment } from '@ksm/connection/websocket-botroot/types/attachment/video'
import { UserInGuildNonStandard } from '@ksm/connection/websocket-botroot/types/common'
import { MessageType } from '@ksm/connection/websocket-botroot/types/MessageType'
import { MessageBase } from './base'

export interface VideoMessage extends MessageBase {
  type: MessageType.video
  attachment: VideoAttachment
  author: UserInGuildNonStandard
}

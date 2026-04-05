import type { Tag } from './tag'
import type { ImageStaticTagValue } from './staticTag'

export interface Image {
	id: number
	title: string
	tags: Tag[]
	staticTagValues?: ImageStaticTagValue[]
}

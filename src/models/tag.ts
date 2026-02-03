export interface TagCategory {
	id: number
	title: string
	tags: Tag[]
}

export interface Tag {
	id: number
	title: string
	description: string
	color: string
}

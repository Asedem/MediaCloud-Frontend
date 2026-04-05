export interface StaticTagDefinition {
	id?: number
	title: string
	description?: string
}

export interface ImageStaticTagValue {
	id?: number
	definition: StaticTagDefinition
	value: number
}

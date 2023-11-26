export type Filter ={
    categories?: string,
    name?:{ $regex: RegExp },
}
export type SortOptions = {sort?:'asc' | 'desc' |{name: number}}
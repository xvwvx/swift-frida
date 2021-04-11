export class PropertyInfo {

    readonly name: string
    readonly type: NativePointer
    readonly isVar: boolean
    readonly offset: number
    readonly ownerType: NativePointer

    constructor(name: string, type: NativePointer, isVar: boolean, offset: number, ownerType: NativePointer) {
        this.name = name;
        this.type = type;
        this.isVar = isVar;
        this.offset = offset;
        this.ownerType = ownerType;
    }
}
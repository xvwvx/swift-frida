import {swift_getTypeByMangledNameInContext} from "../runtime";

export class FieldDescriptor {
    readonly mangledTypeNameOffset: number
    readonly superClassOffset: number
    readonly kind: FieldDescriptorKind
    readonly fieldRecordSize: number
    readonly numFields: number
    readonly fields: NativePointer

    constructor(ptr: NativePointer) {
        this.mangledTypeNameOffset = ptr.readS32()
        this.superClassOffset = ptr.add(4).readS32()
        this.kind = ptr.add(8).readU16()
        this.fieldRecordSize = ptr.add(10).readS16()
        this.numFields = ptr.add(12).readS32()
        this.fields = ptr.add(16)
    }

    getNumField(index: number): FieldRecord {
        return new FieldRecord(this.fields.add(4 * 3 * index))
    }
}

export class FieldRecord {
    readonly fieldRecordFlags: number
    private readonly _mangledTypeName: NativePointer
    private readonly _fieldName: NativePointer

    constructor(ptr: NativePointer) {
        this.fieldRecordFlags = ptr.readS32()
        this._mangledTypeName = ptr.add(4).readRelativeVectorPointer()
        this._fieldName = ptr.add(8).readRelativeVectorPointer()
    }

    get isVar(): boolean {
        return (this.fieldRecordFlags & 0x2) === 0x2
    }

    get fieldName(): string {
        return this._fieldName.readCString()!
    }

    type(
        genericContext: NativePointer | null = null,
        genericArguments: NativePointer | null = null
    ): NativePointer {
        let typeNamePtr = this._mangledTypeName
        let typeNameLength = this.getSymbolicMangledNameLength(typeNamePtr)
        return swift_getTypeByMangledNameInContext(
            typeNamePtr,
            typeNameLength,
            genericContext ?? new NativePointer(0),
            genericArguments ?? new NativePointer(0)
        )
    }

    private getSymbolicMangledNameLength(base: NativePointer): number {
        let length = 0
        let end = base
        for (let current = end.readU8(); current != 0; current = end.readU8()) {
            length += 1
            if (current >= 0x1 && current <= 0x17) {
                length += 4
            } else if (current >= 0x18 && current <= 0x1F) {
                length += Process.pointerSize
            }
            end = base.add(length)
        }
        return length
    }
}

enum FieldDescriptorKind {
    Struct,
    Class,
    Enum,
    MultiPayloadEnum,
    Protocol,
    ClassProtocol,
    ObjCProtocol,
    ObjCClass,
}